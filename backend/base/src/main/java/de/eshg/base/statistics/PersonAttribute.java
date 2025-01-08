/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.base.statistics.options.GenderOptions;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import java.util.List;
import java.util.stream.IntStream;

public enum PersonAttribute implements CommonAttribute {
  MONTH_OF_BIRTH("Geburtsmonat", "Geburtsmonat", false, createMonthOptions(), true),

  YEAR_OF_BIRTH("Geburtsjahr", "Geburtsjahr", false, ValueType.INTEGER, true),

  PLACE_OF_BIRTH("Geburtsort", "Geburtsort", false, ValueType.TEXT, true),

  COUNTRY_OF_BIRTH_ISO("Geburtsland LKZ", "Geburtsland LKZ", false, ValueType.TEXT, true),

  GESCHL("Geschlecht", "Geschl", true, GenderOptions.convertToValueOptions(), true);

  private final String name;

  private final String code;

  private final boolean accessibleForCountyOffice;

  private final ValueType type;

  private final List<ValueOptionInternal> valueOptions;

  private final boolean mandatory;

  PersonAttribute(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      List<ValueOptionInternal> valueOptions,
      boolean mandatory) {
    this.name = name;
    this.code = code;
    this.accessibleForCountyOffice = accessibleForCountyOffice;
    this.type = type;
    this.valueOptions = valueOptions;
    this.mandatory = mandatory;
  }

  PersonAttribute(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      ValueType type,
      boolean mandatory) {
    this(name, code, accessibleForCountyOffice, type, null, mandatory);
  }

  PersonAttribute(
      String name,
      String code,
      boolean accessibleForCountyOffice,
      List<ValueOptionInternal> valueOptions,
      boolean mandatory) {
    this(
        name,
        code,
        accessibleForCountyOffice,
        ValueType.VALUE_WITH_OPTIONS,
        valueOptions,
        mandatory);
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
  public List<ValueOptionInternal> getValueOptions() {
    return valueOptions;
  }

  @Override
  public boolean isMandatory() {
    return mandatory;
  }

  private static List<ValueOptionInternal> createMonthOptions() {
    return IntStream.rangeClosed(1, 12)
        .mapToObj(
            value -> new ValueOptionInternal(String.valueOf(value), String.valueOf(value), false))
        .toList();
  }
}
