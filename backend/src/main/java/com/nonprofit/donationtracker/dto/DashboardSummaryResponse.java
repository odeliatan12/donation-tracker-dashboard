package com.nonprofit.donationtracker.dto;

import com.nonprofit.donationtracker.entity.DonationType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DashboardSummaryResponse(
        BigDecimal totalAllTime,
        BigDecimal totalThisMonth,
        long totalCount,
        List<DailyTotal> donationsByDate,
        List<TypeTotal> donationsByType
) {
    public record DailyTotal(LocalDate date, BigDecimal amount) {
    }

    public record TypeTotal(DonationType type, BigDecimal amount) {
    }
}
