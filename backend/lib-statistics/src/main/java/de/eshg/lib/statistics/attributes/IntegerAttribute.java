/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.lib.statistics.api.interval.IntervalConfiguration;

public final class IntegerAttribute {
  private IntegerAttribute() {}

  public static AttributeData create(String name, String code, String category, boolean mandatory) {
    return createIntegerAttribute(name, code, category, mandatory, null, null, null);
  }

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption) {
    return createIntegerAttribute(name, code, category, mandatory, null, valueOption, null);
  }

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      String unit,
      ValueOptionInternal valueOption) {
    return createIntegerAttribute(name, code, category, mandatory, unit, valueOption, null);
  }

  public static AttributeData createQuasiIdentifying(
      String name,
      String code,
      String category,
      boolean mandatory,
      String unit,
      ValueOptionInternal valueOption,
      IntervalConfiguration intervalConfiguration) {
    AttributeData attribute =
        createIntegerAttribute(
            name,
            code,
            category,
            mandatory,
            unit,
            valueOption,
            DataPrivacyCategory.QUASI_IDENTIFYING);
    attribute.setIntervalConfiguration(intervalConfiguration);
    return attribute;
  }

  public static AttributeData createInsensitive(
      String name,
      String code,
      String category,
      boolean mandatory,
      String unit,
      ValueOptionInternal valueOption) {
    return createIntegerAttribute(
        name, code, category, mandatory, unit, valueOption, DataPrivacyCategory.INSENSITIVE);
  }

  public static AttributeData createSensitive(
      String name,
      String code,
      String category,
      boolean mandatory,
      String unit,
      ValueOptionInternal valueOption,
      SensitiveParameters sensitiveParameters) {
    AttributeData attribute =
        createIntegerAttribute(
            name, code, category, mandatory, unit, valueOption, DataPrivacyCategory.SENSITIVE);
    attribute.setLDiversity(sensitiveParameters.lDiversity());
    attribute.setTCloseness(sensitiveParameters.tCloseness());
    return attribute;
  }

  private static AttributeData createIntegerAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      String unit,
      ValueOptionInternal valueOption,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute =
        AttributeData.createAttribute(
            name, code, category, mandatory, unit, valueOption, dataPrivacyCategory);
    attribute.setValueType(ValueType.INTEGER);
    return attribute;
  }
}
