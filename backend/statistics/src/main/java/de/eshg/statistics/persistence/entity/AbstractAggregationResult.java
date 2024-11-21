/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAggregationResult extends BaseEntityWithExternalId {

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
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AggregationResultState state;

  @DataSensitivity(PUBLIC)
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AggregationResultPendingState pendingState;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private Instant timeRangeStart;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private Instant timeRangeEnd;

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private String name;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = TableColumn_.AGGREGATION_RESULT,
      orphanRemoval = true)
  @OrderColumn
  private final List<TableColumn> tableColumns = new ArrayList<>();

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = TableRow_.AGGREGATION_RESULT,
      orphanRemoval = true)
  @OrderBy
  private final List<TableRow> tableRows = new ArrayList<>();

  @DataSensitivity(PUBLIC)
  @Column(nullable = false)
  private Long numberOfTableRows;

  @DataSensitivity(PUBLIC)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = Analysis_.AGGREGATION_RESULT,
      orphanRemoval = true)
  @OrderBy
  private final List<Analysis> analyses = new ArrayList<>();

  public Instant getCreatedAt() {
    return createdAt;
  }

  public UUID getCreatedByUserId() {
    return createdByUserId;
  }

  public AggregationResultState getState() {
    return state;
  }

  public void setState(AggregationResultState state) {
    this.state = state;
  }

  public AggregationResultPendingState getPendingState() {
    return pendingState;
  }

  public void setPendingState(AggregationResultPendingState pendingState) {
    this.pendingState = pendingState;
  }

  public Instant getTimeRangeStart() {
    return timeRangeStart;
  }

  public void setTimeRangeStart(Instant eventStart) {
    this.timeRangeStart = eventStart;
  }

  public Instant getTimeRangeEnd() {
    return timeRangeEnd;
  }

  public void setTimeRangeEnd(Instant eventEnd) {
    this.timeRangeEnd = eventEnd;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<TableColumn> getTableColumns() {
    return tableColumns;
  }

  public void addTableColumns(List<TableColumn> tableColumns) {
    tableColumns.forEach(tableColumn -> tableColumn.setAggregationResult(this));
    this.tableColumns.addAll(tableColumns);
  }

  public void addTableRows(List<TableRow> tableRows) {
    tableRows.forEach(this::addTableRow);
  }

  public void addTableRow(TableRow tableRow) {
    tableRow.setAggregationResult(this);
    this.tableRows.add(tableRow);
  }

  public long getNumberOfTableRows() {
    return numberOfTableRows;
  }

  public void setNumberOfTableRows(long numberOfTableRows) {
    this.numberOfTableRows = numberOfTableRows;
  }

  public void addAnalysis(Analysis analysis) {
    analysis.setAggregationResult(this);
    this.analyses.add(analysis);
  }

  public void addAnalyses(Collection<Analysis> analyses) {
    analyses.forEach(this::addAnalysis);
  }

  public List<Analysis> getAnalyses() {
    return analyses;
  }
}
