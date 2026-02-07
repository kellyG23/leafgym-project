package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.Facility;
import com.example.leafgymproject.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    @Autowired
    private FacilityRepository facilityRepository;

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Integer id) {
        return facilityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Facility createFacility(@RequestBody Facility facility) {
        return facilityRepository.save(facility);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Integer id, @RequestBody Facility facilityDetails) {
        return facilityRepository.findById(id)
                .map(facility -> {
                    facility.setFacilityName(facilityDetails.getFacilityName());
                    facility.setType(facilityDetails.getType());
                    facility.setCapacity(facilityDetails.getCapacity());
                    facility.setLocation(facilityDetails.getLocation());
                    facility.setIsVipOnly(facilityDetails.getIsVipOnly());
                    return ResponseEntity.ok(facilityRepository.save(facility));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Integer id) {
        if (facilityRepository.existsById(id)) {
            facilityRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}