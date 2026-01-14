/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.statistics;

import static de.eshg.inspection.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_INSPECTION;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.CentralFileIdFacilityAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
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

  // interval in 2 year steps
  YEAR_OF_INSPECTION_ANONYMIZATION(
      IntegerAttribute.createQuasiIdentifying(
          "Begehungsjahr",
          "YEAR_OF_INSPECTION",
          ATTRIBUTE_CATEGORY_INSPECTION,
          false,
          null,
          null,
          new IntegerMinMaxCountIntervalConfiguration(2020, 2099, 40))),

  OBJECT_TYPE(
      ValueWithOptionsAttribute.create(
          "Objekttyp", "OBJECT_TYPE", ATTRIBUTE_CATEGORY_INSPECTION, false, new ArrayList<>())),

  OBJECT_TYPE_ANONYMIZATION(
      ValueWithOptionsAttribute.create(
          "Objekttyp",
          "OBJECT_TYPE",
          ATTRIBUTE_CATEGORY_INSPECTION,
          false,
          new ArrayList<>(),
          DataPrivacyCategory.QUASI_IDENTIFYING)),

  RESULT(
      ValueWithOptionsAttribute.create(
          "Ergebnis",
          "RESULT",
          ATTRIBUTE_CATEGORY_INSPECTION,
          true,
          AttributeUtil.createResultOptions())),

  RESULT_ANONYMIZATION(
      ValueWithOptionsAttribute.createSensitive(
          "Ergebnis",
          "RESULT",
          ATTRIBUTE_CATEGORY_INSPECTION,
          true,
          AttributeUtil.createResultOptions(),
          new SensitiveParameters(2, null),
          null)),

  DURATION(
      IntegerAttribute.create(
          "Zeit vor Ort (Minuten)", "DURATION", ATTRIBUTE_CATEGORY_INSPECTION, false)),

  DURATION_ANONYMIZATION(
      IntegerAttribute.createInsensitive(
          "Zeit vor Ort (Minuten)", "DURATION", ATTRIBUTE_CATEGORY_INSPECTION, false, null, null)),

  NUMBER_OF_INCIDENTS(
      IntegerAttribute.create(
          "Anzahl Vorkommnisse", "NUMBER_OF_INCIDENTS", ATTRIBUTE_CATEGORY_INSPECTION, true)),

  NUMBER_OF_INCIDENTS_ANONYMIZATION(
      IntegerAttribute.createSensitive(
          "Anzahl Vorkommnisse",
          "NUMBER_OF_INCIDENTS",
          ATTRIBUTE_CATEGORY_INSPECTION,
          true,
          null,
          null,
          new SensitiveParameters(2, 0.2))),
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
