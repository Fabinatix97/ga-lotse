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
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.VaccinationType;
import java.util.Arrays;

public enum VaccinationAttributes implements AttributeInfo {
  PROCEDURE_ID(ProcedureAttribute.create("Vorgangsreferenz", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  PERSON_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Person", "PERSON_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  DISEASE(TextAttribute.create("Krankheit", "DISEASE", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  VACCINE(TextAttribute.create("Impfstoff", "VACCINE", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  VACCINATION_TYPE(
      ValueWithOptionsAttribute.create(
          "Impfart",
          "VACCINATION_TYPE",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true,
          Arrays.stream(VaccinationType.values())
              .map(entry -> new ValueOptionInternal(entry.name(), entry.getGermanName(), false))
              .toList())),
  VACCINATION_NUMBER(
      IntegerAttribute.create(
          "Nummer in Serie", "VACCINATION_NUMBER", ATTRIBUTE_CATEGORY_PROCEDURE, true)),
  ;

  private final AttributeData attribute;

  VaccinationAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
