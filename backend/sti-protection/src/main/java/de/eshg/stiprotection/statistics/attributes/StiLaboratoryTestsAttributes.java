/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination;
import de.eshg.stiprotection.persistence.db.examination.labtests.CancerScreeningTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.ChlamydiaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.GonorrheaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisATest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisBTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisCTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HivTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HpvTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.LabTestData;
import de.eshg.stiprotection.persistence.db.examination.labtests.MpoxTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.MycoplasmaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.OtherTests;
import de.eshg.stiprotection.persistence.db.examination.labtests.SyphilisTest;

public enum StiLaboratoryTestsAttributes implements StiAttributes {
  LABORATORY_TESTS_HIV_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "HIV Test angefordert",
          "LABORATORY_TESTS_HIV_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HIV_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver HIV Test",
          "LABORATORY_TESTS_HIV_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_SYPHILIS_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Syphilis Test angefordert",
          "LABORATORY_TESTS_SYPHILIS_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_SYPHILIS_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Syphilis Test",
          "LABORATORY_TESTS_SYPHILIS_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HEPATITIS_A_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Hepatitis A Test angefordert",
          "LABORATORY_TESTS_HEPATITIS_A_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HEPATITIS_A_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Hepatitis A Test",
          "LABORATORY_TESTS_HEPATITIS_A_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HEPATITIS_B_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Hepatitis B Test angefordert",
          "LABORATORY_TESTS_HEPATITIS_B_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HEPATITIS_B_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Hepatitis B Test",
          "LABORATORY_TESTS_HEPATITIS_B_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HEPATITIS_C_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Hepatitis C Test angefordert",
          "LABORATORY_TESTS_HEPATITIS_C_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HEPATITIS_C_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Hepatitis C Test",
          "LABORATORY_TESTS_HEPATITIS_C_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_CHLAMYDIA_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Chlamydien Test angefordert",
          "LABORATORY_TESTS_CHLAMYDIA_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_CHLAMYDIA_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Chlamydien Test",
          "LABORATORY_TESTS_CHLAMYDIA_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_GONORRHEA_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Gonorrhoe Test angefordert",
          "LABORATORY_TESTS_GONORRHEA_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_GONORRHEA_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Gonorrhoe Test",
          "LABORATORY_TESTS_GONORRHEA_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_MYCOPLASMA_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Mykoplasmen Test angefordert",
          "LABORATORY_TESTS_MYCOPLASMA_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_MYCOPLASMA_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Mykoplasmen Test",
          "LABORATORY_TESTS_MYCOPLASMA_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_CANCER_SCREENING_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Krebsvorsorge Test angefordert",
          "LABORATORY_TESTS_CANCER_SCREENING_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_CANCER_SCREENING_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Krebsvorsorge Test",
          "LABORATORY_TESTS_CANCER_SCREENING_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HPV_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "HPV-Abstrich Test angefordert",
          "LABORATORY_TESTS_HPV_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_HPV_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver HPV-Abstrich Test",
          "LABORATORY_TESTS_HPV_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_MPOX_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Mpox Test angefordert",
          "LABORATORY_TESTS_MPOX_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_MPOX_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver Mpox Test",
          "LABORATORY_TESTS_MPOX_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_OTHER_TEST_REQUESTED(
      BooleanAttribute.createSensitive(
          "Sonstiger Test angefordert",
          "LABORATORY_TESTS_OTHER_TEST_REQUESTED",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2)),

  LABORATORY_TESTS_OTHER_TEST_RESULT_POSITIVE(
      BooleanAttribute.createSensitive(
          "Positiver sonstiger Test",
          "LABORATORY_TESTS_OTHER_TEST_RESULT_POSITIVE",
          StiLaboratoryTestsAttributes.LABORATORY_TESTS_CATEGORY,
          false,
          0.2));

  private static final String LABORATORY_TESTS_CATEGORY = "Labortests";

  private final AttributeData attribute;

  StiLaboratoryTestsAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiLaboratoryTestsAttributes attribute) {
    LaboratoryTestExamination laboratoryTests = procedure.getLaboratoryTestExamination();
    if (laboratoryTests == null) {
      return null;
    }

    return switch (attribute) {
      case LABORATORY_TESTS_HIV_TEST_REQUESTED -> mapTestRequested(laboratoryTests, HivTest.class);
      case LABORATORY_TESTS_HIV_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, HivTest.class);
      case LABORATORY_TESTS_SYPHILIS_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, SyphilisTest.class);
      case LABORATORY_TESTS_SYPHILIS_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, SyphilisTest.class);
      case LABORATORY_TESTS_HEPATITIS_A_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, HepatitisATest.class);
      case LABORATORY_TESTS_HEPATITIS_A_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, HepatitisATest.class);
      case LABORATORY_TESTS_HEPATITIS_B_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, HepatitisBTest.class);
      case LABORATORY_TESTS_HEPATITIS_B_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, HepatitisBTest.class);
      case LABORATORY_TESTS_HEPATITIS_C_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, HepatitisCTest.class);
      case LABORATORY_TESTS_HEPATITIS_C_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, HepatitisCTest.class);
      case LABORATORY_TESTS_CHLAMYDIA_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, ChlamydiaTest.class);
      case LABORATORY_TESTS_CHLAMYDIA_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, ChlamydiaTest.class);
      case LABORATORY_TESTS_GONORRHEA_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, GonorrheaTest.class);
      case LABORATORY_TESTS_GONORRHEA_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, GonorrheaTest.class);
      case LABORATORY_TESTS_MYCOPLASMA_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, MycoplasmaTest.class);
      case LABORATORY_TESTS_MYCOPLASMA_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, MycoplasmaTest.class);
      case LABORATORY_TESTS_CANCER_SCREENING_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, CancerScreeningTest.class);
      case LABORATORY_TESTS_CANCER_SCREENING_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, CancerScreeningTest.class);
      case LABORATORY_TESTS_HPV_TEST_REQUESTED -> mapTestRequested(laboratoryTests, HpvTest.class);
      case LABORATORY_TESTS_HPV_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, HpvTest.class);
      case LABORATORY_TESTS_MPOX_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, MpoxTest.class);
      case LABORATORY_TESTS_MPOX_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, MpoxTest.class);
      case LABORATORY_TESTS_OTHER_TEST_REQUESTED ->
          mapTestRequested(laboratoryTests, OtherTests.class);
      case LABORATORY_TESTS_OTHER_TEST_RESULT_POSITIVE ->
          mapTestResult(laboratoryTests, OtherTests.class);
    };
  }

  private static <T extends LabTestData> Boolean mapTestRequested(
      LaboratoryTestExamination laboratoryTests, Class<T> clazz) {
    return laboratoryTests.getLabTest(clazz).isPresent();
  }

  private static Boolean mapTestResult(
      LaboratoryTestExamination laboratoryTestExamination, Class<? extends LabTestData> clazz) {
    return laboratoryTestExamination.getLabTest(clazz).map(LabTestData::getResult).orElse(null);
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }
}
