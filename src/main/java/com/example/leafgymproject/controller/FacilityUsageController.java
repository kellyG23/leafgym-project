package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.FacilityUsage;
import com.example.leafgymproject.repository.FacilityUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facility-usage")
@CrossOrigin(origins = "*")
public class FacilityUsageController {

    @Autowired
    private FacilityUsageRepository facilityUsageRepository;

    @GetMapping
    public List<FacilityUsage> getAllFacilityUsage() {
        return facilityUsageRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityUsage> getFacilityUsageById(@PathVariable Integer id) {
        return facilityUsageRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FacilityUsage createFacilityUsage(@RequestBody FacilityUsage facilityUsage) {
        return facilityUsageRepository.save(facilityUsage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacilityUsage> updateFacilityUsage(
            @PathVariable Integer id,
            @RequestBody FacilityUsage facilityUsageDetails) {

        return facilityUsageRepository.findById(id)
                .map(facilityUsage -> {
                    facilityUsage.setFacility(facilityUsageDetails.getFacility());
                    facilityUsage.setMember(facilityUsageDetails.getMember());
                    facilityUsage.setStartTime(facilityUsageDetails.getStartTime());
                    facilityUsage.setEndTime(facilityUsageDetails.getEndTime());
                    return ResponseEntity.ok(facilityUsageRepository.save(facilityUsage));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacilityUsage(@PathVariable Integer id) {
        if (facilityUsageRepository.existsById(id)) {
            facilityUsageRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}