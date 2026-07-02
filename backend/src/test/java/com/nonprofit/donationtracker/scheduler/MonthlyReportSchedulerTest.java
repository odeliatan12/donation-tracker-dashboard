package com.nonprofit.donationtracker.scheduler;

import com.nonprofit.donationtracker.dto.MonthlyReportResponse;
import com.nonprofit.donationtracker.service.ReportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.YearMonth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

@SpringBootTest
class MonthlyReportSchedulerTest {

    @Autowired
    private MonthlyReportScheduler scheduler;

    @Autowired
    private ReportService reportService;

    @Test
    void generatePreviousMonthReportRunsWithoutError() {
        assertThatCode(scheduler::generatePreviousMonthReport).doesNotThrowAnyException();
    }

    @Test
    void reportServiceReturnsPreviousMonthShape() {
        YearMonth previousMonth = YearMonth.now().minusMonths(1);
        MonthlyReportResponse report = reportService.getMonthlyReport(previousMonth);

        assertThat(report.month()).isEqualTo(previousMonth.toString());
        assertThat(report.donationCount()).isGreaterThanOrEqualTo(0);
        assertThat(report.topDonors()).hasSizeLessThanOrEqualTo(5);
    }
}
