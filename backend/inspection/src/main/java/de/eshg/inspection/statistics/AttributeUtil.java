/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.objecttype.ObjectTypeProperties;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import java.util.List;

public class AttributeUtil {

  static final String ATTRIBUTE_CATEGORY_INSPECTION = "Begehung";
  static final String ATTRIBUTE_CATEGORY_FACILITY = "Einrichtung";

  private AttributeUtil() {}

  static List<ValueOptionInternal> createObjectTypeOptions(
      ObjectTypeProperties objectTypeProperties) {
    return objectTypeProperties.defaultObjectTypes().stream()
        .map(s -> new ValueOptionInternal(s, s, false))
        .toList();
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
}
