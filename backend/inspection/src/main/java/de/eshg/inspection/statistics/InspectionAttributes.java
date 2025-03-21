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
  PROCEDURE_ID(ProcedureAttribute.create("Vorgangsreferenz", ATTRIBUTE_CATEGORY_INSPECTION, true)),

  FACILITY_CENTRAL_FILE_ID(
      CentralFileIdFacilityAttribute.create(
          "Einrichtung", "FACILITY_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_INSPECTION, true)),

  YEAR_OF_INSPECTION(
      IntegerAttribute.create(
          "Begehungsjahr", "YEAR_OF_INSPECTION", ATTRIBUTE_CATEGORY_INSPECTION, false)),

  OBJECT_TYPE(
      ValueWithOptionsAttribute.create(
          "Objekttyp", "OBJECT_TYPE", ATTRIBUTE_CATEGORY_INSPECTION, false, new ArrayList<>())),

  RESULT(
      ValueWithOptionsAttribute.create(
          "Ergebnis",
          "RESULT",
          ATTRIBUTE_CATEGORY_INSPECTION,
          true,
          AttributeUtil.createResultOptions())),

  DURATION(
      IntegerAttribute.create(
          "Zeit vor Ort (Minuten)", "DURATION", ATTRIBUTE_CATEGORY_INSPECTION, false)),

  NUMBER_OF_INCIDENTS(
      IntegerAttribute.create(
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
