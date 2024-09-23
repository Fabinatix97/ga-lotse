/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "table_column_id"))
public class ValueToMeaning extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "table_column_id")
  private TableColumn tableColumn;

  @Column(nullable = false)
  private String value;

  @Column(nullable = false)
  private String meaning;

  @Column private boolean unknownValue;

  void setTableColumn(TableColumn tableColumn) {
    this.tableColumn = tableColumn;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getMeaning() {
    return meaning;
  }

  public void setMeaning(String meaning) {
    this.meaning = meaning;
  }

  public boolean isUnknownValue() {
    return unknownValue;
  }

  public void setUnknownValue(boolean unknownValue) {
    this.unknownValue = unknownValue;
  }
}
