/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueType;

public final class ProcedureAttribute {
  private ProcedureAttribute() {}

  public static AttributeData create(String name, String category, boolean mandatory) {
    AttributeData attribute =
        AttributeData.createAttribute(
            name, "PROCEDURE_REFERENCE", category, mandatory, DataPrivacyCategory.INSENSITIVE);
    attribute.setValueType(ValueType.PROCEDURE_REFERENCE);
    return attribute;
  }
}
