package com.uade.tpo.ecommerce.service;

import lombok.RequiredArgsConstructor;

import com.uade.tpo.ecommerce.entity.*;
import com.uade.tpo.ecommerce.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarritoServiceImpl implements CarritoService {

    private final CarritoRepository carritoRepository;

    private final UsuarioRepository usuarioRepository;

    private final ProductoRepository productoRepository;

    private final OrdenRepository ordenRepository;

    private final DireccionRepository direccionRepository;

    private final EmailService emailService;

    @Override
    public Optional<Carrito> obtenerPorId(Long id) {
        return carritoRepository.findById(id);
    }

    @Override
    public Optional<Carrito> obtenerPorUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Carrito crear(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + usuarioId));

        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        carrito.setSubtotal(0.0);
        carrito.setFechaCreacion(LocalDateTime.now());
        carrito.setFechaExpiracion(LocalDateTime.now().plusDays(7));
        carrito.setEstado(EstadoCarrito.ACTIVO);
        carrito.setItems(new ArrayList<>());
        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito agregarItem(Long carritoId, Long productoId, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }

        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado: " + carritoId));

        if (carrito.getEstado() != EstadoCarrito.ACTIVO) {
            throw new RuntimeException("El carrito no está activo");
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        // Validar stock
        int cantidadTotal = cantidad;
        Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                .filter(i -> i.getProducto().getId().equals(productoId))
                .findFirst();

        if (itemExistente.isPresent()) {
            cantidadTotal += itemExistente.get().getCantidad();
        }

        if (producto.getStock() < cantidadTotal) {
            throw new IllegalArgumentException("Stock insuficiente para " + producto.getNombre()
                    + ". Disponible: " + producto.getStock() + ", solicitado: " + cantidadTotal);
        }

        if (itemExistente.isPresent()) {
            itemExistente.get().setCantidad(cantidadTotal);
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(cantidad);
            nuevoItem.setPrecioUnitario(producto.getPrecio());
            carrito.getItems().add(nuevoItem);
        }

        recalcularSubtotal(carrito);
        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito eliminarItem(Long carritoId, Long itemId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado: " + carritoId));

        carrito.getItems().removeIf(i -> i.getId().equals(itemId));
        recalcularSubtotal(carrito);
        return carritoRepository.save(carrito);
    }

    @Override
    public Carrito vaciar(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado: " + carritoId));

        carrito.getItems().clear();
        carrito.setSubtotal(0.0);
        return carritoRepository.save(carrito);
    }

    @Override
    public Orden confirmar(Long carritoId, Long direccionEnvioId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado: " + carritoId));

        if (carrito.getEstado() != EstadoCarrito.ACTIVO) {
            throw new RuntimeException("El carrito no está activo");
        }
        if (carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Direccion direccion = direccionRepository.findById(direccionEnvioId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada: " + direccionEnvioId));

        if (!direccion.getUsuario().getId().equals(carrito.getUsuario().getId())) {
            throw new IllegalArgumentException("La dirección de envío no pertenece al usuario del carrito");
        }

        // Descontar stock
        for (ItemCarrito item : carrito.getItems()) {
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                throw new IllegalArgumentException("El carrito contiene un ítem con cantidad inválida");
            }
            Producto prod = item.getProducto();
            if (prod.getStock() < item.getCantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para " + prod.getNombre());
            }
            prod.setStock(prod.getStock() - item.getCantidad());
            productoRepository.save(prod);
        }

        // Crear la Orden desde los ítems del Carrito
        Orden orden = new Orden();
        orden.setUsuario(carrito.getUsuario());
        orden.setDireccionEnvio(direccion);
        orden.setEstado(EstadoOrden.PENDIENTE);
        orden.setDescuentoTotal(0.0);
        orden.setFechaCreacion(LocalDateTime.now());

        List<ItemOrden> itemsOrden = carrito.getItems().stream().map(item -> {
            ItemOrden io = new ItemOrden();
            io.setOrden(orden);
            io.setProducto(item.getProducto());
            io.setCantidad(item.getCantidad());
            io.setPrecioUnitario(item.getPrecioUnitario());
            return io;
        }).collect(Collectors.toList());

        orden.setItems(itemsOrden);
        Orden ordenGuardada = ordenRepository.save(orden);

        carrito.setEstado(EstadoCarrito.CONFIRMADO);
        carrito.setOrden(ordenGuardada);
        carritoRepository.save(carrito);

        // Mail de confirmación al usuario (si falla o no está configurado, la compra igual se completa)
        emailService.enviarConfirmacionOrden(carrito.getUsuario().getEmail(), ordenGuardada);

        return ordenGuardada;
    }

    private void recalcularSubtotal(Carrito carrito) {
        double subtotal = carrito.getItems().stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
        carrito.setSubtotal(subtotal);
    }
}
