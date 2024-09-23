/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.report;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.Statistic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "statistic_id"))
public class ReportSeries extends BaseEntityWithExternalId {

  @DataSensitivity(PROTECTED)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(PROTECTED)
  @CreatedBy
  @Column(nullable = false)
  private UUID createdByUserId;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String name;

  @DataSensitivity(PUBLIC)
  @Column
  private String description;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ReportType reportType;

  @DataSensitivity(PUBLIC)
  @Column
  private Instant timeRangeStart;

  @DataSensitivity(PUBLIC)
  @Column
  private Instant timeRangeEnd;

  @DataSensitivity(PUBLIC)
  @Column
  private boolean active;

  @DataSensitivity(PUBLIC)
  @Column
  private int startMonth;

  @DataSensitivity(PUBLIC)
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Frequency frequency;

  @DataSensitivity(PUBLIC)
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ReportingPeriod period;

  @DataSensitivity(PUBLIC)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "statistic_id")
  private Statistic statistic;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = Report_.REPORT_SERIES,
      orphanRemoval = true)
  @OrderBy
  private final List<Report> reports = new ArrayList<>();

  public Instant getCreatedAt() {
    return createdAt;
  }

  public UUID getCreatedByUserId() {
    return createdByUserId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public ReportType getReportType() {
    return reportType;
  }

  public void setReportType(ReportType reportType) {
    this.reportType = reportType;
  }

  public Instant getTimeRangeStart() {
    return timeRangeStart;
  }

  public void setTimeRangeStart(Instant timeRangeStart) {
    this.timeRangeStart = timeRangeStart;
  }

  public Instant getTimeRangeEnd() {
    return timeRangeEnd;
  }

  public void setTimeRangeEnd(Instant timeRangeEnd) {
    this.timeRangeEnd = timeRangeEnd;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public int getStartMonth() {
    return startMonth;
  }

  public void setStartMonth(int startMonth) {
    this.startMonth = startMonth;
  }

  public Frequency getFrequency() {
    return frequency;
  }

  public void setFrequency(Frequency frequency) {
    this.frequency = frequency;
  }

  public ReportingPeriod getPeriod() {
    return period;
  }

  public void setPeriod(ReportingPeriod period) {
    this.period = period;
  }

  public Statistic getStatistic() {
    return statistic;
  }

  public void setStatistic(Statistic statistic) {
    this.statistic = statistic;
  }

  public void addReport(Report report) {
    report.setReportSeries(this);
    reports.add(report);
  }

  public List<Report> getReports() {
    return reports;
  }
}
