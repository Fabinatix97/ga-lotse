/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.statistics;

import static de.eshg.officialmedicalservice.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.officialmedicalservice.procedure.persistence.entity.MedicalOpinionResult;
import java.util.Arrays;

public enum OmsProcedureAttributes implements AttributeInfo {
  PROCEDURE_ID(
      ProcedureAttribute.create(
          "Vorgangsreferenz", ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE, true)),

  STATUS(
      ValueWithOptionsAttribute.create(
          "Vorgangsstatus",
          "STATUS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          false,
          Arrays.stream(ProcedureStatus.values())
              .map(entry -> new ValueOptionInternal(entry.name(), entry.name(), false))
              .toList())),

  CONCERN(
      TextAttribute.create(
          "Anliegen", "CONCERN", ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE, false)),

  CONCERN_CATEGORY(
      TextAttribute.create(
          "Kategorie (Anliegen)",
          "CONCERN_CATEGORY",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          false)),

  DURATION(
      IntegerAttribute.create(
          "Dauer bis Vorgangsabschluss",
          "DURATION",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          false)),

  PERSON_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Person", "PERSON_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE, true)),

  NUMBER_OF_DOCUMENTS(
      IntegerAttribute.create(
          "Anzahl der Dokumente",
          "NUMBER_OF_DOCUMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  NUMBER_OF_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl der Termine",
          "NUMBER_OF_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  NUMBER_OF_BOOKED_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl der gebuchten Termine",
          "NUMBER_OF_BOOKED_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  NUMBER_OF_CANCELLED_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl der abgesagten Termine",
          "NUMBER_OF_CANCELLED_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  MEDICAL_OPINION_RESULT(
      ValueWithOptionsAttribute.create(
          "Gutachtenergebnis",
          "MEDICAL_OPINION_RESULT",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true,
          Arrays.stream(MedicalOpinionResult.values())
              .map(
                  entry ->
                      new ValueOptionInternal(
                          entry.name(), entry.name(), entry == MedicalOpinionResult.UNKNOWN))
              .toList())),
  ;

  private final AttributeData attribute;

  OmsProcedureAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
