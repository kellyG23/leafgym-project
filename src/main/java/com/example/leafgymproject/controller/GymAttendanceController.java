package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.GymAttendance;
import com.example.leafgymproject.repository.GymAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gym-attendance")
@CrossOrigin(origins = "*")
public class GymAttendanceController {

    @Autowired
    private GymAttendanceRepository gymAttendanceRepository;

    @GetMapping
    public List<GymAttendance> getAllGymAttendance() {
        return gymAttendanceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymAttendance> getGymAttendanceById(@PathVariable Integer id) {
        return gymAttendanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/member/{memberId}")
    public List<GymAttendance> getGymAttendanceByMember(@PathVariable Integer memberId) {
        return gymAttendanceRepository.findByMemberMemberId(memberId);
    }

    @GetMapping("/date/{date}")
    public List<GymAttendance> getGymAttendanceByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return gymAttendanceRepository.findByDate(localDate);
    }

    @PostMapping
    public GymAttendance createGymAttendance(@RequestBody GymAttendance gymAttendance) {
        return gymAttendanceRepository.save(gymAttendance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GymAttendance> updateGymAttendance(
            @PathVariable Integer id,
            @RequestBody GymAttendance gymAttendanceDetails) {

        return gymAttendanceRepository.findById(id)
                .map(gymAttendance -> {
                    gymAttendance.setMember(gymAttendanceDetails.getMember());
                    gymAttendance.setCheckIn(gymAttendanceDetails.getCheckIn());
                    gymAttendance.setCheckOut(gymAttendanceDetails.getCheckOut());
                    gymAttendance.setDate(gymAttendanceDetails.getDate());
                    return ResponseEntity.ok(gymAttendanceRepository.save(gymAttendance));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGymAttendance(@PathVariable Integer id) {
        if (gymAttendanceRepository.existsById(id)) {
            gymAttendanceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}