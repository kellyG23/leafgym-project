package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.Member;
import com.example.leafgymproject.model.Staff;
import com.example.leafgymproject.repository.MemberRepository;
import com.example.leafgymproject.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private StaffRepository staffRepository;

    // Login endpoint for both members and staff
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        if ("member".equalsIgnoreCase(request.getPortal())) {
            // Member login
            Optional<Member> member = memberRepository.findByUsername(request.getUsername());

            if (member.isPresent() && member.get().getPasswordHash().equals(request.getPassword())) {
                Member m = member.get();
                response.put("success", true);
                response.put("userType", "member");
                response.put("userId", m.getMemberId());
                response.put("username", m.getUsername());
                response.put("fullName", m.getFullName());
                response.put("membershipType", m.getMembershipType() != null ? m.getMembershipType().getMembershipName() : "None");
                response.put("isActive", m.getIsActive());
                return ResponseEntity.ok(response);
            }
        } else if ("staff".equalsIgnoreCase(request.getPortal())) {
            // Staff login
            Optional<Staff> staff = staffRepository.findByUsername(request.getUsername());

            if (staff.isPresent() && staff.get().getPasswordHash().equals(request.getPassword())) {
                Staff s = staff.get();
                response.put("success", true);
                response.put("userType", "staff");
                response.put("role", s.getPosition()); // Trainer, Front Desk, Manager, Admin
                response.put("userId", s.getStaffId());
                response.put("username", s.getUsername());
                response.put("name", s.getName());
                response.put("status", s.getStatus());
                return ResponseEntity.ok(response);
            }
        }

        // Login failed
        response.put("success", false);
        response.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }

    // DTO for login request
    public static class LoginRequest {
        private String portal;    // "member" or "staff"
        private String username;
        private String password;

        // Getters and Setters
        public String getPortal() { return portal; }
        public void setPortal(String portal) { this.portal = portal; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}