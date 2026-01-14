/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.statistics;

import static de.eshg.travelmedicine.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_PROCEDURE;

import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.TravelType;
import java.util.Arrays;

public enum VaccinationConsultationAttributes implements AttributeInfo {
  PROCEDURE_ID(ProcedureAttribute.create("Vorgangsreferenz", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  PERSON_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Person", "PERSON_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  NUMBER_OF_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl Termine", "NUMBER_OF_APPOINTMENTS", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  NUMBER_OF_VACCINATIONS(
      IntegerAttribute.create(
          "Anzahl Impfungen", "NUMBER_OF_VACCINATIONS", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  NUMBER_OF_OTHER_SERVICES(
      IntegerAttribute.create(
          "Anzahl Sonstige Leistungen",
          "NUMBER_OF_OTHER_SERVICES",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),
  TRAVEL_DESTINATIONS(
      TextAttribute.create(
          "Reiseziele", "TRAVEL_DESTINATIONS", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  NUMBER_OF_TRAVEL_DESTINATIONS(
      TextAttribute.create(
          "Anzahl Reiseziele",
          "NUMBER_OF_TRAVEL_DESTINATIONS",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),
  TRAVEL_TYPE(
      ValueWithOptionsAttribute.create(
          "Reiseart",
          "TRAVEL_TYPE",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true,
          Arrays.stream(TravelType.values())
              .map(
                  entry ->
                      new ValueOptionInternal(
                          entry.name(), entry.getName(), entry == TravelType.UNSPECIFIED))
              .toList())),
  TRAVEL_TIME_IN_DAYS(
      IntegerAttribute.create(
          "Reisedauer in Tagen", "TRAVEL_TIME_IN_DAYS", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  ;

  private final AttributeData attribute;

  VaccinationConsultationAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
