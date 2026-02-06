package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.GymClass;
import com.example.leafgymproject.repository.GymClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class GymClassController {

    @Autowired
    private GymClassRepository gymClassRepository;

    @GetMapping
    public List<GymClass> getAllClasses() {
        return gymClassRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymClass> getClassById(@PathVariable Integer id) {
        return gymClassRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GymClass createClass(@RequestBody GymClass gymClass) {
        return gymClassRepository.save(gymClass);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GymClass> updateClass(@PathVariable Integer id, @RequestBody GymClass classDetails) {
        return gymClassRepository.findById(id)
                .map(gymClass -> {
                    gymClass.setClassName(classDetails.getClassName());
                    gymClass.setStaff(classDetails.getStaff());
                    gymClass.setRoom(classDetails.getRoom());
                    gymClass.setScheduleDate(classDetails.getScheduleDate());
                    gymClass.setStartTime(classDetails.getStartTime());
                    gymClass.setEndTime(classDetails.getEndTime());
                    gymClass.setMaxSlots(classDetails.getMaxSlots());
                    return ResponseEntity.ok(gymClassRepository.save(gymClass));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Integer id) {
        if (gymClassRepository.existsById(id)) {
            gymClassRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
