/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;

public final class TextAttribute {
  private TextAttribute() {}

  public static AttributeData create(String name, String code, String category, boolean mandatory) {
    return createTextAttribute(name, code, category, mandatory, null, null);
  }

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption) {
    return createTextAttribute(name, code, category, mandatory, valueOption, null);
  }

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption,
      DataPrivacyCategory dataPrivacyCategory) {
    return createTextAttribute(name, code, category, mandatory, valueOption, dataPrivacyCategory);
  }

  public static AttributeData createSensitive(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption,
      SensitiveParameters sensitiveParameters) {
    AttributeData attribute =
        createTextAttribute(
            name, code, category, mandatory, valueOption, DataPrivacyCategory.SENSITIVE);
    attribute.setLDiversity(sensitiveParameters.getLDiversity());
    attribute.setTCloseness(sensitiveParameters.getTCloseness());
    return attribute;
  }

  private static AttributeData createTextAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute =
        AttributeData.createAttribute(
            name, code, category, mandatory, null, valueOption, dataPrivacyCategory);
    attribute.setValueType(ValueType.TEXT);
    return attribute;
  }
}
