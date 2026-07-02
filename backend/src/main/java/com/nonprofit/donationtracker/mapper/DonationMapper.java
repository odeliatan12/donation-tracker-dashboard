package com.nonprofit.donationtracker.mapper;

import com.nonprofit.donationtracker.dto.DonationRequest;
import com.nonprofit.donationtracker.dto.DonationResponse;
import com.nonprofit.donationtracker.entity.Donation;

public final class DonationMapper {

    private DonationMapper() {
    }

    public static Donation toEntity(DonationRequest request) {
        return Donation.builder()
                .donorName(request.donorName())
                .amount(request.amount())
                .date(request.date())
                .type(request.type())
                .notes(request.notes())
                .build();
    }

    public static void updateEntity(Donation donation, DonationRequest request) {
        donation.setDonorName(request.donorName());
        donation.setAmount(request.amount());
        donation.setDate(request.date());
        donation.setType(request.type());
        donation.setNotes(request.notes());
    }

    public static DonationResponse toResponse(Donation donation) {
        return new DonationResponse(
                donation.getId(),
                donation.getDonorName(),
                donation.getAmount(),
                donation.getDate(),
                donation.getType(),
                donation.getNotes()
        );
    }
}
