/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.TextAttribute;

public enum EsuProcedureAttribute implements EsuAttributes {
  UNTERSDAT(
      new TextAttribute(
          "Untersuchungsdatum", "UntersDat", EsuProcedureAttribute.CATEGORY_PROCEDURE_INFOS, true));

  private static final String CATEGORY_PROCEDURE_INFOS = "Vorgang";

  private final AttributeData attribute;

  EsuProcedureAttribute(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
