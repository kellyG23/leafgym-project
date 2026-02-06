package com.example.leafgymproject.repository;

import com.example.leafgymproject.model.GymAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GymAttendanceRepository extends JpaRepository<GymAttendance, Integer> {
    List<GymAttendance> findByDate(LocalDate date);
    List<GymAttendance> findByMemberMemberId(Integer memberId);
}