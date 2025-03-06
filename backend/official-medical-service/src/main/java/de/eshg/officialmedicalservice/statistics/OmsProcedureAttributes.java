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
      new ProcedureAttribute(
          "Vorgangsreferenz", ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE, true)),

  STATUS(
      new ValueWithOptionsAttribute(
          "Vorgangsstatus",
          "STATUS",
          Arrays.stream(ProcedureStatus.values())
              .map(entry -> new ValueOptionInternal(entry.name(), entry.name(), false))
              .toList(),
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          false)),

  CONCERN(
      new TextAttribute("Anliegen", "CONCERN", ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE, false)),

  CONCERN_CATEGORY(
      new TextAttribute(
          "Kategorie (Anliegen)",
          "CONCERN_CATEGORY",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          false)),

  DURATION(
      new IntegerAttribute(
          "Dauer bis Vorgangsabschluss",
          "DURATION",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          false)),

  PERSON_CENTRAL_FILE_ID(
      new CentralFileIdPersonAttribute(
          "Person", "PERSON_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE, true)),

  NUMBER_OF_DOCUMENTS(
      new IntegerAttribute(
          "Anzahl der Dokumente",
          "NUMBER_OF_DOCUMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  NUMBER_OF_APPOINTMENTS(
      new IntegerAttribute(
          "Anzahl der Termine",
          "NUMBER_OF_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  NUMBER_OF_BOOKED_APPOINTMENTS(
      new IntegerAttribute(
          "Anzahl der gebuchten Termine",
          "NUMBER_OF_BOOKED_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  NUMBER_OF_CANCELLED_APPOINTMENTS(
      new IntegerAttribute(
          "Anzahl der abgesagten Termine",
          "NUMBER_OF_CANCELLED_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),

  MEDICAL_OPINION_RESULT(
      new ValueWithOptionsAttribute(
          "Gutachtenergebnis",
          "MEDICAL_OPINION_RESULT",
          Arrays.stream(MedicalOpinionResult.values())
              .map(
                  entry ->
                      new ValueOptionInternal(
                          entry.name(), entry.name(), entry == MedicalOpinionResult.UNKNOWN))
              .toList(),
          ATTRIBUTE_CATEGORY_OFFICIAL_MEDICAL_SERVICE,
          true)),
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
