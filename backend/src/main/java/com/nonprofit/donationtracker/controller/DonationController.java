package com.nonprofit.donationtracker.controller;

import com.nonprofit.donationtracker.dto.DonationRequest;
import com.nonprofit.donationtracker.dto.DonationResponse;
import com.nonprofit.donationtracker.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @GetMapping
    public List<DonationResponse> getAll() {
        return donationService.findAll();
    }

    @PostMapping
    public ResponseEntity<DonationResponse> create(@Valid @RequestBody DonationRequest request) {
        DonationResponse created = donationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public DonationResponse update(@PathVariable Long id, @Valid @RequestBody DonationRequest request) {
        return donationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        donationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
