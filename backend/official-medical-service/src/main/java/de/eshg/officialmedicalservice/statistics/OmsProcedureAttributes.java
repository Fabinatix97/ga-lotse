/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.statistics;

import static de.eshg.officialmedicalservice.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_ANAMNESIS;
import static de.eshg.officialmedicalservice.statistics.AttributeUtil.ATTRIBUTE_CATEGORY_PROCEDURE;
import static de.eshg.officialmedicalservice.statistics.AttributeUtil.germanNameForProcedureStatus;
import static de.eshg.officialmedicalservice.statistics.AttributeUtil.opticalAidAnswerValueOptions;
import static de.eshg.officialmedicalservice.statistics.AttributeUtil.yesNoDontKnowAnswerValueOptions;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.attributes.AttributeData;
import de.eshg.lib.statistics.attributes.AttributeInfo;
import de.eshg.lib.statistics.attributes.BooleanAttribute;
import de.eshg.lib.statistics.attributes.CentralFileIdPersonAttribute;
import de.eshg.lib.statistics.attributes.DecimalAttribute;
import de.eshg.lib.statistics.attributes.IntegerAttribute;
import de.eshg.lib.statistics.attributes.ProcedureAttribute;
import de.eshg.lib.statistics.attributes.TextAttribute;
import de.eshg.lib.statistics.attributes.ValueWithOptionsAttribute;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.AffectedPersonInfoDto.FillingPersonDto;
import de.eshg.officialmedicalservice.anamnesis.api.AnamnesisDto.AffectedPersonInfoDto.MaritalStatusDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.MedicalOpinionResult;
import java.util.Arrays;

public enum OmsProcedureAttributes implements AttributeInfo {
  PROCEDURE_ID(ProcedureAttribute.create("Vorgangsreferenz", ATTRIBUTE_CATEGORY_PROCEDURE, true)),

  STATUS(
      ValueWithOptionsAttribute.create(
          "Vorgangsstatus",
          "STATUS",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          false,
          Arrays.stream(ProcedureStatus.values())
              .map(
                  entry ->
                      new ValueOptionInternal(
                          entry.name(), germanNameForProcedureStatus(entry), false))
              .toList())),

  CONCERN(TextAttribute.create("Anliegen", "CONCERN", ATTRIBUTE_CATEGORY_PROCEDURE, false)),

  CONCERN_CATEGORY(
      TextAttribute.create(
          "Kategorie (Anliegen)", "CONCERN_CATEGORY", ATTRIBUTE_CATEGORY_PROCEDURE, false)),

  DURATION(
      IntegerAttribute.create(
          "Dauer bis Vorgangsabschluss", "DURATION", ATTRIBUTE_CATEGORY_PROCEDURE, false)),

  PERSON_CENTRAL_FILE_ID(
      CentralFileIdPersonAttribute.create(
          "Person", "PERSON_CENTRAL_FILE_ID", ATTRIBUTE_CATEGORY_PROCEDURE, true)),

  NUMBER_OF_DOCUMENTS(
      IntegerAttribute.create(
          "Anzahl der Dokumente", "NUMBER_OF_DOCUMENTS", ATTRIBUTE_CATEGORY_PROCEDURE, true)),

  NUMBER_OF_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl der Termine", "NUMBER_OF_APPOINTMENTS", ATTRIBUTE_CATEGORY_PROCEDURE, true)),

  NUMBER_OF_BOOKED_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl der gebuchten Termine",
          "NUMBER_OF_BOOKED_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),

  NUMBER_OF_CANCELLED_APPOINTMENTS(
      IntegerAttribute.create(
          "Anzahl der abgesagten Termine",
          "NUMBER_OF_CANCELLED_APPOINTMENTS",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true)),

  MEDICAL_OPINION_RESULT(
      ValueWithOptionsAttribute.create(
          "Gutachtenergebnis",
          "MEDICAL_OPINION_RESULT",
          ATTRIBUTE_CATEGORY_PROCEDURE,
          true,
          Arrays.stream(MedicalOpinionResult.values())
              .map(
                  entry ->
                      new ValueOptionInternal(
                          entry.name(),
                          entry.getGermanName(),
                          entry == MedicalOpinionResult.UNKNOWN))
              .toList())),

  AFFECTED_PERSON_INFO_FILLING_PERSON(
      ValueWithOptionsAttribute.create(
          "Angaben zur Person: Ausfüllende Person",
          "AFFECTED_PERSON_INFO_FILLING_PERSON ",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          Arrays.stream(FillingPersonDto.values())
              .map(entry -> new ValueOptionInternal(entry.name(), entry.getGermanName(), false))
              .toList())),

  AFFECTED_PERSON_INFO_MARITAL_STATUS(
      ValueWithOptionsAttribute.create(
          "Angaben zur Person: Familienstand",
          "AFFECTED_PERSON_INFO_MARITAL_STATUS",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          Arrays.stream(MaritalStatusDto.values())
              .map(
                  entry ->
                      new ValueOptionInternal(
                          entry.name(),
                          entry.getGermanName(),
                          entry == MaritalStatusDto.NO_SELECTION))
              .toList())),

  AFFECTED_PERSON_INFO_NUMBER_OF_CHILDREN(
      IntegerAttribute.create(
          "Angaben zur Person: Anzahl Kinder",
          "AFFECTED_PERSON_INFO_NUMBER_OF_CHILDREN",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  AFFECTED_PERSON_INFO_OCCUPATION(
      TextAttribute.create(
          "Angaben zur Person: Beruf",
          "AFFECTED_PERSON_INFO_OCCUPATION",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  HEALTH_FITNESS_AND_DISABILITY_INFO_PRIOR_EXAMINATIONS_SEGMENT_HAS_PRIOR_EXAMINATIONS(
      BooleanAttribute.create(
          "Gesundheitliche Eignung und Behinderung: Vorherige Untersuchungen - Person hatte vorherige Untersuchungen",
          "HEALTH_FITNESS_AND_DISABILITY_INFO_PRIOR_EXAMINATIONS_SEGMENT_HAS_PRIOR_EXAMINATIONS",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  HEALTH_FITNESS_AND_DISABILITY_INFO_DISABILITY_SEGMENT_HAS_DISABILITY(
      BooleanAttribute.create(
          "Gesundheitliche Eignung und Behinderung: Behinderung - Person hat Behinderungen",
          "HEALTH_FITNESS_AND_DISABILITY_INFO_DISABILITY_SEGMENT_HAS_DISABILITY",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  HEALTH_FITNESS_AND_DISABILITY_INFO_DISABILITY_SEGMENT_DEGREE(
      TextAttribute.create(
          "Gesundheitliche Eignung und Behinderung: Behinderung - Grad der Behinderung",
          "HEALTH_FITNESS_AND_DISABILITY_INFO_DISABILITY_SEGMENT_DEGREE",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  RETIREMENT_INFO_APPLIED_FOR_RETIREMENT(
      TextAttribute.create(
          "Antrag auf Rente: Rente beantragt",
          "RETIREMENT_INFO_APPLIED_FOR_RETIREMENT",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_HAD_PAST_DISEASES_OR_DISABILITIES(
      BooleanAttribute.create(
          "Gesundheitliche Vorgeschichte: Hatte Krankheiten oder Behinderungen",
          "MEDICAL_HISTORY_INFO_HAD_PAST_DISEASES_OR_DISABILITIES",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Herz-, Kreislauf-, Gefäßerkrankungen - Antwort",
          "MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_BYPASS(
      BooleanAttribute.create(
          "Gesundheitliche Vorgeschichte: Herz-, Kreislauf-, Gefäßerkrankungen - Bypass",
          "MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_BYPASS",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_STENT(
      BooleanAttribute.create(
          "Gesundheitliche Vorgeschichte: Herz-, Kreislauf-, Gefäßerkrankungen - Stent",
          "MEDICAL_HISTORY_INFO_HEART_DISEASE_INFO_STENT",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_NERVOUS_SYSTEM_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Nervensystem - Antwort",
          "MEDICAL_HISTORY_INFO_NERVOUS_SYSTEM_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_BONES_JOINTS_AND_SPINES_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Knochen- und Gelenksystem / Wirbelsäule - Antwort",
          "MEDICAL_HISTORY_INFO_BONES_JOINTS_AND_SPINES_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_BLADDER_KIDNEYS_ABDOMINAL_ORGAN_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Blase, Nieren, Unterleibsorgan - Antwort",
          "MEDICAL_HISTORY_INFO_BLADDER_KIDNEYS_ABDOMINAL_ORGAN_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_ALLERGIES_AND_INTOLERANCE_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Blase, Nieren, Unterleibsorgan - Antwort",
          "MEDICAL_HISTORY_INFO_ALLERGIES_AND_INTOLERANCE_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_EARS_NOSE_AND_THROAT_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Hals / Nasen / Ohren - Antwort",
          "MEDICAL_HISTORY_INFO_EARS_NOSE_AND_THROAT_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_BRONCHIAL_LUNGS_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Bronchien / Lunge - Antwort",
          "MEDICAL_HISTORY_INFO_BRONCHIAL_LUNGS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_CANCER_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Krebserkrankung - Antwort",
          "MEDICAL_HISTORY_INFO_CANCER_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_CANCER_INFO_WHICH_AND_WHEN(
      TextAttribute.create(
          "Gesundheitliche Vorgeschichte: Krebserkrankung - Welche und wann?",
          "MEDICAL_HISTORY_INFO_CANCER_INFO_WHICH_AND_WHEN",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_CANCER_INFO_CHEMO_RADIATION_THERAPY(
      BooleanAttribute.create(
          "Gesundheitliche Vorgeschichte: Krebserkrankung - Chemo- / Strahlentherapie",
          "MEDICAL_HISTORY_INFO_CANCER_INFO_CHEMO_RADIATION_THERAPY",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_STOMACH_AND_INTESTINES_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Magen / Darm - Antwort",
          "MEDICAL_HISTORY_STOMACH_AND_INTESTINES_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_LIVER_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Leber - Antwort",
          "MEDICAL_HISTORY_LIVER_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_DIABETES_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Diabetes - Antwort",
          "MEDICAL_HISTORY_DIABETES_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_EATING_DISORDER_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Essstörung - Antwort",
          "MEDICAL_EATING_DISORDER_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_MENTAL_ILLNESS_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Psychische Erkrankung - Antwort",
          "MEDICAL_HISTORY_INFO_MENTAL_ILLNESS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_THYROID_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Schilddrüse - Antwort",
          "MEDICAL_HISTORY_INFO_THYROID_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Suchterkrankungen - Antwort",
          "MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_AMOUNT(
      TextAttribute.create(
          "Gesundheitliche Vorgeschichte: Suchterkrankungen - Menge",
          "MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_AMOUNT",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_SINCE(
      TextAttribute.create(
          "Gesundheitliche Vorgeschichte: Suchterkrankungen - Seit wann",
          "MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_SINCE",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_NOT_ANYMORE_SINCE(
      TextAttribute.create(
          "Gesundheitliche Vorgeschichte: Suchterkrankungen - Nicht mehr seit",
          "MEDICAL_HISTORY_INFO_ADDICTIONS_INFO_NOT_ANYMORE_SINCE",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_TUBERCULOSIS_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Tuberkulose - Antwort",
          "MEDICAL_HISTORY_INFO_TUBERCULOSIS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Übergewicht / Adipositas - Antwort",
          "MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_HEIGHT_IN_CM(
      DecimalAttribute.create(
          "Gesundheitliche Vorgeschichte: Übergewicht / Adipositas - Körpergröße in cm",
          "MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_HEIGHT_IN_CM",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_WEIGHT_IN_KG(
      DecimalAttribute.create(
          "Gesundheitliche Vorgeschichte: Übergewicht / Adipositas - Körpergewicht in kg",
          "MEDICAL_HISTORY_INFO_OVERWEIGHT_INFO_WEIGHT_IN_KG",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  MEDICAL_HISTORY_INFO_BONE_FRACTURE_BRAIN_TRAUMA_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Gesundheitliche Vorgeschichte: Unfälle: Knochenbruch / Hirntrauma - Antwort",
          "MEDICAL_HISTORY_INFO_BONE_FRACTURE_BRAIN_TRAUMA_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          yesNoDontKnowAnswerValueOptions())),

  MEDICAL_HISTORY_INFO_BONE_FRACTURE_BRAIN_TRAUMA_INFO_DESCRIPTION(
      TextAttribute.create(
          "Gesundheitliche Vorgeschichte: Unfälle: Knochenbruch / Hirntrauma - Beschreibung",
          "MEDICAL_HISTORY_INFO_BONE_FRACTURE_BRAIN_TRAUMA_INFO_DESCRIPTION",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_CURRENT_MEDICAL_CONDITIONS_INFO_ANSWER(
      BooleanAttribute.create(
          "Aktueller Gesundheitszustand: Aktuelle Beschwerden - Antwort",
          "CURRENT_HEALTH_CONDITION_INFO_CURRENT_MEDICAL_CONDITIONS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_MEDICAL_IMAGING_FINDINGS_INFO_ANSWER(
      BooleanAttribute.create(
          "Aktueller Gesundheitszustand: Befunde bildgebender Verfahren - Antwort",
          "CURRENT_HEALTH_CONDITION_INFO_MEDICAL_IMAGING_FINDINGS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_MEDICAL_IMAGING_FINDINGS_INFO_RESULT(
      TextAttribute.create(
          "Aktueller Gesundheitszustand: Befunde bildgebender Verfahren - Ergebnis",
          "CURRENT_HEALTH_CONDITION_INFO_MEDICAL_IMAGING_FINDINGS_INFO_RESULT",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_MEDICATION_DIETARY_SUPPLEMENTS_OR_DRUGS_INFO_ANSWER(
      BooleanAttribute.create(
          "Aktueller Gesundheitszustand: Medikamente, Nahrungsergänzungsmittel oder Drogen - Antwort",
          "CURRENT_HEALTH_CONDITION_INFO_MEDICATION_DIETARY_SUPPLEMENTS_OR_DRUGS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_MEDICATION_DIETARY_SUPPLEMENTS_OR_DRUGS_INFO_SUBSTANCES(
      TextAttribute.create(
          "Aktueller Gesundheitszustand: Medikamente, Nahrungsergänzungsmittel oder Drogen - Mittel",
          "CURRENT_HEALTH_CONDITION_INFO_MEDICATION_DIETARY_SUPPLEMENTS_OR_DRUGS_INFO_SUBSTANCES",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_HEALTHY_AND_CAPABLE_INFO_ANSWER(
      BooleanAttribute.create(
          "Aktueller Gesundheitszustand: Gesund und leistungsfähig - Antwort",
          "CURRENT_HEALTH_CONDITION_INFO_HEALTHY_AND_CAPABLE_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_SPORTS_INFO_ANSWER(
      BooleanAttribute.create(
          "Aktueller Gesundheitszustand: Sport - Antwort",
          "CURRENT_HEALTH_CONDITION_INFO_SPORTS_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_SPORTS_INFO_FORM_OF_SPORT(
      TextAttribute.create(
          "Aktueller Gesundheitszustand: Sport - Sportart",
          "CURRENT_HEALTH_CONDITION_INFO_SPORTS_INFO_FORM_OF_SPORT",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false)),

  CURRENT_HEALTH_CONDITION_INFO_OPTICAL_AID_INFO_ANSWER(
      ValueWithOptionsAttribute.create(
          "Aktueller Gesundheitszustand: Sehhilfe - Antwort",
          "CURRENT_HEALTH_CONDITION_INFO_OPTICAL_AID_INFO_ANSWER",
          ATTRIBUTE_CATEGORY_ANAMNESIS,
          false,
          opticalAidAnswerValueOptions())),
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
