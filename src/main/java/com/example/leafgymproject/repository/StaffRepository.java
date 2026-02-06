package com.example.leafgymproject.repository;

import com.example.leafgymproject.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    Optional<Staff> findByUsername(String username);
    Optional<Staff> findByPosition(String position);
}