package com.example.leafgymproject.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "MemberID")
    private Member member;

    @Column(name = "Amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "PaymentDate")
    private LocalDate paymentDate;

    @Column(name = "PaymentMethod", length = 50)
    private String paymentMethod;

    @Column(name = "ReferenceNumber", length = 50)
    private String referenceNumber;
}