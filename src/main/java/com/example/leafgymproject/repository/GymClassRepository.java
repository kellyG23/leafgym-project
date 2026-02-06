package com.example.leafgymproject.repository;

import com.example.leafgymproject.model.GymClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GymClassRepository extends JpaRepository<GymClass, Integer> {
    List<GymClass> findByScheduleDate(LocalDate scheduleDate);
    List<GymClass> findByStaffStaffId(Integer staffId);
}