/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.TClosenessHierarchyEntryDto;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import java.util.List;

public final class ValueWithOptionsAttribute {
  private ValueWithOptionsAttribute() {}

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      List<ValueOptionInternal> valueOptions) {
    return createValueOptionsAttribute(name, code, category, mandatory, valueOptions, null);
  }

  public static AttributeData create(
      String name,
      String code,
      String category,
      boolean mandatory,
      List<ValueOptionInternal> valueOptions,
      DataPrivacyCategory dataPrivacyCategory) {
    if (DataPrivacyCategory.SENSITIVE.equals(dataPrivacyCategory)) {
      throw new IllegalArgumentException("Use method 'createSensitive' instead");
    }
    return createValueOptionsAttribute(
        name, code, category, mandatory, valueOptions, dataPrivacyCategory);
  }

  public static AttributeData createSensitive(
      String name,
      String code,
      String category,
      boolean mandatory,
      List<ValueOptionInternal> valueOptions,
      SensitiveParameters sensitiveParameters,
      List<List<String>> tClosenessHierarchy) {
    if (sensitiveParameters == null) {
      throw new IllegalArgumentException("'sensitiveParameters' is null");
    }
    if (tClosenessHierarchy != null && !tClosenessHierarchy.isEmpty()) {
      int requiredSize = tClosenessHierarchy.getFirst().size();
      if (tClosenessHierarchy.stream().anyMatch(entry -> entry.size() != requiredSize)) {
        throw new IllegalArgumentException("'tClosenessHierarchy' requires lists of the same size");
      }
    }
    AttributeData attribute =
        createValueOptionsAttribute(
            name, code, category, mandatory, valueOptions, DataPrivacyCategory.SENSITIVE);
    attribute.setLDiversity(sensitiveParameters.getLDiversity());
    attribute.setTCloseness(sensitiveParameters.getTCloseness());
    if (tClosenessHierarchy != null) {
      attribute.setTClosenessHierarchy(
          tClosenessHierarchy.stream().map(TClosenessHierarchyEntryDto::new).toList());
    }
    return attribute;
  }

  private static AttributeData createValueOptionsAttribute(
      String name,
      String code,
      String category,
      boolean mandatory,
      List<ValueOptionInternal> valueOptions,
      DataPrivacyCategory dataPrivacyCategory) {
    if (valueOptions == null) {
      throw new IllegalArgumentException("'valueOptions' is null");
    }
    AttributeData attribute =
        AttributeData.createAttribute(
            name, code, category, mandatory, valueOptions, dataPrivacyCategory);
    attribute.setValueType(ValueType.VALUE_WITH_OPTIONS);
    return attribute;
  }
}
