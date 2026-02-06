package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EquipmentID")
    private Integer equipmentId;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Category", length = 50)
    private String category;

    @Column(name = "Brand", length = 50)
    private String brand;

    @Column(name = "State", length = 20)
    private String state;

    @Column(name = "PurchaseDate")
    private LocalDate purchaseDate;

    @Column(name = "LastMaintenanceDate")
    private LocalDate lastMaintenanceDate;

    @Column(name = "NextMaintenanceDate")
    private LocalDate nextMaintenanceDate;

    @Column(name = "Location", length = 100)
    private String location;
}
