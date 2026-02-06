package com.example.leafgymproject.controller;

import com.example.leafgymproject.model.Member;
import com.example.leafgymproject.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Integer id) {
        return memberRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Member createMember(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Integer id, @RequestBody Member memberDetails) {
        return memberRepository.findById(id)
                .map(member -> {
                    member.setUsername(memberDetails.getUsername());
                    member.setFullName(memberDetails.getFullName());
                    member.setAge(memberDetails.getAge());
                    member.setGender(memberDetails.getGender());
                    member.setPhoneNumber(memberDetails.getPhoneNumber());
                    member.setMembershipType(memberDetails.getMembershipType());
                    member.setIsActive(memberDetails.getIsActive());
                    return ResponseEntity.ok(memberRepository.save(member));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Integer id) {
        if (memberRepository.existsById(id)) {
            memberRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}