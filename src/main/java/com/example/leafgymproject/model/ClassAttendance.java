package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ClassAttendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ClassAttendanceID")
    private Integer classAttendanceId;

    @ManyToOne
    @JoinColumn(name = "GymClassID")
    private GymClass gymClass;

    @ManyToOne
    @JoinColumn(name = "MemberID")
    private Member member;

    @Column(name = "DateAttended")
    private LocalDate dateAttended;

    @Column(name = "AttendanceStatus", length = 20)
    private String attendanceStatus;
}