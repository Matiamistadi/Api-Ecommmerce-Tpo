package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.*;
import com.uade.tpo.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private DireccionRepository direccionRepository;

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
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado: " + carritoId));

        if (carrito.getEstado() != EstadoCarrito.ACTIVO) {
            throw new RuntimeException("El carrito no está activo");
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

        Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                .filter(i -> i.getProducto().getId().equals(productoId))
                .findFirst();

        if (itemExistente.isPresent()) {
            itemExistente.get().setCantidad(itemExistente.get().getCantidad() + cantidad);
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

        // Vincular el Carrito con la Orden creada (corrección 2)
        carrito.setEstado(EstadoCarrito.CONFIRMADO);
        carrito.setOrden(ordenGuardada);
        carritoRepository.save(carrito);

        return ordenGuardada;
    }

    private void recalcularSubtotal(Carrito carrito) {
        double subtotal = carrito.getItems().stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
        carrito.setSubtotal(subtotal);
    }
}
