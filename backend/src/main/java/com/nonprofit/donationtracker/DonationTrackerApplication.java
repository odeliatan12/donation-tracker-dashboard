package com.nonprofit.donationtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DonationTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DonationTrackerApplication.class, args);
    }
}
