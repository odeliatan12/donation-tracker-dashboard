package com.nonprofit.donationtracker.scheduler;

import com.nonprofit.donationtracker.dto.MonthlyReportResponse;
import com.nonprofit.donationtracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.YearMonth;

@Slf4j
@Component
@RequiredArgsConstructor
public class MonthlyReportScheduler {

    private final ReportService reportService;

    @Scheduled(cron = "0 0 6 1 * *")
    public void generatePreviousMonthReport() {
        YearMonth previousMonth = YearMonth.now().minusMonths(1);
        MonthlyReportResponse report = reportService.getMonthlyReport(previousMonth);

        log.info("Monthly donation report for {}: total={}, donationCount={}, topDonors={}",
                report.month(), report.totalAmount(), report.donationCount(), report.topDonors());
    }
}
