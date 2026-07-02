package com.nonprofit.donationtracker.controller;

import com.nonprofit.donationtracker.dto.MonthlyReportResponse;
import com.nonprofit.donationtracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/monthly")
    public MonthlyReportResponse getMonthlyReport(@RequestParam(required = false) String month) {
        YearMonth yearMonth = (month != null) ? YearMonth.parse(month) : YearMonth.now();
        return reportService.getMonthlyReport(yearMonth);
    }
}
