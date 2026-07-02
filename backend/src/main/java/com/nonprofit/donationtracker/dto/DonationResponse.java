package com.nonprofit.donationtracker.dto;

import com.nonprofit.donationtracker.entity.DonationType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DonationResponse(
        Long id,
        String donorName,
        BigDecimal amount,
        LocalDate date,
        DonationType type,
        String notes
) {
}
