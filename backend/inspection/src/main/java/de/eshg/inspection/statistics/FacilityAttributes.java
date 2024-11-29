/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import static de.eshg.inspection.statistics.InspectionStatisticsService.ATTRIBUTE_CATEGORY_FACILITY;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.util.AttributeInfo;
import java.util.List;

public enum FacilityAttributes implements AttributeInfo {
  CENTRAL_FILE_ID(
      "Sachstands-ID",
      "CENTRAL_FILE_ID",
      true,
      ValueType.CENTRAL_FILE_ID,
      ATTRIBUTE_CATEGORY_FACILITY,
      true),

  OBJECT_TYPE(
      "Objekttyp",
      "OBJECT_TYPE",
      true,
      ValueType.VALUE_WITH_OPTIONS,
      ATTRIBUTE_CATEGORY_FACILITY,
      false),

  COMPLAINED_ABOUT(
      "Beanstandet",
      "COMPLAINED_ABOUT",
      true,
      ValueType.BOOLEAN,
      ATTRIBUTE_CATEGORY_FACILITY,
      true),

  BANNED("Untersagt", "BANNED", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_FACILITY, true),

  INSPECTED("Begangen", "INSPECTED", true, ValueType.BOOLEAN, ATTRIBUTE_CATEGORY_FACILITY, true),
  ;

  private final String name;

  private final String code;

  private final boolean accessibleForCountyOffice;

  private final ValueType type;

  private final String unit;

  private final List<ValueOptionInternal> valueOptions;
  private final String category;
  private final boolean mandatory;

  FacilityAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      String category,
      boolean mandatory) {
    this(name, code, accessibleForCountyOffice, type, null, null, category, mandatory);
  }

  FacilityAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      String unit,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    this.name = name;
    this.code = code;
    this.accessibleForCountyOffice = accessibleForCountyOffice;
    this.type = type;
    this.unit = unit;
    this.valueOptions = valueOptions;
    this.category = category;
    this.mandatory = mandatory;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public boolean isAccessibleForCountyOffice() {
    return accessibleForCountyOffice;
  }

  @Override
  public ValueType getType() {
    return type;
  }

  @Override
  public String getUnit() {
    return unit;
  }

  @Override
  public List<ValueOptionInternal> getValueOptions() {
    return valueOptions;
  }

  @Override
  public String getCategory() {
    return category;
  }

  @Override
  public boolean isMandatory() {
    return mandatory;
  }
}
