/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public enum StiProcedureAttributes implements StiAttributes {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", StiProcedureAttributes.PROCEDURE_CATEGORY, true)),
  PROCEDURE_TYPE(
      ValueWithOptionsAttribute.create(
          "Vorgangstyp",
          "PROCEDURE_TYPE",
          StiProcedureAttributes.PROCEDURE_CATEGORY,
          false,
          StiAttributeMapper.mapConcernToValueOptions())),
  PROCEDURE_ORIGIN(
      ValueWithOptionsAttribute.create(
          "Ursprung",
          "PROCEDURE_ORIGIN",
          StiProcedureAttributes.PROCEDURE_CATEGORY,
          false,
          StiAttributeMapper.mapOriginToValueOptions()));

  private static final String PROCEDURE_CATEGORY = "Vorgang";

  private final AttributeData attribute;

  StiProcedureAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiProcedureAttributes attribute) {
    return switch (attribute) {
      case PROCEDURE_ID -> procedure.getExternalId();
      case PROCEDURE_TYPE -> procedure.getConcern();
      case PROCEDURE_ORIGIN -> procedure.getStiProcedureOrigin();
    };
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
