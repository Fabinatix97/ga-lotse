/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.math.BigDecimal;
import java.util.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(PUBLIC)
public class AnonymizationConfiguration extends BaseEntity {

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private TableColumnDataPrivacyCategory dataPrivacyCategory;

  @Column private Integer lDiversity;

  @Column(precision = 10, scale = 4)
  private BigDecimal tCloseness;

  @Column private Integer intervalCount;

  @Column(precision = 10, scale = 4)
  private BigDecimal minDecimalInclusive;

  @Column(precision = 10, scale = 4)
  private BigDecimal maxDecimalInclusive;

  @ElementCollection
  @CollectionTable(name = "decimal_interval_border_values", joinColumns = @JoinColumn(name = "id"))
  @Column(name = "border", precision = 10, scale = 4, nullable = false)
  private List<BigDecimal> decimalBorders = new ArrayList<>();

  @Column private Integer minIntegerInclusive;

  @Column private Integer maxIntegerInclusive;

  @ElementCollection
  @CollectionTable(name = "integer_interval_border_values", joinColumns = @JoinColumn(name = "id"))
  @Column(name = "border", nullable = false)
  private List<Integer> integerBorders = new ArrayList<>();

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = TClosenessHierarchyEntry_.ANONYMIZATION_CONFIGURATION,
      orphanRemoval = true)
  @OrderBy
  private final List<TClosenessHierarchyEntry> tClosenessHierarchyEntries = new ArrayList<>();

  public TableColumnDataPrivacyCategory getDataPrivacyCategory() {
    return dataPrivacyCategory;
  }

  public void setDataPrivacyCategory(TableColumnDataPrivacyCategory dataPrivacyCategory) {
    this.dataPrivacyCategory = dataPrivacyCategory;
  }

  public Integer getLDiversity() {
    return lDiversity;
  }

  public void setLDiversity(Integer lDiversity) {
    this.lDiversity = lDiversity;
  }

  public BigDecimal getTCloseness() {
    return tCloseness;
  }

  public void setTCloseness(BigDecimal tCloseness) {
    this.tCloseness = tCloseness;
  }

  public Integer getIntervalCount() {
    return intervalCount;
  }

  public void setIntervalCount(Integer intervalCount) {
    this.intervalCount = intervalCount;
  }

  public BigDecimal getMinDecimalInclusive() {
    return minDecimalInclusive;
  }

  public void setMinDecimalInclusive(BigDecimal minDecimalInclusive) {
    this.minDecimalInclusive = minDecimalInclusive;
  }

  public BigDecimal getMaxDecimalInclusive() {
    return maxDecimalInclusive;
  }

  public void setMaxDecimalInclusive(BigDecimal maxDecimalInclusive) {
    this.maxDecimalInclusive = maxDecimalInclusive;
  }

  public Set<BigDecimal> getDecimalBorders() {
    return new TreeSet<>(decimalBorders);
  }

  public void setDecimalBorders(Collection<BigDecimal> decimalBorders) {
    this.decimalBorders.clear();
    this.decimalBorders.addAll(decimalBorders);
  }

  public Integer getMinIntegerInclusive() {
    return minIntegerInclusive;
  }

  public void setMinIntegerInclusive(Integer minIntegerInclusive) {
    this.minIntegerInclusive = minIntegerInclusive;
  }

  public Integer getMaxIntegerInclusive() {
    return maxIntegerInclusive;
  }

  public void setMaxIntegerInclusive(Integer maxIntegerInclusive) {
    this.maxIntegerInclusive = maxIntegerInclusive;
  }

  public Set<Integer> getIntegerBorders() {
    return new TreeSet<>(integerBorders);
  }

  public void setIntegerBorders(Collection<Integer> integerBorders) {
    this.integerBorders.clear();
    this.integerBorders.addAll(integerBorders);
  }

  public List<TClosenessHierarchyEntry> getTClosenessHierarchyEntries() {
    return tClosenessHierarchyEntries;
  }

  public void setTClosenessHierarchyEntries(
      List<TClosenessHierarchyEntry> tClosenessHierarchyEntries) {
    this.tClosenessHierarchyEntries.forEach(
        tClosenessHierarchyEntry -> tClosenessHierarchyEntry.setAnonymizationConfiguration(null));
    this.tClosenessHierarchyEntries.clear();
    this.tClosenessHierarchyEntries.addAll(tClosenessHierarchyEntries);
    this.tClosenessHierarchyEntries.forEach(
        tClosenessHierarchyEntry -> tClosenessHierarchyEntry.setAnonymizationConfiguration(this));
  }
}
