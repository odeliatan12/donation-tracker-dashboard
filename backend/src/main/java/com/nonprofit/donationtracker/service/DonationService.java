package com.nonprofit.donationtracker.service;

import com.nonprofit.donationtracker.dto.DonationRequest;
import com.nonprofit.donationtracker.dto.DonationResponse;
import com.nonprofit.donationtracker.entity.Donation;
import com.nonprofit.donationtracker.exception.DonationNotFoundException;
import com.nonprofit.donationtracker.mapper.DonationMapper;
import com.nonprofit.donationtracker.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;

    public List<DonationResponse> findAll() {
        return donationRepository.findAll().stream()
                .map(DonationMapper::toResponse)
                .toList();
    }

    public DonationResponse findById(Long id) {
        return DonationMapper.toResponse(getDonationOrThrow(id));
    }

    public DonationResponse create(DonationRequest request) {
        Donation donation = DonationMapper.toEntity(request);
        return DonationMapper.toResponse(donationRepository.save(donation));
    }

    public DonationResponse update(Long id, DonationRequest request) {
        Donation donation = getDonationOrThrow(id);
        DonationMapper.updateEntity(donation, request);
        return DonationMapper.toResponse(donationRepository.save(donation));
    }

    public void delete(Long id) {
        Donation donation = getDonationOrThrow(id);
        donationRepository.delete(donation);
    }

    private Donation getDonationOrThrow(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new DonationNotFoundException(id));
    }
}
