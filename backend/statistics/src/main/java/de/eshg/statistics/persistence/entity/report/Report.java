/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.report;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("REPORT")
@Table(indexes = @Index(columnList = "report_series_id"))
public class Report extends AbstractAggregationResult {

  @DataSensitivity(PUBLIC)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "report_series_id")
  private ReportSeries reportSeries;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private LocalDate executionDate;

  void setReportSeries(ReportSeries reportSeries) {
    this.reportSeries = reportSeries;
  }

  public ReportSeries getReportSeries() {
    return reportSeries;
  }

  public LocalDate getExecutionDate() {
    return executionDate;
  }

  public void setExecutionDate(LocalDate executionDate) {
    this.executionDate = executionDate;
  }
}
