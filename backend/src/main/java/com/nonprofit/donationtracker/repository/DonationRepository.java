package com.nonprofit.donationtracker.repository;

import com.nonprofit.donationtracker.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
