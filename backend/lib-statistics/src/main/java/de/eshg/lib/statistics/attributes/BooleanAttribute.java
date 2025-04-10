/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueType;

public final class BooleanAttribute {
  private BooleanAttribute() {}

  public static AttributeData create(String name, String code, String category, boolean mandatory) {
    return create(name, code, category, mandatory, null);
  }

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      DataPrivacyCategory dataPrivacyCategory) {
    if (DataPrivacyCategory.SENSITIVE.equals(dataPrivacyCategory)) {
      throw new IllegalArgumentException("Use method 'createSensitive' instead");
    }
    return createBooleanAttribute(name, code, category, mandatory, dataPrivacyCategory);
  }

  public static AttributeData createSensitive(
      String name, String code, String category, boolean mandatory, double tCloseness) {
    AttributeData attribute =
        createBooleanAttribute(name, code, category, mandatory, DataPrivacyCategory.SENSITIVE);
    attribute.setTCloseness(tCloseness);
    return attribute;
  }

  private static AttributeData createBooleanAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      DataPrivacyCategory dataPrivacyCategory) {
    AttributeData attribute =
        AttributeData.createAttribute(name, code, category, mandatory, dataPrivacyCategory);
    attribute.setValueType(ValueType.BOOLEAN);
    return attribute;
  }
}
