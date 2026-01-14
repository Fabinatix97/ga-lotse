/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.api.interval.IntegerMinMaxCountIntervalConfiguration;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import java.time.Year;
import java.util.Optional;

public enum StiPersonAttributes implements StiAttributes {
  PERSON_GENDER(
      ValueWithOptionsAttribute.createSensitive(
          "Biologisches Geschlecht",
          "PERSON_GENDER",
          StiPersonAttributes.PERSON_CATEGORY,
          false,
          StiAttributeMapper.mapGenderToValueOptions(),
          new SensitiveParameters(2, null),
          null)),

  PERSON_SUFFICIENT_GERMAN_LANGUAGE_SKILLS(
      BooleanAttribute.createSensitive(
          "Ausreichende Deutschkenntnisse",
          "PERSON_SUFFICIENT_GERMAN_LANGUAGE_SKILLS",
          StiPersonAttributes.PERSON_CATEGORY,
          false,
          0.2)),

  PERSON_YEAR_OF_BIRTH(
      IntegerAttribute.createQuasiIdentifying(
          "Geburtsjahr",
          "PERSON_YEAR_OF_BIRTH",
          StiPersonAttributes.PERSON_CATEGORY,
          false,
          null,
          null,
          new IntegerMinMaxCountIntervalConfiguration(1900, 2099, 40)));

  private static final String PERSON_CATEGORY = "Person";

  private final AttributeData attribute;

  StiPersonAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiPersonAttributes attribute) {
    Person person = procedure.getPerson();
    if (person == null) {
      return null;
    }

    return switch (attribute) {
      case PERSON_GENDER -> person.getGender();
      case PERSON_SUFFICIENT_GERMAN_LANGUAGE_SKILLS ->
          person.getHasSufficientGermanLanguageSkills();
      case PERSON_YEAR_OF_BIRTH -> mapYearOfBirth(person);
    };
  }

  private static Integer mapYearOfBirth(Person person) {
    return Optional.of(person).map(Person::getYearOfBirth).map(Year::getValue).orElse(null);
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
