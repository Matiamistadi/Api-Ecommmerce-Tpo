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
    public void enviarBienvenida(String destino, String nombre) {
        enviar(destino, "¡Bienvenido a GymStore!", """
                ¡Hola %s!

                Tu cuenta fue creada exitosamente. Ya podés explorar nuestro catálogo y hacer tu primera compra.

                — El equipo de GymStore
                """.formatted(nombre != null && !nombre.isBlank() ? nombre : ""));
    }

    public void enviarRecuperacionPassword(String destino, String token) {
        enviar(destino, "GymStore — Recuperación de contraseña",
                """
                Recibimos una solicitud para restablecer tu contraseña.

                Usá el siguiente código para crear una nueva (válido por 1 hora):

                  %s

                Si no solicitaste esto, ignorá este mail.

                — El equipo de GymStore
                """.formatted(token));
    }

    public void enviarCambioEstadoOrden(String destino, Long ordenId, String nuevoEstado) {
        String mensaje = switch (nuevoEstado) {
            case "ENVIADO"    -> "Tu pedido #%d ya fue enviado y está en camino. 🚚".formatted(ordenId);
            case "ENTREGADO"  -> "Tu pedido #%d fue entregado. ¡Esperamos que lo disfrutes!".formatted(ordenId);
            case "CANCELADO"  -> "Tu pedido #%d fue cancelado. Si tenés dudas, contactanos.".formatted(ordenId);
            case "APROBADO"   -> "Tu pedido #%d fue aprobado y está siendo preparado.".formatted(ordenId);
            case "RECHAZADO"  -> "Tu pedido #%d fue rechazado. Contactanos para más información.".formatted(ordenId);
            default           -> "El estado de tu pedido #%d cambió a: %s".formatted(ordenId, nuevoEstado);
        };
        enviar(destino, "GymStore — Actualización de tu pedido #" + ordenId,
                "Hola,\n\n" + mensaje + "\n\n— El equipo de GymStore");
    }

    public void enviarConfirmacionOrden(String destino, Orden orden) {
        enviar(destino, "GymStore - Confirmación de tu pedido #" + orden.getId(), armarCuerpo(orden));
    }

    private void enviar(String destino, String asunto, String cuerpo) {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null || destino == null || destino.isBlank()) return;
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(destino);
            mensaje.setSubject(asunto);
            mensaje.setText(cuerpo);
            sender.send(mensaje);
        } catch (Exception e) {
            System.err.println("No se pudo enviar mail a " + destino + ": " + e.getMessage());
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
