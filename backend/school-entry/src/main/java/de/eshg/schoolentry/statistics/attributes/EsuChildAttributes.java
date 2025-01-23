/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.ContactIdAttribute;
import de.eshg.lib.statistics.attributes.DateAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;

public enum EsuChildAttributes implements EsuAttributes {
  PROCEDURE_ID(
      new ProcedureAttribute(
          "Vorgangsreferenz", EsuChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      new CentralFileIdPersonAttribute(
          "Kind", "CHILD_CENTRAL_FILE_ID", EsuChildAttributes.CATEGORY_CHILD, true)),

  SCHULE(new ContactIdAttribute("Schule", "SCHULE", EsuChildAttributes.CATEGORY_CHILD, false)),

  WOHND(
      new DateAttribute(
          "bei Einreise: in Deutschland seit (Neue Variable ab S1_2023)",
          "WOHND",
          EsuChildAttributes.CATEGORY_CHILD,
          true)),

  KIH(
      new ValueWithOptionsAttribute(
          "Anzahl der im Haushalt lebenden Kinder",
          "KIH",
          EsuAttributeUtil.createSiblingValueOptions(),
          EsuChildAttributes.CATEGORY_CHILD,
          true));

  private static final String CATEGORY_CHILD = "Kind";
  private static final String CATEGORY_PROCEDURE_REFERENCE = "Vorgangsreferenz";

  private final AttributeData attribute;

  EsuChildAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
