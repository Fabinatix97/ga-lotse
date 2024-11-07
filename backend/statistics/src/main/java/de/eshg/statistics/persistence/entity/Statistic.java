/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportSeries_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("STATISTIC")
public class Statistic extends AbstractAggregationResult {
  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private boolean anonymized;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = ReportSeries_.STATISTIC,
      orphanRemoval = true)
  @OrderBy
  private final List<ReportSeries> reportSeriesList = new ArrayList<>();

  public boolean isAnonymized() {
    return anonymized;
  }

  public void setAnonymized(boolean anonymized) {
    this.anonymized = anonymized;
  }

  public void addReportSeries(ReportSeries reportSeries) {
    reportSeries.setStatistic(this);
    reportSeriesList.add(reportSeries);
  }

  public void removeReportSeriesEntries(List<ReportSeries> reportSeriesList) {
    reportSeriesList.forEach(reportSeries -> reportSeries.setStatistic(null));
    this.reportSeriesList.removeAll(reportSeriesList);
  }

  public List<ReportSeries> getReportSeriesList() {
    return reportSeriesList;
  }
}
