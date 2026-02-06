package com.example.leafgymproject.repository;

import com.example.leafgymproject.model.FacilityUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityUsageRepository extends JpaRepository<FacilityUsage, Integer> {
}