package com.nonprofit.donationtracker.config;

import com.nonprofit.donationtracker.entity.Donation;
import com.nonprofit.donationtracker.entity.DonationType;
import com.nonprofit.donationtracker.repository.DonationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
@Profile("dev")
public class DevDataSeeder {

    @Bean
    CommandLineRunner seedDonations(DonationRepository donationRepository) {
        return args -> {
            if (donationRepository.count() > 0) {
                return;
            }

            donationRepository.saveAll(List.of(
                    Donation.builder().donorName("Jane Doe").amount(new BigDecimal("150.00"))
                            .date(LocalDate.of(2026, 4, 5)).type(DonationType.ONLINE).notes("Monthly giving").build(),
                    Donation.builder().donorName("John Smith").amount(new BigDecimal("75.50"))
                            .date(LocalDate.of(2026, 4, 20)).type(DonationType.CASH).build(),
                    Donation.builder().donorName("Acme Corp").amount(new BigDecimal("500.00"))
                            .date(LocalDate.of(2026, 4, 28)).type(DonationType.EVENT).notes("Spring gala sponsor").build(),
                    Donation.builder().donorName("Maria Garcia").amount(new BigDecimal("200.00"))
                            .date(LocalDate.of(2026, 5, 3)).type(DonationType.ONLINE).build(),
                    Donation.builder().donorName("Robert Lee").amount(new BigDecimal("40.00"))
                            .date(LocalDate.of(2026, 5, 14)).type(DonationType.CASH).build(),
                    Donation.builder().donorName("Sarah Connor").amount(new BigDecimal("1000.00"))
                            .date(LocalDate.of(2026, 5, 22)).type(DonationType.EVENT).notes("Annual dinner").build(),
                    Donation.builder().donorName("Tom Hanks").amount(new BigDecimal("90.25"))
                            .date(LocalDate.of(2026, 6, 2)).type(DonationType.ONLINE).build(),
                    Donation.builder().donorName("Lily Chen").amount(new BigDecimal("60.00"))
                            .date(LocalDate.of(2026, 6, 18)).type(DonationType.CASH).build(),
                    Donation.builder().donorName("David Kim").amount(new BigDecimal("350.00"))
                            .date(LocalDate.of(2026, 6, 25)).type(DonationType.EVENT).build(),
                    Donation.builder().donorName("Jane Doe").amount(new BigDecimal("120.00"))
                            .date(LocalDate.of(2026, 7, 1)).type(DonationType.ONLINE).notes("Monthly giving").build()
            ));
        };
    }
}
