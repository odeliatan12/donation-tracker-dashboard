package com.nonprofit.donationtracker.service;

import com.nonprofit.donationtracker.dto.DashboardSummaryResponse;
import com.nonprofit.donationtracker.dto.DashboardSummaryResponse.DailyTotal;
import com.nonprofit.donationtracker.dto.DashboardSummaryResponse.TypeTotal;
import com.nonprofit.donationtracker.entity.Donation;
import com.nonprofit.donationtracker.entity.DonationType;
import com.nonprofit.donationtracker.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DonationRepository donationRepository;

    public DashboardSummaryResponse getSummary() {
        List<Donation> allDonations = donationRepository.findAll();

        BigDecimal totalAllTime = sumAmounts(allDonations);

        LocalDate today = LocalDate.now();
        LocalDate firstOfMonth = today.withDayOfMonth(1);
        LocalDate lastOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        BigDecimal totalThisMonth = sumAmounts(donationRepository.findByDateBetween(firstOfMonth, lastOfMonth));

        List<DailyTotal> donationsByDate = allDonations.stream()
                .collect(Collectors.groupingBy(
                        Donation::getDate,
                        TreeMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Donation::getAmount, BigDecimal::add)))
                .entrySet().stream()
                .map(entry -> new DailyTotal(entry.getKey(), entry.getValue()))
                .toList();

        Map<DonationType, BigDecimal> totalsByType = allDonations.stream()
                .collect(Collectors.groupingBy(
                        Donation::getType,
                        () -> new EnumMap<>(DonationType.class),
                        Collectors.reducing(BigDecimal.ZERO, Donation::getAmount, BigDecimal::add)));
        List<TypeTotal> donationsByType = totalsByType.entrySet().stream()
                .map(entry -> new TypeTotal(entry.getKey(), entry.getValue()))
                .toList();

        return new DashboardSummaryResponse(
                totalAllTime,
                totalThisMonth,
                allDonations.size(),
                donationsByDate,
                donationsByType);
    }

    private BigDecimal sumAmounts(List<Donation> donations) {
        return donations.stream()
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
