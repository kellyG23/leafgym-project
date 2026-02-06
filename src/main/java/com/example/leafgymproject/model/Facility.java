package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Facility")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FacilityID")
    private Integer facilityId;

    @Column(name = "FacilityName", nullable = false, length = 100)
    private String facilityName;

    @Column(name = "Type", length = 50)
    private String type;

    @Column(name = "Capacity")
    private Integer capacity;

    @Column(name = "Location", length = 100)
    private String location;

    @Column(name = "IsVIPOnly")
    private Boolean isVipOnly;
}