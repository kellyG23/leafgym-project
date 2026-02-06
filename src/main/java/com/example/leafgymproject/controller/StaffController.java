package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.Staff;
import com.example.leafgymproject.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Integer id) {
        return staffRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Staff createStaff(@RequestBody Staff staff) {
        return staffRepository.save(staff);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Integer id, @RequestBody Staff staffDetails) {
        return staffRepository.findById(id)
                .map(staff -> {
                    staff.setUsername(staffDetails.getUsername());
                    staff.setName(staffDetails.getName());
                    staff.setAge(staffDetails.getAge());
                    staff.setGender(staffDetails.getGender());
                    staff.setPosition(staffDetails.getPosition());
                    staff.setNumber(staffDetails.getNumber());
                    staff.setEmail(staffDetails.getEmail());
                    staff.setStatus(staffDetails.getStatus());
                    return ResponseEntity.ok(staffRepository.save(staff));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        if (staffRepository.existsById(id)) {
            staffRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}