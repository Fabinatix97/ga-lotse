/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.examination.RapidTestData;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination;
import java.util.Optional;

public enum StiRapidTestsAttributes implements StiAttributes {
  RAPID_TESTS_HIV_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "HIV-Schnelltest angefordert",
          "RAPID_TESTS_HIV_TEST_REQUESTED",
          StiRapidTestsAttributes.RAPID_TESTS_CATEGORY,
          false,
          0.2)),

  RAPID_TESTS_HIV_TEST_RESULT_REACTIVE(
      BooleanAttribute.createSensitive(
          "Reaktiver HIV-Schnelltest",
          "RAPID_TESTS_HIV_TEST_RESULT_REACTIVE",
          StiRapidTestsAttributes.RAPID_TESTS_CATEGORY,
          false,
          0.2)),
  RAPID_TESTS_SYPHILIS_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Syphilis-Schnelltest angefordert",
          "RAPID_TESTS_SYPHILIS_TEST_REQUESTED",
          StiRapidTestsAttributes.RAPID_TESTS_CATEGORY,
          false,
          0.2)),
  RAPID_TESTS_SYPHILIS_TEST_RESULT_REACTIVE(
      BooleanAttribute.createSensitive(
          "Reaktiver Syphilis-Schnelltest",
          "RAPID_TESTS_SYPHILIS_TEST_RESULT_REACTIVE",
          StiRapidTestsAttributes.RAPID_TESTS_CATEGORY,
          false,
          0.2)),
  RAPID_TESTS_PREGNANCY_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Schwangerschaftstest angefordert",
          "RAPID_TESTS_PREGNANCY_TEST_REQUESTED",
          StiRapidTestsAttributes.RAPID_TESTS_CATEGORY,
          false,
          0.2)),
  RAPID_TESTS_PREGNANCY_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Schwangerschaftstest",
          "RAPID_TESTS_PREGNANCY_TEST_RESULT_POSITIVE",
          StiRapidTestsAttributes.RAPID_TESTS_CATEGORY,
          false,
          0.2));

  private static final String RAPID_TESTS_CATEGORY = "Schnelltests";

  private final AttributeData attribute;

  StiRapidTestsAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiRapidTestsAttributes attribute) {
    RapidTestExamination rapidTests = procedure.getRapidTestExamination();
    if (rapidTests == null) {
      return null;
    }

    return switch (attribute) {
      case RAPID_TESTS_HIV_TEST_REQUESTED -> rapidTests.isHivRequested();
      case RAPID_TESTS_HIV_TEST_RESULT_REACTIVE -> getTestResult(rapidTests.getHivData());
      case RAPID_TESTS_SYPHILIS_TEST_REQUESTED -> rapidTests.isSyphilisRequested();
      case RAPID_TESTS_SYPHILIS_TEST_RESULT_REACTIVE -> getTestResult(rapidTests.getSyphilisData());
      case RAPID_TESTS_PREGNANCY_TEST_REQUESTED -> rapidTests.isPregnancyTestRequested();
      case RAPID_TESTS_PREGNANCY_TEST_RESULT_POSITIVE ->
          getTestResult(rapidTests.getPregnancyTestData());
    };
  }

  private static Boolean getTestResult(RapidTestData testData) {
    return Optional.ofNullable(testData).map(RapidTestData::getResult).orElse(null);
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
