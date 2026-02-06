package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StaffID")
    private Integer staffId;

    @Column(name = "Username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "PasswordHash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Gender", length = 20)
    private String gender;

    @Column(name = "Position", nullable = false, length = 50)
    private String position;

    @Column(name = "Number", length = 20)
    private String number;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "Status", length = 20)
    private String status;
}
