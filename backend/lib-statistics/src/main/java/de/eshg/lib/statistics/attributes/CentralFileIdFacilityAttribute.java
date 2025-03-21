/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.ValueType;

public final class CentralFileIdFacilityAttribute {
  private CentralFileIdFacilityAttribute() {}

  public static AttributeData create(String name, String code, String category, boolean mandatory) {
    AttributeData attribute = AttributeData.createAttribute(name, code, category, mandatory, null);
    attribute.setValueType(ValueType.CENTRAL_FILE_ID_FACILITY);
    return attribute;
  }
}
