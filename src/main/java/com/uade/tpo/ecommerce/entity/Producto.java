package com.uade.tpo.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
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

    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;

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