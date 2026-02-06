package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Member")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MemberID")
    private Integer memberId;

    @Column(name = "Username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "PasswordHash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "FullName", nullable = false, length = 100)
    private String fullName;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Gender", length = 20)
    private String gender;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "MembershipTypeID")
    private MembershipType membershipType;

    @Column(name = "DateJoined")
    private LocalDate dateJoined;

    @Column(name = "isActive")
    private Boolean isActive;
}