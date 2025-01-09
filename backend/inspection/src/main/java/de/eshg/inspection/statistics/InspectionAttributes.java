/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import static de.eshg.inspection.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_INSPECTION;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import java.util.ArrayList;

public enum InspectionAttributes implements AttributeInfo {
  PROCEDURE_ID(new ProcedureAttribute("Vorgangsreferenz", ATTRIBUTE_CATEGORY_INSPECTION, true)),

  FACILITY_CENTRAL_FILE_ID(
      new CentralFileIdFacilityAttribute(
          "Einrichtung", "FACILITY_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_INSPECTION, true)),

  YEAR_OF_INSPECTION(
      new IntegerAttribute(
          "Begehungsjahr", "YEAR_OF_INSPECTION", ATTRIBUTE_CATEGORY_INSPECTION, false)),

  OBJECT_TYPE(
      new ValueWithOptionsAttribute(
          "Objekttyp", "OBJECT_TYPE", new ArrayList<>(), ATTRIBUTE_CATEGORY_INSPECTION, false)),

  RESULT(
      new ValueWithOptionsAttribute(
          "Ergebnis",
          "RESULT",
          AttributeUtil.createResultOptions(),
          ATTRIBUTE_CATEGORY_INSPECTION,
          true)),

  DURATION(
      new IntegerAttribute(
          "Zeit vor Ort (Minuten)", "DURATION", ATTRIBUTE_CATEGORY_INSPECTION, false)),

  NUMBER_OF_INCIDENTS(
      new IntegerAttribute(
          "Anzahl Vorkommnisse", "NUMBER_OF_INCIDENTS", ATTRIBUTE_CATEGORY_INSPECTION, true)),
  ;

  private final AttributeData attribute;

  InspectionAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
