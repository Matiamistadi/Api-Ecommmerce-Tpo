package com.uade.tpo.ecommerce.service;

import lombok.RequiredArgsConstructor;

import com.uade.tpo.ecommerce.entity.EstadoOrden;
import com.uade.tpo.ecommerce.entity.ItemOrden;
import com.uade.tpo.ecommerce.entity.Orden;
import com.uade.tpo.ecommerce.entity.Producto;
import com.uade.tpo.ecommerce.repository.OrdenRepository;
import com.uade.tpo.ecommerce.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrdenServiceImpl implements OrdenService {

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;
    private final EmailService emailService;

    @Override
    public List<Orden> obtenerTodas() {
        return ordenRepository.findAll();
    }

    @Override
    public Optional<Orden> obtenerPorId(Long id) {
        return ordenRepository.findById(id);
    }

    @Override
    public List<Orden> obtenerPorUsuario(Long usuarioId) {
        return ordenRepository.findByUsuarioId(usuarioId);
    }

    @Override
    @Transactional
    public Optional<Orden> actualizarEstado(Long id, EstadoOrden nuevoEstado) {
        return ordenRepository.findById(id).map(o -> {
            EstadoOrden estadoAnterior = o.getEstado();

            boolean estabaCancelada = esCancelada(estadoAnterior);
            boolean quedaCancelada = esCancelada(nuevoEstado);

            // La orden pasa a cancelada/rechazada (y no lo estaba) → devolvemos el stock
            if (quedaCancelada && !estabaCancelada) {
                ajustarStock(o, +1);
            }
            // La orden vuelve a estar activa desde cancelada/rechazada → descontamos de nuevo
            else if (!quedaCancelada && estabaCancelada) {
                ajustarStock(o, -1);
            }

            o.setEstado(nuevoEstado);
            Orden guardada = ordenRepository.save(o);
            String emailUsuario = guardada.getUsuario().getEmail();
            emailService.enviarCambioEstadoOrden(emailUsuario, guardada.getId(), nuevoEstado.name());
            return guardada;
        });
    }

    private boolean esCancelada(EstadoOrden estado) {
        return estado == EstadoOrden.RECHAZADO || estado == EstadoOrden.CANCELADO;
    }

    // signo +1 devuelve stock, -1 lo vuelve a descontar
    private void ajustarStock(Orden orden, int signo) {
        for (ItemOrden item : orden.getItems()) {
            Producto prod = item.getProducto();
            prod.setStock(prod.getStock() + signo * item.getCantidad());
            productoRepository.save(prod);
        }
    }
}
