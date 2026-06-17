package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.Cupon;
import com.uade.tpo.ecommerce.repository.CuponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Map;

@Service
@Validated
@RequiredArgsConstructor
public class CuponService {

    private final CuponRepository cuponRepository;

    public List<Cupon> listar() {
        return cuponRepository.findAll();
    }

    public Cupon crear(Cupon cupon) {
        cupon.setCodigo(cupon.getCodigo().toUpperCase().trim());
        if (cuponRepository.findByCodigo(cupon.getCodigo()).isPresent()) {
            throw new IllegalStateException("Ya existe un cupón con ese código");
        }
        return cuponRepository.save(cupon);
    }

    public Cupon actualizar(Long id, Cupon datos) {
        return cuponRepository.findById(id).map(c -> {
            c.setValor(datos.getValor());
            c.setTipo(datos.getTipo());
            c.setUsosMaximos(datos.getUsosMaximos());
            c.setFechaInicio(datos.getFechaInicio());
            c.setFechaFin(datos.getFechaFin());
            c.setActivo(datos.isActivo());
            return cuponRepository.save(c);
        }).orElseThrow(() -> new IllegalArgumentException("Cupón no encontrado"));
    }

    public void eliminar(Long id) {
        cuponRepository.deleteById(id);
    }

    /** Valida el cupón y devuelve código + descuento calculado sobre el subtotal dado */
    public Map<String, Object> validar(String codigo, double subtotal) {
        Cupon cupon = cuponRepository.findByCodigo(codigo.toUpperCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Cupón inválido"));
        if (!cupon.esValido()) {
            throw new IllegalArgumentException("El cupón no está vigente o ya fue utilizado");
        }
        double descuento = cupon.calcularDescuento(subtotal);
        return Map.of(
                "codigo", cupon.getCodigo(),
                "tipo", cupon.getTipo().name(),
                "valor", cupon.getValor(),
                "descuento", descuento,
                "totalFinal", subtotal - descuento
        );
    }

    /** Aplica el cupón (incrementa usosActuales). Llamar al confirmar la orden. */
    public void aplicar(String codigo) {
        cuponRepository.findByCodigo(codigo.toUpperCase().trim()).ifPresent(c -> {
            c.setUsosActuales(c.getUsosActuales() + 1);
            cuponRepository.save(c);
        });
    }
}
