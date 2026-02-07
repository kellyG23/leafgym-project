package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.ClassAttendance;
import com.example.leafgymproject.repository.ClassAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class-attendance")
@CrossOrigin(origins = "*")
public class ClassAttendanceController {

    @Autowired
    private ClassAttendanceRepository classAttendanceRepository;

    @GetMapping
    public List<ClassAttendance> getAllClassAttendance() {
        return classAttendanceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassAttendance> getClassAttendanceById(@PathVariable Integer id) {
        return classAttendanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClassAttendance createClassAttendance(@RequestBody ClassAttendance classAttendance) {
        return classAttendanceRepository.save(classAttendance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassAttendance> updateClassAttendance(
            @PathVariable Integer id,
            @RequestBody ClassAttendance classAttendanceDetails) {

        return classAttendanceRepository.findById(id)
                .map(classAttendance -> {
                    classAttendance.setGymClass(classAttendanceDetails.getGymClass());
                    classAttendance.setMember(classAttendanceDetails.getMember());
                    classAttendance.setDateAttended(classAttendanceDetails.getDateAttended());
                    classAttendance.setAttendanceStatus(classAttendanceDetails.getAttendanceStatus());
                    return ResponseEntity.ok(classAttendanceRepository.save(classAttendance));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassAttendance(@PathVariable Integer id) {
        if (classAttendanceRepository.existsById(id)) {
            classAttendanceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}