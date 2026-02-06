package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "EquipmentMaintenance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentMaintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaintenanceID")
    private Integer maintenanceId;

    @ManyToOne
    @JoinColumn(name = "EquipmentID")
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "StaffID")
    private Staff staff;

    @Column(name = "DescriptionOfIssue", columnDefinition = "TEXT")
    private String descriptionOfIssue;

    @Column(name = "RepairDate")
    private LocalDate repairDate;

    @Column(name = "Cost", precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(name = "Status", length = 20)
    private String status;

    @Column(name = "NextScheduledMaintenance")
    private LocalDate nextScheduledMaintenance;
}
