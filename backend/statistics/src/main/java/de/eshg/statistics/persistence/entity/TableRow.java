/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "aggregation_result_id"))
public class TableRow extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "aggregation_result_id")
  private AbstractAggregationResult aggregationResult;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = CellEntry_.TABLE_ROW,
      orphanRemoval = true)
  @OrderColumn
  private final List<CellEntry> cellEntries = new ArrayList<>();

  void setAggregationResult(AbstractAggregationResult aggregationResult) {
    this.aggregationResult = aggregationResult;
  }

  public List<CellEntry> getCellEntries() {
    return cellEntries;
  }

  public void addCellEntries(List<CellEntry> cellEntries) {
    cellEntries.forEach(this::addCellEntry);
  }

  public void addCellEntry(CellEntry cellEntry) {
    cellEntry.setTableRow(this);
    this.cellEntries.add(cellEntry);
  }
}
