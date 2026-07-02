package com.nonprofit.donationtracker.dto;

import com.nonprofit.donationtracker.entity.DonationType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DonationRequest(

        @NotBlank(message = "Donor name is required")
        String donorName,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotNull(message = "Type is required")
        DonationType type,

        String notes
) {
}
