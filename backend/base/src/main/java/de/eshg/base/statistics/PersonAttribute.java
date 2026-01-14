/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.base.statistics.options.GenderOptions;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import java.util.List;
import java.util.stream.IntStream;

public enum PersonAttribute implements CommonAttribute {
  MONTH_OF_BIRTH("Geburtsmonat", "Geburtsmonat", createMonthOptions(), true),

  // interval in 5 year steps
  YEAR_OF_BIRTH(
      "Geburtsjahr",
      "Geburtsjahr",
      ValueType.INTEGER,
      null,
      true,
      new IntegerMinMaxCountIntervalConfiguration(1945, 2099, 31)),

  PLACE_OF_BIRTH("Geburtsort", "Geburtsort", ValueType.TEXT, true),

  COUNTRY_OF_BIRTH_ISO("Geburtsland LKZ", "Geburtsland LKZ", ValueType.TEXT, true),

  GESCHL("Geschlecht", "Geschl", GenderOptions.convertToValueOptions(), true);

  private final String name;

  private final String code;

  private final ValueType type;

  private final List<ValueOptionInternal> valueOptions;

  private final boolean mandatory;

  private final IntervalConfiguration intervalConfiguration;

  PersonAttribute(
      String name,
      String code,
      ValueType type,
      List<ValueOptionInternal> valueOptions,
      boolean mandatory,
      IntervalConfiguration intervalConfiguration) {
    this.name = name;
    this.code = code;
    this.type = type;
    this.valueOptions = valueOptions;
    this.mandatory = mandatory;
    this.intervalConfiguration = intervalConfiguration;
  }

  PersonAttribute(String name, String code, ValueType type, boolean mandatory) {
    this(name, code, type, null, mandatory, null);
  }

  PersonAttribute(
      String name, String code, List<ValueOptionInternal> valueOptions, boolean mandatory) {
    this(name, code, ValueType.VALUE_WITH_OPTIONS, valueOptions, mandatory, null);
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

  @Override
  public IntervalConfiguration getIntervalConfiguration() {
    return intervalConfiguration;
  }

  private static List<ValueOptionInternal> createMonthOptions() {
    return IntStream.rangeClosed(1, 12)
        .mapToObj(
            value -> new ValueOptionInternal(String.valueOf(value), String.valueOf(value), false))
        .toList();
  }
}
