/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.List;

public abstract sealed class AttributeData
    permits BooleanAttribute,
        CentralFileIdFacilityAttribute,
        CentralFileIdPersonAttribute,
        ContactIdAttribute,
        DateAttribute,
        DecimalAttribute,
        IntegerAttribute,
        ProcedureAttribute,
        TextAttribute,
        ValueWithOptionsAttribute {
  private final String name;
  private final String code;
  private final String unit;
  private final List<ValueOptionInternal> valueOptions;
  private final String category;
  private final boolean mandatory;

  protected AttributeData(
      String name,
      String code,
      String unit,
      ValueOptionInternal valueOption,
      String category,
      boolean mandatory) {
    this(name, code, unit, toList(valueOption), category, mandatory);
  }

  protected AttributeData(
      String name,
      String code,
      ValueOptionInternal valueOption,
      String category,
      boolean mandatory) {
    this(name, code, null, toList(valueOption), category, mandatory);
  }

  protected AttributeData(String name, String code, String category, boolean mandatory) {
    this(name, code, null, (ValueOptionInternal) null, category, mandatory);
  }

  protected AttributeData(
      String name,
      String code,
      String unit,
      List<ValueOptionInternal> valueOptions,
      String category,
      boolean mandatory) {
    this.name = name;
    this.code = code;
    this.unit = unit;
    this.valueOptions = valueOptions;
    this.category = category;
    this.mandatory = mandatory;
  }

  private static List<ValueOptionInternal> toList(ValueOptionInternal valueOption) {
    if (valueOption == null) {
      return null;
    }
    return List.of(valueOption);
  }

  public String getName() {
    return name;
  }

  public String getCode() {
    return code;
  }

  public String getUnit() {
    return unit;
  }

  public List<ValueOptionInternal> getValueOptions() {
    return valueOptions;
  }

  public String getCategory() {
    return category;
  }

  public boolean isMandatory() {
    return mandatory;
  }
}
