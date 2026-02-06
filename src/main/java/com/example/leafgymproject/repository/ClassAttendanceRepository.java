package com.example.leafgymproject.repository;

import com.example.leafgymproject.model.ClassAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassAttendanceRepository extends JpaRepository<ClassAttendance, Integer> {
}