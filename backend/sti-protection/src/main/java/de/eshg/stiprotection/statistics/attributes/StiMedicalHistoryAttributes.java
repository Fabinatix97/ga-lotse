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
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.Vaccination;

public enum StiMedicalHistoryAttributes implements StiAttributes {
  MEDICAL_HISTORY_PREV_HEPA_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf Hepatitis A",
          "MEDICAL_HISTORY_PREV_HEPA_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_HEPB_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf Hepatitis B",
          "MEDICAL_HISTORY_PREV_HEPB_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_HEPC_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf Hepatitis C",
          "MEDICAL_HISTORY_PREV_HEPC_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_HIV_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf HIV",
          "MEDICAL_HISTORY_PREV_HIV_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_SYPHILIS_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf Syphilis",
          "MEDICAL_HISTORY_PREV_SYPHILIS_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_GONORRHEA_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf Gonorrhoe",
          "MEDICAL_HISTORY_PREV_GONORRHEA_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_CHLAMYDIA_EXAM(
      BooleanAttribute.create(
          "Vorherige Untersuchung auf Chlamydien",
          "MEDICAL_HISTORY_PREV_CHLAMYDIA_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),

  MEDICAL_HISTORY_PREV_HEPA_INFECTION(
      BooleanAttribute.create(
          "Vorherige Hepatitis A Infektion",
          "MEDICAL_HISTORY_PREV_HEPA_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_HEPB_INFECTION(
      BooleanAttribute.create(
          "Vorherige Hepatitis B Infektion",
          "MEDICAL_HISTORY_PREV_HEPB_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_HEPC_INFECTION(
      BooleanAttribute.create(
          "Vorherige Hepatitis C Infektion",
          "MEDICAL_HISTORY_PREV_HEPC_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_HIV_INFECTION(
      BooleanAttribute.create(
          "Vorherige HIV Infektion",
          "MEDICAL_HISTORY_PREV_HIV_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_SYPHILIS_INFECTION(
      BooleanAttribute.create(
          "Vorherige Syphilis Infektion",
          "MEDICAL_HISTORY_PREV_SYPHILIS_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_GONORRHEA_INFECTION(
      BooleanAttribute.create(
          "Vorherige Gonorrhoe Infektion",
          "MEDICAL_HISTORY_PREV_GONORRHEA_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_PREV_CHLAMYDIA_INFECTION(
      BooleanAttribute.create(
          "Vorherige Chlamydien Infektion",
          "MEDICAL_HISTORY_PREV_CHLAMYDIA_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_SEXUAL_ORIENTATION_PATIENT(
      ValueWithOptionsAttribute.create(
          "Sexuelle Orientierung des Patienten",
          "MEDICAL_HISTORY_SEXUAL_ORIENTATION_PATIENT",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          StiAttributeMapper.mapSexualOrientationToValueOptions())),
  MEDICAL_HISTORY_NUMBER_OF_SEXUAL_PARTNERS_LAST_12_MONTHS(
      IntegerAttribute.create(
          "Anzahl Sexpartner/Sexpartnerinnen in den letzten 12 Monaten",
          "MEDICAL_HISTORY_NUMBER_OF_SEXUAL_PARTNERS_LAST_12_MONTHS",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_HEPA_VACCINATION(
      BooleanAttribute.create(
          "Hepatitis A Impfung",
          "MEDICAL_HISTORY_HEPA_VACCINATION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_HEPB_VACCINATION(
      BooleanAttribute.create(
          "Hepatitis B Impfung",
          "MEDICAL_HISTORY_HEPB_VACCINATION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),
  MEDICAL_HISTORY_HPV_VACCINATION(
      BooleanAttribute.create(
          "HPV Impfung",
          "MEDICAL_HISTORY_HPV_VACCINATION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false)),

  MEDICAL_HISTORY_SAFER_SEX_PRACTICE(
      ValueWithOptionsAttribute.create(
          "Safer Sex",
          "MEDICAL_HISTORY_SAFER_SEX_PRACTICE",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          StiAttributeMapper.mapSaferSexPracticeToValueOptions()));

  private static final String MEDICAL_HISTORY_CATEGORY = "Anamnese";

  private final AttributeData attribute;

  StiMedicalHistoryAttributes(AttributeData attribute) {
    this.attribute = attribute;
  }

  @Override
  public AttributeData getAttributeData() {
    return attribute;
  }

  public static Object mapAttribute(
      StiProtectionProcedure procedure, StiMedicalHistoryAttributes attribute) {
    MedicalHistory medicalHistory = procedure.getMedicalHistory();
    if (medicalHistory == null) {
      return null;
    }

    return switch (attribute) {
      case MEDICAL_HISTORY_PREV_HEPA_EXAM -> medicalHistory.getExaminations().getHepA();
      case MEDICAL_HISTORY_PREV_HEPB_EXAM -> medicalHistory.getExaminations().getHepB();
      case MEDICAL_HISTORY_PREV_HEPC_EXAM -> medicalHistory.getExaminations().getHepC();
      case MEDICAL_HISTORY_PREV_HIV_EXAM -> medicalHistory.getExaminations().getHiv();
      case MEDICAL_HISTORY_PREV_SYPHILIS_EXAM -> medicalHistory.getExaminations().getSyphilis();
      case MEDICAL_HISTORY_PREV_GONORRHEA_EXAM -> medicalHistory.getExaminations().getGonorrhea();
      case MEDICAL_HISTORY_PREV_CHLAMYDIA_EXAM -> medicalHistory.getExaminations().getChlamydia();
      case MEDICAL_HISTORY_PREV_HEPA_INFECTION -> medicalHistory.getPreviousIllnesses().getHepA();
      case MEDICAL_HISTORY_PREV_HEPB_INFECTION -> medicalHistory.getPreviousIllnesses().getHepB();
      case MEDICAL_HISTORY_PREV_HEPC_INFECTION -> medicalHistory.getPreviousIllnesses().getHepC();
      case MEDICAL_HISTORY_PREV_HIV_INFECTION -> medicalHistory.getPreviousIllnesses().getHiv();
      case MEDICAL_HISTORY_PREV_SYPHILIS_INFECTION ->
          medicalHistory.getPreviousIllnesses().getSyphilis();
      case MEDICAL_HISTORY_PREV_GONORRHEA_INFECTION ->
          medicalHistory.getPreviousIllnesses().getGonorrhea();
      case MEDICAL_HISTORY_PREV_CHLAMYDIA_INFECTION ->
          medicalHistory.getPreviousIllnesses().getChlamydia();
      case MEDICAL_HISTORY_SEXUAL_ORIENTATION_PATIENT ->
          medicalHistory.getRiskContacts().getSexualOrientation();
      case MEDICAL_HISTORY_NUMBER_OF_SEXUAL_PARTNERS_LAST_12_MONTHS ->
          medicalHistory.getRiskContacts().getNumberOfSexualPartnersLast12Months();
      case MEDICAL_HISTORY_HEPA_VACCINATION ->
          medicalHistory.getPrevention().getVaccinations().contains(Vaccination.HEPATITIS_A);
      case MEDICAL_HISTORY_HEPB_VACCINATION ->
          medicalHistory.getPrevention().getVaccinations().contains(Vaccination.HEPATITIS_B);
      case MEDICAL_HISTORY_HPV_VACCINATION ->
          medicalHistory.getPrevention().getVaccinations().contains(Vaccination.HPV);
      case MEDICAL_HISTORY_SAFER_SEX_PRACTICE ->
          medicalHistory.getPrevention().getSafeSexPractice();
    };
  }
}
