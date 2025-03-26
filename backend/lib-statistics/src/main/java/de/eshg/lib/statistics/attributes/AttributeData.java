/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.TClosenessHierarchyEntryDto;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import java.util.List;

public final class AttributeData {
  private ValueType valueType;
  private String name;
  private String code;
  private String unit;
  private List<ValueOptionInternal> valueOptions;
  private String category;
  private boolean mandatory;
  private DataPrivacyCategory dataPrivacyCategory;
  private IntervalConfiguration intervalConfiguration;
  private Integer lDiversity;
  private Double tCloseness;
  private List<TClosenessHierarchyEntryDto> tClosenessHierarchyEntries;

  static AttributeData createAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      String unit,
      ValueOptionInternal valueOption,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute = createAttribute(name, code, category, mandatory, dataPrivacyCategory);
    attribute.setUnit(unit);
    attribute.setValueOption(valueOption);
    attribute.setDataPrivacyCategory(dataPrivacyCategory);
    return attribute;
  }

  static AttributeData createAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      List<ValueOptionInternal> valueOptions,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute = createAttribute(name, code, category, mandatory, dataPrivacyCategory);
    attribute.setValueOptions(valueOptions);
    return attribute;
  }

  static AttributeData createAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute = new AttributeData();
    attribute.setName(name);
    attribute.setCode(code);
    attribute.setCategory(category);
    attribute.setMandatory(mandatory);
    attribute.setDataPrivacyCategory(dataPrivacyCategory);
    return attribute;
  }

  public ValueType getValueType() {
    return valueType;
  }

  public void setValueType(ValueType valueType) {
    this.valueType = valueType;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getUnit() {
    return unit;
  }

  public void setUnit(String unit) {
    this.unit = unit;
  }

  public void setValueOption(ValueOptionInternal valueOption) {
    if (valueOption != null) {
      setValueOptions(List.of(valueOption));
    }
  }

  public List<ValueOptionInternal> getValueOptions() {
    return valueOptions;
  }

  public void setValueOptions(List<ValueOptionInternal> valueOptions) {
    this.valueOptions = valueOptions;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public boolean isMandatory() {
    return mandatory;
  }

  public void setMandatory(boolean mandatory) {
    this.mandatory = mandatory;
  }

  public DataPrivacyCategory getDataPrivacyCategory() {
    return dataPrivacyCategory;
  }

  public void setDataPrivacyCategory(DataPrivacyCategory dataPrivacyCategory) {
    this.dataPrivacyCategory = dataPrivacyCategory;
  }

  public IntervalConfiguration getIntervalConfiguration() {
    return intervalConfiguration;
  }

  public void setIntervalConfiguration(IntervalConfiguration intervalConfiguration) {
    this.intervalConfiguration = intervalConfiguration;
  }

  public Integer getLDiversity() {
    return lDiversity;
  }

  public void setLDiversity(Integer lDiversity) {
    this.lDiversity = lDiversity;
  }

  public Double getTCloseness() {
    return tCloseness;
  }

  public void setTCloseness(Double tCloseness) {
    this.tCloseness = tCloseness;
  }

  public List<TClosenessHierarchyEntryDto> getTClosenessHierarchyEntries() {
    return tClosenessHierarchyEntries;
  }

  public void setTClosenessHierarchy(List<TClosenessHierarchyEntryDto> tClosenessHierarchyEntries) {
    this.tClosenessHierarchyEntries = tClosenessHierarchyEntries;
  }
}
