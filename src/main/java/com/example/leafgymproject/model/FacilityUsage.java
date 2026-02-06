package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "FacilityUsage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsageID")
    private Integer usageId;

    @ManyToOne
    @JoinColumn(name = "FacilityID")
    private Facility facility;

    @ManyToOne
    @JoinColumn(name = "MemberID")
    private Member member;

    @Column(name = "StartTime")
    private LocalDateTime startTime;

    @Column(name = "EndTime")
    private LocalDateTime endTime;
}