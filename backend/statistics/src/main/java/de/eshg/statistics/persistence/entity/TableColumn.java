/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(PUBLIC)
@Table(indexes = @Index(columnList = "aggregation_result_id"))
public class TableColumn extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "aggregation_result_id")
  private AbstractAggregationResult aggregationResult;

  @Column(nullable = false)
  private String businessModuleName;

  @Column(nullable = false)
  private String businessModuleAttributeCode;

  @Column(nullable = false)
  private String businessModuleAttributeName;

  @Column private String baseModuleAttributeCode;

  @Column private String baseModuleAttributeName;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private TableColumnValueType valueType;

  @Column private String unit;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = ValueToMeaning_.TABLE_COLUMN,
      orphanRemoval = true)
  @OrderColumn
  private final List<ValueToMeaning> valueToMeanings = new ArrayList<>();

  @OneToMany(fetch = FetchType.LAZY, mappedBy = CellEntry_.TABLE_COLUMN, orphanRemoval = true)
  @OrderBy
  private final List<CellEntry> cellEntries = new ArrayList<>();

  @Column(nullable = false)
  private String dataSourceName;

  @Column(nullable = false)
  private UUID dataSourceId;

  @Column(nullable = false)
  private boolean mandatory;

  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = MinMaxNullUnknownValues_.TABLE_COLUMN,
      orphanRemoval = true)
  private MinMaxNullUnknownValues minMaxNullUnknownValues;

  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  private AnonymizationConfiguration anonymizationConfiguration;

  @Column(nullable = false)
  private String searchKey;

  public AbstractAggregationResult getAggregationResult() {
    return aggregationResult;
  }

  void setAggregationResult(AbstractAggregationResult aggregationResult) {
    this.aggregationResult = aggregationResult;
  }

  public String getBusinessModuleName() {
    return businessModuleName;
  }

  public void setBusinessModuleName(String businessModuleName) {
    this.businessModuleName = businessModuleName;
  }

  public String getBusinessModuleAttributeCode() {
    return businessModuleAttributeCode;
  }

  public void setBusinessModuleAttributeCode(String code) {
    this.businessModuleAttributeCode = code;
  }

  public String getBusinessModuleAttributeName() {
    return businessModuleAttributeName;
  }

  public void setBusinessModuleAttributeName(String businessModuleAttributeName) {
    this.businessModuleAttributeName = businessModuleAttributeName;
  }

  public String getBaseModuleAttributeCode() {
    return baseModuleAttributeCode;
  }

  public void setBaseModuleAttributeCode(String baseModuleAttributeCode) {
    this.baseModuleAttributeCode = baseModuleAttributeCode;
  }

  public String getBaseModuleAttributeName() {
    return baseModuleAttributeName;
  }

  public void setBaseModuleAttributeName(String baseModuleAttributeName) {
    this.baseModuleAttributeName = baseModuleAttributeName;
  }

  public TableColumnValueType getValueType() {
    return valueType;
  }

  public void setValueType(TableColumnValueType valueType) {
    this.valueType = valueType;
  }

  public String getUnit() {
    return unit;
  }

  public void setUnit(String unit) {
    this.unit = unit;
  }

  public List<ValueToMeaning> getValueToMeanings() {
    return valueToMeanings;
  }

  public void setValueToMeanings(List<ValueToMeaning> valueToMeanings) {
    this.valueToMeanings.forEach(valueToMeaning -> valueToMeaning.setTableColumn(null));
    this.valueToMeanings.clear();
    addValueToMeanings(valueToMeanings);
  }

  public void addValueToMeanings(List<ValueToMeaning> valueToMeanings) {
    valueToMeanings.forEach(valueToMeaning -> valueToMeaning.setTableColumn(this));
    this.valueToMeanings.addAll(valueToMeanings);
  }

  public void addCellEntry(CellEntry cellEntry) {
    cellEntry.setTableColumn(this);
    this.cellEntries.add(cellEntry);
  }

  public String getDataSourceName() {
    return dataSourceName;
  }

  public void setDataSourceName(String dataSourceName) {
    this.dataSourceName = dataSourceName;
  }

  public UUID getDataSourceId() {
    return dataSourceId;
  }

  public void setDataSourceId(UUID dataSourceId) {
    this.dataSourceId = dataSourceId;
  }

  public boolean isMandatory() {
    return mandatory;
  }

  public void setMandatory(boolean mandatory) {
    this.mandatory = mandatory;
  }

  public MinMaxNullUnknownValues getMinMaxNullUnknownValues() {
    return minMaxNullUnknownValues;
  }

  public void setMinMaxNullUnknownValues(MinMaxNullUnknownValues minMaxNullUnknownValues) {
    if (minMaxNullUnknownValues != null) {
      minMaxNullUnknownValues.setTableColumn(this);
    }
    this.minMaxNullUnknownValues = minMaxNullUnknownValues;
  }

  public AnonymizationConfiguration getAnonymizationConfiguration() {
    return anonymizationConfiguration;
  }

  public void setAnonymizationConfiguration(AnonymizationConfiguration anonymizationConfiguration) {
    this.anonymizationConfiguration = anonymizationConfiguration;
  }

  public String getSearchKey() {
    return searchKey;
  }

  public void setSearchKey(String searchKey) {
    this.searchKey = searchKey;
  }
}
