package com.example.leafgymproject.repository;

import com.example.leafgymproject.model.EquipmentMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipmentMaintenanceRepository extends JpaRepository<EquipmentMaintenance, Integer> {
}