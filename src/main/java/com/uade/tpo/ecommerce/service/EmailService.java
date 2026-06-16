package com.uade.tpo.ecommerce.service;

import com.uade.tpo.ecommerce.entity.ItemOrden;
import com.uade.tpo.ecommerce.entity.Orden;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    // ObjectProvider: si no hay configuración de mail, el bean no existe y no pasa nada
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${spring.mail.username:}")
    private String remitente;

    // Nombre que ve el cliente como remitente (ej: "GymStore"), configurable
    @Value("${app.mail.nombre:GymStore}")
    private String nombreRemitente;

    /**
     * Envía el mail de confirmación de la compra.
     * Si el mail no está configurado o falla, NO interrumpe la compra (solo no manda nada).
     */
    public void enviarConfirmacionOrden(String destino, Orden orden) {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null || destino == null || destino.isBlank()) {
            return; // mail no configurado → no hacemos nada
        }

        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(destino);
            mensaje.setSubject("GymStore - Confirmación de tu pedido #" + orden.getId());
            mensaje.setText(armarCuerpo(orden));
            sender.send(mensaje);
        } catch (Exception e) {
            // Nunca rompemos el checkout por un problema de email
            System.err.println("No se pudo enviar el mail de confirmación: " + e.getMessage());
        }
    }

    private String armarCuerpo(Orden orden) {
        StringBuilder sb = new StringBuilder();
        sb.append("¡Gracias por tu compra en GymStore!\n\n");
        sb.append("Tu pedido #").append(orden.getId()).append(" fue recibido y está ")
          .append(orden.getEstado()).append(".\n\n");
        sb.append("Detalle:\n");

        double total = 0;
        for (ItemOrden item : orden.getItems()) {
            double subtotal = item.getPrecioUnitario() * item.getCantidad();
            total += subtotal;
            sb.append("  - ")
              .append(item.getProducto().getNombre())
              .append("  x").append(item.getCantidad())
              .append("  $").append(String.format("%.2f", subtotal))
              .append("\n");
        }
        sb.append("\nTotal: $").append(String.format("%.2f", total)).append("\n\n");
        sb.append("Te avisaremos cuando tu pedido sea despachado.\n");
        sb.append("Equipo de GymStore");
        return sb.toString();
    }
}
