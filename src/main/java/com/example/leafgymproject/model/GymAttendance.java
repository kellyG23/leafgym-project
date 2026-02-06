package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "GymAttendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GymAttendanceID")
    private Integer gymAttendanceId;

    @ManyToOne
    @JoinColumn(name = "MemberID")
    private Member member;

    @Column(name = "CheckIn")
    private LocalDateTime checkIn;

    @Column(name = "CheckOut")
    private LocalDateTime checkOut;

    @Column(name = "Date")
    private LocalDate date;
}
