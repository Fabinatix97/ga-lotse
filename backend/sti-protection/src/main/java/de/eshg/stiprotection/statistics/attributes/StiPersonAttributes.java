/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public enum StiPersonAttributes implements StiAttributes {
  PERSON_GENDER(
      ValueWithOptionsAttribute.create(
          "Biologisches Geschlecht",
          "PERSON_GENDER",
          StiPersonAttributes.PERSON_CATEGORY,
          false,
          StiAttributeMapper.mapGenderToValueOptions())),

  PERSON_SUFFICIENT_GERMAN_LANGUAGE_SKILLS(
      BooleanAttribute.create(
          "Ausreichende Deutschkenntnisse",
          "PERSON_SUFFICIENT_GERMAN_LANGUAGE_SKILLS",
          StiPersonAttributes.PERSON_CATEGORY,
          false)),

  PERSON_YEAR_OF_BIRTH(
      IntegerAttribute.create(
          "Geburtsjahr", "PERSON_YEAR_OF_BIRTH", StiPersonAttributes.PERSON_CATEGORY, false));

  private static final String PERSON_CATEGORY = "Person";

  private final AttributeData attribute;

  StiPersonAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiPersonAttributes attribute) {
    return switch (attribute) {
      case PERSON_GENDER -> procedure.getPerson().getGender();
      case PERSON_SUFFICIENT_GERMAN_LANGUAGE_SKILLS ->
          procedure.getPerson().getHasSufficientGermanLanguageSkills();
      case PERSON_YEAR_OF_BIRTH -> procedure.getPerson().getYearOfBirth().getValue();
    };
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
