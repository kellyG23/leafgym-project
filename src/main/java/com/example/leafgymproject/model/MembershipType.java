package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "MembershipType")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MembershipID")
    private Integer membershipId;

    @Column(name = "MembershipName", nullable = false, length = 100)
    private String membershipName;

    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "Duration", nullable = false)
    private Integer duration;

    @Column(name = "AccessLevel", length = 100)
    private String accessLevel;
}