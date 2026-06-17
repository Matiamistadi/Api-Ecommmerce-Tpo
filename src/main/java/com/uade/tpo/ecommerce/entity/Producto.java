package com.uade.tpo.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    @PositiveOrZero(message = "El precio original no puede ser negativo")
    @Column(name = "precio_original")
    private Double precioOriginal;

    @NotNull(message = "El stock es obligatorio")
    @PositiveOrZero(message = "El stock no puede ser negativo")
    private Integer stock;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "id_vendedor")
    private Usuario vendedor;

    @JsonManagedReference
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ImagenProducto> imagenes;

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "producto")
    private List<ProductoDescuento> descuentos;

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "producto")
    private List<ItemCarrito> itemsCarrito;

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "producto")
    private List<ItemOrden> itemsOrden;
}