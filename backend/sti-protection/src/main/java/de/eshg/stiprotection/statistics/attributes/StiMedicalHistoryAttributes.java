/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.SensitiveParameters;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.medicalhistory.Examination;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.Prevention;
import de.eshg.stiprotection.persistence.db.medicalhistory.PreviousIllness;
import de.eshg.stiprotection.persistence.db.medicalhistory.RiskContact;
import de.eshg.stiprotection.persistence.db.medicalhistory.Vaccination;
import java.util.Optional;
import java.util.function.Function;

public enum StiMedicalHistoryAttributes implements StiAttributes {
  MEDICAL_HISTORY_PREV_HEPA_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf Hepatitis A",
          "MEDICAL_HISTORY_PREV_HEPA_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_HEPB_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf Hepatitis B",
          "MEDICAL_HISTORY_PREV_HEPB_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_HEPC_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf Hepatitis C",
          "MEDICAL_HISTORY_PREV_HEPC_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_HIV_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf HIV",
          "MEDICAL_HISTORY_PREV_HIV_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_SYPHILIS_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf Syphilis",
          "MEDICAL_HISTORY_PREV_SYPHILIS_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_GONORRHEA_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf Gonorrhoe",
          "MEDICAL_HISTORY_PREV_GONORRHEA_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_CHLAMYDIA_EXAM(
      BooleanAttribute.createSensitive(
          "Vorherige Untersuchung auf Chlamydien",
          "MEDICAL_HISTORY_PREV_CHLAMYDIA_EXAM",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),

  MEDICAL_HISTORY_PREV_HEPA_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige Hepatitis A Infektion",
          "MEDICAL_HISTORY_PREV_HEPA_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_HEPB_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige Hepatitis B Infektion",
          "MEDICAL_HISTORY_PREV_HEPB_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_HEPC_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige Hepatitis C Infektion",
          "MEDICAL_HISTORY_PREV_HEPC_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_HIV_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige HIV Infektion",
          "MEDICAL_HISTORY_PREV_HIV_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_SYPHILIS_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige Syphilis Infektion",
          "MEDICAL_HISTORY_PREV_SYPHILIS_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_GONORRHEA_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige Gonorrhoe Infektion",
          "MEDICAL_HISTORY_PREV_GONORRHEA_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_PREV_CHLAMYDIA_INFECTION(
      BooleanAttribute.createSensitive(
          "Vorherige Chlamydien Infektion",
          "MEDICAL_HISTORY_PREV_CHLAMYDIA_INFECTION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_SEXUAL_ORIENTATION_PATIENT(
      ValueWithOptionsAttribute.createSensitive(
          "Sexuelle Orientierung des Patienten",
          "MEDICAL_HISTORY_SEXUAL_ORIENTATION_PATIENT",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          StiAttributeMapper.mapSexualOrientationToValueOptions(),
          new SensitiveParameters(2, null),
          null)),
  MEDICAL_HISTORY_NUMBER_OF_SEXUAL_PARTNERS_LAST_12_MONTHS(
      IntegerAttribute.createSensitive(
          "Anzahl Sexpartner/Sexpartnerinnen in den letzten 12 Monaten",
          "MEDICAL_HISTORY_NUMBER_OF_SEXUAL_PARTNERS_LAST_12_MONTHS",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          null,
          null,
          new SensitiveParameters(null, 0.2))),
  MEDICAL_HISTORY_HEPA_VACCINATION(
      BooleanAttribute.createSensitive(
          "Hepatitis A Impfung",
          "MEDICAL_HISTORY_HEPA_VACCINATION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_HEPB_VACCINATION(
      BooleanAttribute.createSensitive(
          "Hepatitis B Impfung",
          "MEDICAL_HISTORY_HEPB_VACCINATION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),
  MEDICAL_HISTORY_HPV_VACCINATION(
      BooleanAttribute.createSensitive(
          "HPV Impfung",
          "MEDICAL_HISTORY_HPV_VACCINATION",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          0.2)),

  MEDICAL_HISTORY_SAFER_SEX_PRACTICE(
      ValueWithOptionsAttribute.createSensitive(
          "Safer Sex",
          "MEDICAL_HISTORY_SAFER_SEX_PRACTICE",
          StiMedicalHistoryAttributes.MEDICAL_HISTORY_CATEGORY,
          false,
          StiAttributeMapper.mapSaferSexPracticeToValueOptions(),
          new SensitiveParameters(2, null),
          null));

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
      case MEDICAL_HISTORY_PREV_HEPA_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getHepA);
      case MEDICAL_HISTORY_PREV_HEPB_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getHepB);
      case MEDICAL_HISTORY_PREV_HEPC_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getHepC);
      case MEDICAL_HISTORY_PREV_HIV_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getHiv);
      case MEDICAL_HISTORY_PREV_SYPHILIS_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getSyphilis);
      case MEDICAL_HISTORY_PREV_GONORRHEA_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getGonorrhea);
      case MEDICAL_HISTORY_PREV_CHLAMYDIA_EXAM ->
          getExaminationAttribute(medicalHistory, Examination::getChlamydia);

      case MEDICAL_HISTORY_PREV_HEPA_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getHepA);
      case MEDICAL_HISTORY_PREV_HEPB_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getHepB);
      case MEDICAL_HISTORY_PREV_HEPC_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getHepC);
      case MEDICAL_HISTORY_PREV_HIV_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getHiv);
      case MEDICAL_HISTORY_PREV_SYPHILIS_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getSyphilis);
      case MEDICAL_HISTORY_PREV_GONORRHEA_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getGonorrhea);
      case MEDICAL_HISTORY_PREV_CHLAMYDIA_INFECTION ->
          getPreviousIllnessesAttribute(medicalHistory, PreviousIllness::getChlamydia);

      case MEDICAL_HISTORY_SEXUAL_ORIENTATION_PATIENT ->
          getRiskContactAttribute(medicalHistory, RiskContact::getSexualOrientation);
      case MEDICAL_HISTORY_NUMBER_OF_SEXUAL_PARTNERS_LAST_12_MONTHS ->
          getRiskContactAttribute(
              medicalHistory, RiskContact::getNumberOfSexualPartnersLast12Months);

      case MEDICAL_HISTORY_HEPA_VACCINATION ->
          mapVaccination(medicalHistory, Vaccination.HEPATITIS_A);
      case MEDICAL_HISTORY_HEPB_VACCINATION ->
          mapVaccination(medicalHistory, Vaccination.HEPATITIS_B);
      case MEDICAL_HISTORY_HPV_VACCINATION -> mapVaccination(medicalHistory, Vaccination.HPV);
      case MEDICAL_HISTORY_SAFER_SEX_PRACTICE ->
          getPrevention(medicalHistory).map(Prevention::getSafeSexPractice).orElse(null);
    };
  }

  private static <T> T getExaminationAttribute(
      MedicalHistory medicalHistory, Function<Examination, T> examinationGetter) {
    Examination examination = medicalHistory.getExaminations();
    if (examination == null) {
      return null;
    }
    return examinationGetter.apply(examination);
  }

  private static <T> T getPreviousIllnessesAttribute(
      MedicalHistory medicalHistory, Function<PreviousIllness, T> prevIllnessGetter) {
    PreviousIllness previousIllnesses = medicalHistory.getPreviousIllnesses();
    if (previousIllnesses == null) {
      return null;
    }
    return prevIllnessGetter.apply(previousIllnesses);
  }

  private static <T> T getRiskContactAttribute(
      MedicalHistory medicalHistory, Function<RiskContact, T> riskContactGetter) {
    RiskContact riskContacts = medicalHistory.getRiskContacts();
    if (riskContacts == null) {
      return null;
    }
    return riskContactGetter.apply(riskContacts);
  }

  private static Optional<Prevention> getPrevention(MedicalHistory medicalHistory) {
    return Optional.ofNullable(medicalHistory).map(MedicalHistory::getPrevention);
  }

  private static Boolean mapVaccination(MedicalHistory medicalHistory, Vaccination vaccination) {
    return getPrevention(medicalHistory)
        .map(Prevention::getVaccinations)
        .map(vaccinations -> vaccinations.contains(vaccination))
        .orElse(null);
  }
}
