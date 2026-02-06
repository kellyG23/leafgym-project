package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "GymClass")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GymClassID")
    private Integer gymClassId;

    @Column(name = "ClassName", nullable = false, length = 100)
    private String className;

    @ManyToOne
    @JoinColumn(name = "StaffID")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "RoomID")
    private Room room;

    @Column(name = "ScheduleDate")
    private LocalDate scheduleDate;

    @Column(name = "StartTime")
    private LocalTime startTime;

    @Column(name = "EndTime")
    private LocalTime endTime;

    @Column(name = "MaxSlots")
    private Integer maxSlots;
}