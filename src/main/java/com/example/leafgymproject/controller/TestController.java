// controller/TestController.java
package com.example.leafgymproject.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello! Spring Boot is working!";
    }

    @GetMapping("/status")
    public String status() {
        return "{ \"status\": \"OK\", \"message\": \"Backend is running successfully\" }";
    }

    @PostMapping("/echo")
    public String echo(@RequestBody String message) {
        return "You sent: " + message;
    }
}