package com.nonprofit.donationtracker.service;

import com.nonprofit.donationtracker.dto.MonthlyReportResponse;
import com.nonprofit.donationtracker.dto.MonthlyReportResponse.DonorTotal;
import com.nonprofit.donationtracker.entity.Donation;
import com.nonprofit.donationtracker.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final int TOP_DONORS_LIMIT = 5;

    private final DonationRepository donationRepository;

    public MonthlyReportResponse getMonthlyReport(YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        List<Donation> donations = donationRepository.findByDateBetween(start, end);

        BigDecimal totalAmount = donations.stream()
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> totalsByDonor = donations.stream()
                .collect(Collectors.groupingBy(
                        Donation::getDonorName,
                        Collectors.reducing(BigDecimal.ZERO, Donation::getAmount, BigDecimal::add)));

        List<DonorTotal> topDonors = totalsByDonor.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .limit(TOP_DONORS_LIMIT)
                .map(entry -> new DonorTotal(entry.getKey(), entry.getValue()))
                .toList();

        return new MonthlyReportResponse(month.toString(), totalAmount, donations.size(), topDonors);
    }
}
