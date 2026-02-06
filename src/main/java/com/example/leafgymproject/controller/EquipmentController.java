package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.Equipment;
import com.example.leafgymproject.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Integer id) {
        return equipmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Equipment createEquipment(@RequestBody Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Integer id, @RequestBody Equipment equipmentDetails) {
        return equipmentRepository.findById(id)
                .map(equipment -> {
                    equipment.setName(equipmentDetails.getName());
                    equipment.setCategory(equipmentDetails.getCategory());
                    equipment.setBrand(equipmentDetails.getBrand());
                    equipment.setState(equipmentDetails.getState());
                    equipment.setLocation(equipmentDetails.getLocation());
                    equipment.setLastMaintenanceDate(equipmentDetails.getLastMaintenanceDate());
                    equipment.setNextMaintenanceDate(equipmentDetails.getNextMaintenanceDate());
                    return ResponseEntity.ok(equipmentRepository.save(equipment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Integer id) {
        if (equipmentRepository.existsById(id)) {
            equipmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}