/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import static de.eshg.inspection.statistics.InspectionStatisticsService.ATTRIBUTE_CATEGORY_INSPECTION;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.util.AttributeInfo;
import java.util.List;

public enum InspectionAttributes implements AttributeInfo {
  PROCEDURE_ID(
      "Vorgangsreferenz",
      "PROCEDURE_ID",
      true,
      ValueType.PROCEDURE_ID,
      ATTRIBUTE_CATEGORY_INSPECTION,
      true),

  FACILITY_CENTRAL_FILE_ID(
      "Einrichtung",
      "FACILITY_CENTRAL_FILE_ID",
      true,
      ValueType.CENTRAL_FILE_ID,
      ATTRIBUTE_CATEGORY_INSPECTION,
      true),

  YEAR_OF_INSPECTION(
      "Begehungsjahr",
      "YEAR_OF_INSPECTION",
      true,
      ValueType.DATE,
      ATTRIBUTE_CATEGORY_INSPECTION,
      false),

  OBJECT_TYPE(
      "Objekttyp",
      "OBJECT_TYPE",
      true,
      ValueType.VALUE_WITH_OPTIONS,
      ATTRIBUTE_CATEGORY_INSPECTION,
      false),

  RESULT(
      "Ergebnis",
      "RESULT",
      true,
      ValueType.VALUE_WITH_OPTIONS,
      ATTRIBUTE_CATEGORY_INSPECTION,
      true),

  DURATION(
      "Zeit vor Ort (Minuten)",
      "DURATION",
      true,
      ValueType.INTEGER,
      ATTRIBUTE_CATEGORY_INSPECTION,
      false),

  NUMBER_OF_INCIDENTS(
      "Anzahl Vorkommnisse",
      "NUMBER_OF_INCIDENTS",
      true,
      ValueType.INTEGER,
      ATTRIBUTE_CATEGORY_INSPECTION,
      true),
  ;

  private final String name;

  private final String code;

  private final boolean accessibleForCountyOffice;

  private final ValueType type;

  private final String unit;

  private final List<ValueOptionInternal> valueOptions;
  private final String category;
  private final boolean mandatory;

  InspectionAttributes(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      String category,
      boolean mandatory) {
    this(name, code, accessibleForCountyOffice, type, null, null, category, mandatory);
  }

  InspectionAttributes(
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
