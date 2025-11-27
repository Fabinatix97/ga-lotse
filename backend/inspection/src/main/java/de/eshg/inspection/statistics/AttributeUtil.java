/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import java.util.List;

class AttributeUtil {

  static final String ATTRIBUTE_CATEGORY_INSPECTION = "Hygiene";
  static final String ATTRIBUTE_CATEGORY_FACILITY = "Einrichtung";

  private AttributeUtil() {}

  static void addValueOptions(AttributeInfo attribute, ObjectTypeProperties objectTypeProperties) {
    List<ValueOptionInternal> valueOptions = attribute.getValueOptions();
    objectTypeProperties.defaultObjectTypes().stream()
        .map(value -> new ValueOptionInternal(value, value, false))
        .forEach(valueOptions::add);
  }

  static List<ValueOptionInternal> createResultOptions() {
    return List.of(
        new ValueOptionInternal(InspectionResult.OPEN.name(), "Offen", false),
        new ValueOptionInternal(InspectionResult.SUCCESSFUL.name(), "Erfolgreich", false),
        new ValueOptionInternal(InspectionResult.FAILED.name(), "Negativ", false),
        new ValueOptionInternal(
            InspectionResult.SUCCESSFUL_WITH_INCIDENTS.name(),
            "Erfolgreich mit Beanstandungen",
            false));
  }

  static String getObjectTypeName(ObjectType objectType) {
    if (objectType == null) {
      return null;
    }
    return objectType.getName();
  }
}
