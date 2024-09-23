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
import jakarta.persistence.OneToOne;
import java.math.BigDecimal;

@Entity
@DataSensitivity(PUBLIC)
public class MinMaxNullUnknownValues extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY)
  private TableColumn tableColumn;

  @Column(precision = 10, scale = 4)
  private BigDecimal minDecimal;

  @Column(precision = 10, scale = 4)
  private BigDecimal maxDecimal;

  @Column private Integer minInteger;

  @Column private Integer maxInteger;

  @Column(nullable = false)
  private Long numberOfNullEntries;

  @Column private Long numberOfUnknownEntries;

  @Column private String unknownValue;

  void setTableColumn(TableColumn tableColumn) {
    this.tableColumn = tableColumn;
  }

  public BigDecimal getMinDecimal() {
    return minDecimal;
  }

  public void setMinDecimal(BigDecimal minDecimal) {
    this.minDecimal = minDecimal;
  }

  public BigDecimal getMaxDecimal() {
    return maxDecimal;
  }

  public void setMaxDecimal(BigDecimal maxDecimal) {
    this.maxDecimal = maxDecimal;
  }

  public Integer getMinInteger() {
    return minInteger;
  }

  public void setMinInteger(Integer minInteger) {
    this.minInteger = minInteger;
  }

  public Integer getMaxInteger() {
    return maxInteger;
  }

  public void setMaxInteger(Integer maxInteger) {
    this.maxInteger = maxInteger;
  }

  public Long getNumberOfNullEntries() {
    return numberOfNullEntries;
  }

  public void setNumberOfNullEntries(Long numberOfNullEntries) {
    this.numberOfNullEntries = numberOfNullEntries;
  }

  public Long getNumberOfUnknownEntries() {
    return numberOfUnknownEntries;
  }

  public void setNumberOfUnknownEntries(Long numberOfUnknownEntries) {
    this.numberOfUnknownEntries = numberOfUnknownEntries;
  }

  public String getUnknownValue() {
    return unknownValue;
  }

  public void setUnknownValue(String unknownValue) {
    this.unknownValue = unknownValue;
  }
}
