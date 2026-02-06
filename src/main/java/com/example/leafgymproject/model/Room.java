package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomId;

    @Column(name = "RoomName", nullable = false, length = 100)
    private String roomName;

    @Column(name = "Capacity")
    private Integer capacity;

    @Column(name = "Type", length = 50)
    private String type;

    @Column(name = "Location", length = 100)
    private String location;

    @ManyToOne
    @JoinColumn(name = "StaffID")
    private Staff staff;
}
