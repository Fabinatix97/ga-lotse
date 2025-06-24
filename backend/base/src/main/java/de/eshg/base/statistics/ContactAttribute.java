/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import jakarta.annotation.Nullable;
import java.util.List;

public enum ContactAttribute implements CommonAttribute {
  NAME("Name", "Name", ValueType.TEXT, null, false),

  OBJECT_TYPE(
      "Objekttyp",
      "Objekttyp",
      ValueType.VALUE_WITH_OPTIONS,
      List.of(
          new ValueOptionInternal("LABORATORY", "Labor", false),
          new ValueOptionInternal("SCHOOL", "Schule", false),
          new ValueOptionInternal("DAYCARE", "Kindertagesstätte", false),
          new ValueOptionInternal("DOCTORS_OFFICE", "Arztpraxis", false),
          new ValueOptionInternal("HEALTH_DEPARTMENT", "Gesundheitsamt", false),
          new ValueOptionInternal("MISC", "Sonstiges", false)),
      false),

  OBJECT_SUB_TYPE(
      "Objektart",
      "Objektart",
      ValueType.VALUE_WITH_OPTIONS,
      List.of(
          new ValueOptionInternal("BERUFSSCHULE", "Berufsschule", false),
          new ValueOptionInternal("FOERDERSCHULE", "Förderschule", false),
          new ValueOptionInternal("GRUNDSCHULE", "Grundschule", false),
          new ValueOptionInternal("GRUND_HAUPTSCHULE", "Grund-Hauptschule", false),
          new ValueOptionInternal("GRUND_HAUPT_REALSCHULE", "Grund-Haupt-Realschule", false),
          new ValueOptionInternal("GYMNASIUM", "Gymnasium", false),
          new ValueOptionInternal("HAUPTSCHULE", "Hauptschule", false),
          new ValueOptionInternal("HAUPT_REALSCHULE", "Haupt-Realschule", false),
          new ValueOptionInternal("INTEGRIERTE_GESAMTSCHULE", "Integrierte Gesamtschule", false),
          new ValueOptionInternal("KOOPERATIVE_GESAMTSCHULE", "Kooperative Gesamtschule", false),
          new ValueOptionInternal("REALSCHULE", "Realschule", false)),
      false);

  private final String name;

  private final String code;

  private final ValueType type;

  private final List<ValueOptionInternal> valueOptions;

  private final boolean mandatory;

  ContactAttribute(
      String name,
      String code,
      ValueType type,
      List<ValueOptionInternal> valueOptions,
      boolean mandatory) {
    this.name = name;
    this.code = code;
    this.type = type;
    this.valueOptions = valueOptions;
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
  public ValueType getType() {
    return type;
  }

  @Override
  @Nullable
  public List<ValueOptionInternal> getValueOptions() {
    return valueOptions;
  }

  @Override
  public boolean isMandatory() {
    return mandatory;
  }

  @Override
  public IntervalConfiguration getIntervalConfiguration() {
    return null;
  }
}
