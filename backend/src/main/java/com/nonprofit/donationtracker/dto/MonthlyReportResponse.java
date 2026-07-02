package com.nonprofit.donationtracker.dto;

import java.math.BigDecimal;
import java.util.List;

public record MonthlyReportResponse(
        String month,
        BigDecimal totalAmount,
        long donationCount,
        List<DonorTotal> topDonors
) {
    public record DonorTotal(String donorName, BigDecimal totalAmount) {
    }
}
