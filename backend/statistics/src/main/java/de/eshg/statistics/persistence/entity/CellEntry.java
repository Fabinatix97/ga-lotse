/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "entry_type")
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"table_column_id", "table_row_id"}),
    indexes = @Index(columnList = "table_row_id"))
public abstract class CellEntry extends SequencedBaseEntity {

  @DataSensitivity(PUBLIC)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "table_row_id")
  private TableRow tableRow;

  @DataSensitivity(PUBLIC)
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "table_column_id")
  private TableColumn tableColumn;

  void setTableRow(TableRow tableRow) {
    this.tableRow = tableRow;
  }

  public TableColumn getTableColumn() {
    return tableColumn;
  }

  void setTableColumn(TableColumn tableColumn) {
    this.tableColumn = tableColumn;
  }

  public abstract Object getValue();
}
