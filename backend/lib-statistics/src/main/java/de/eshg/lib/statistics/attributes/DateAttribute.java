/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;

public final class DateAttribute {
  private DateAttribute() {}

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption,
      DataPrivacyCategory dataPrivacyCategory) {
    return createDateAttribute(name, code, category, mandatory, valueOption, dataPrivacyCategory);
  }

  public static AttributeData createSensitive(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption,
      SensitiveParameters sensitiveParameters) {
    AttributeData attribute =
        createDateAttribute(
            name, code, category, mandatory, valueOption, DataPrivacyCategory.SENSITIVE);
    attribute.setLDiversity(sensitiveParameters.getLDiversity());
    attribute.setTCloseness(sensitiveParameters.getTCloseness());
    return attribute;
  }

  private static AttributeData createDateAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      ValueOptionInternal valueOption,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute =
        AttributeData.createAttribute(name, code, category, mandatory, dataPrivacyCategory);
    attribute.setValueType(ValueType.DATE);
    attribute.setValueOption(valueOption);
    return attribute;
  }
}
