/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.ContactIdAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;

public enum EsuChildAttributes implements EsuAttributes {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", EsuChildAttributes.CATEGORY_PROCEDURE_REFERENCE, true)),

  CHILD_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Kind", "CHILD_CENTRAL_FILE_ID", EsuChildAttributes.CATEGORY_CHILD, true)),

  SCHULE(ContactIdAttribute.create("Schule", "SCHULE", EsuChildAttributes.CATEGORY_CHILD, false)),

  SCHULJAHR(
      TextAttribute.create(
          "Schuljahr",
          "SCHULJAHR",
          EsuChildAttributes.CATEGORY_CHILD,
          true,
          null,
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  KIH(
      ValueWithOptionsAttribute.create(
          "Anzahl der im Haushalt lebenden Kinder",
          "KIH",
          EsuChildAttributes.CATEGORY_CHILD,
          true,
          EsuAttributeUtil.createSiblingValueOptions(),
          DataPrivacyCategory.QUASI_IDENTIFYING));

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
