/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.cronn.reflection.util.PropertyUtils;
import de.cronn.reflection.util.TypedPropertyGetter;
import de.eshg.schoolentry.api.ProcedureProperty;
import de.eshg.schoolentry.api.RequiredProcedureArea;
import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.mapper.ProcedurePropertyMapper;
import java.beans.PropertyDescriptor;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class SchoolInfoLetterValidator {

  private SchoolInfoLetterValidator() {}

  public static Map<RequiredProcedureArea, EnumSet<ProcedureProperty>> validateSchoolEntryProcedure(
      SchoolEntryProcedure procedure) {
    LinkedHashMap<RequiredProcedureArea, EnumSet<ProcedureProperty>> errors = new LinkedHashMap<>();

    putErrorsIfPresent(errors, RequiredProcedureArea.DETAILS, validateDetails(procedure));

    putErrorsIfPresent(
        errors,
        RequiredProcedureArea.HEARING_TEST,
        validateHearingTest(procedure.getHearingTestResult()));

    putErrorsIfPresent(
        errors,
        RequiredProcedureArea.EYE_EXAMINATION,
        validateEyeExamination(procedure.getEyeExaminationResult()));

    putErrorsIfPresent(errors, RequiredProcedureArea.ANAMNESIS, validate(procedure.getAnamnesis()));

    putErrorsIfPresent(
        errors,
        RequiredProcedureArea.SOPESS_EXAMINATION,
        validateSopessExamination(procedure.getSopessExaminationResult()));

    putErrorsIfPresent(
        errors,
        RequiredProcedureArea.DEVELOPMENT_SCREENING,
        validateDevelopmentScreeningResult(procedure.getDevelopmentScreeningResult()));

    putErrorsIfPresent(
        errors,
        RequiredProcedureArea.VACCINATION_STATUS,
        validate(procedure.getVaccinationStatus()));

    return errors;
  }

  private static void putErrorsIfPresent(
      LinkedHashMap<RequiredProcedureArea, EnumSet<ProcedureProperty>> map,
      RequiredProcedureArea key,
      EnumSet<Property> errors) {
    if (!errors.isEmpty()) {
      if (map.containsKey(key)) {
        throw new IllegalStateException("Entry for key %s already exists".formatted(key));
      } else {
        map.put(
            key,
            errors.stream()
                .map(ProcedurePropertyMapper::toDto)
                .collect(Collectors.toCollection(() -> EnumSet.noneOf(ProcedureProperty.class))));
      }
    }
  }

  private static EnumSet<Property> validateDevelopmentScreeningResult(
      DevelopmentScreening developmentScreening) {
    EnumSet<Property> errors = validate(developmentScreening);
    errors.addAll(
        validateHandicapWithDiagnosis(
            developmentScreening.getChronicDisease(),
            Property.DEVELOPMENT_SCREENING_CHRONIC_DISEASE_RESULT,
            Property.DEVELOPMENT_SCREENING_CHRONIC_DISEASE_ICD10));
    errors.addAll(
        validateHandicapWithDiagnosis(
            developmentScreening.getDisability(),
            Property.DEVELOPMENT_SCREENING_DISABILITY_RESULT,
            Property.DEVELOPMENT_SCREENING_DISABILITY_ICD10));
    if (developmentScreening.getDisability() != null
        && Boolean.TRUE.equals(developmentScreening.getDisability().getResult())
        && developmentScreening.getDisabilityType() == null) {
      errors.add(Property.DEVELOPMENT_SCREENING_DISABILITY_TYPE);
    }
    return errors;
  }

  private static EnumSet<Property> validateHandicapWithDiagnosis(
      HandicapWithDiagnosis handicap, Property resultMissing, Property icd10Empty) {
    if (handicap != null) {
      if (handicap.getResult() == null) {
        return EnumSet.of(resultMissing);
      } else {
        if (handicap.getResult() && handicap.getIcd10Codes().isEmpty()) {
          return EnumSet.of(icd10Empty);
        }
      }
    }
    return EnumSet.noneOf(Property.class);
  }

  private static EnumSet<Property> validateSopessExamination(
      SopessExaminationResult sopessExaminationResult) {
    EnumSet<Property> errors = validate(sopessExaminationResult);
    errors.addAll(validateSopessExaminationForNonGermanPrimaryLanguage(sopessExaminationResult));
    return errors;
  }

  private static EnumSet<Property> validateSopessExaminationForNonGermanPrimaryLanguage(
      SopessExaminationResult sopessExaminationResult) {
    if (Objects.equals(sopessExaminationResult.getPrimaryLanguage(), PrimaryLanguageValue.GERMAN)) {
      return EnumSet.noneOf(Property.class);
    } else {
      return Stream.of(
              Property.SOPESS_EXAMINATION_FAMILY_LANGUAGE,
              Property.SOPESS_EXAMINATION_GERMAN_KNOWLEDGE_CHILD,
              Property.SOPESS_EXAMINATION_GERMAN_KNOWLEDGE_PRIMARY_CARER,
              Property.SOPESS_EXAMINATION_IN_GERMANY_SINCE)
          .filter(
              property -> PropertyUtils.read(sopessExaminationResult, property.descriptor) == null)
          .collect(Collectors.toCollection(() -> EnumSet.noneOf(Property.class)));
    }
  }

  private static EnumSet<Property> validateEyeExamination(
      EyeExaminationResult eyeExaminationResult) {
    EnumSet<Property> errors = validate(eyeExaminationResult);
    errors.addAll(
        validateDoctorLetter(
            eyeExaminationResult.getEyeExamination(),
            Property.EYE_EXAMINATION_EYE_EXAMINATION_DOCTOR_LETTER));
    errors.addAll(
        validateDoctorLetter(
            eyeExaminationResult.getIshiharaExamination(),
            Property.EYE_EXAMINATION_ISHIHARA_EXAMINATION_DOCTOR_LETTER));
    errors.addAll(
        validateDoctorLetter(
            eyeExaminationResult.getLangExamination(),
            Property.EYE_EXAMINATION_LANG_EXAMINATION_DOCTOR_LETTER));
    return errors;
  }

  private static EnumSet<Property> validateHearingTest(HearingTestResult hearingTestResult) {
    EnumSet<Property> errors = validate(hearingTestResult);
    errors.addAll(
        validateDoctorLetter(
            hearingTestResult.getExaminationResult(),
            Property.HEARING_TEST_EXAMINATION_RESULT_DOCTOR_LETTER));
    return errors;
  }

  public static EnumSet<Property> validateDetails(SchoolEntryProcedure procedure) {
    EnumSet<Property> errors = EnumSet.noneOf(Property.class);
    if (procedure.getSchoolId() == null) {
      errors.add(Property.SCHOOL_ID);
    }
    if (procedure.getSchoolYear() == null) {
      errors.add(Property.SCHOOL_YEAR);
    }
    if (procedure.getExaminationDate() == null && procedure.getAppointment() == null) {
      errors.add(Property.APPOINTMENT);
    }
    return errors;
  }

  private static EnumSet<Property> validate(ValidatableEntity validatableEntity) {
    return validatableEntity
        .getPropertiesToValidate()
        .map(Property::fromDescriptor)
        .filter(property -> property.required)
        .filter(prop -> PropertyUtils.read(validatableEntity, prop.descriptor) == null)
        .collect(Collectors.toCollection(() -> EnumSet.noneOf(Property.class)));
  }

  private static EnumSet<Property> validateDoctorLetter(
      ExaminationResult result, Property doctorLetterProperty) {
    if (result != null
        && result.getValue().equals(ExaminationResultValue.DOCTOR_LETTER)
        && result.getDoctorLetter() == null) {
      return EnumSet.of(doctorLetterProperty);
    } else {
      return EnumSet.noneOf(Property.class);
    }
  }

  public enum Property {
    HEARING_TEST_EXAMINATION_RESULT(
        hearingTestProperty(HearingTestResult::getExaminationResult), true),
    EYE_EXAMINATION_EYE_EXAMINATION(
        eyeExaminationProperty(EyeExaminationResult::getEyeExamination), true),
    EYE_EXAMINATION_ISHIHARA_EXAMINATION(
        eyeExaminationProperty(EyeExaminationResult::getIshiharaExamination), true),
    EYE_EXAMINATION_LANG_EXAMINATION(
        eyeExaminationProperty(EyeExaminationResult::getLangExamination), true),
    ANAMNESIS_BIRTH_WEIGHT(anamnesisProperty(Anamnesis::getBirthWeight), true),
    ANAMNESIS_CHILD_LANGUAGE_SCREENING(
        anamnesisProperty(Anamnesis::getChildLanguageScreening), true),
    ANAMNESIS_COUNTRY_OF_BIRTH_CHILD(anamnesisProperty(Anamnesis::getCountryOfBirthChild), true),
    ANAMNESIS_COUNTRY_OF_BIRTH_FIRST_PARENT(
        anamnesisProperty(Anamnesis::getCountryOfBirthFirstParent), true),
    ANAMNESIS_COUNTRY_OF_BIRTH_SECOND_PARENT(
        anamnesisProperty(Anamnesis::getCountryOfBirthSecondParent), true),
    ANAMNESIS_EARLY_SUPPORT(anamnesisProperty(Anamnesis::getEarlySupport), true),
    ANAMNESIS_ERGOTHERAPY(anamnesisProperty(Anamnesis::getErgotherapy), true),
    ANAMNESIS_INTEGRATION_PLACE(anamnesisProperty(Anamnesis::getIntegrationPlace), true),
    ANAMNESIS_NATIONALITY_CHILD(anamnesisProperty(Anamnesis::getNationalityChild), true),
    ANAMNESIS_NATIONALITY_FIRST_PARENT(
        anamnesisProperty(Anamnesis::getNationalityFirstParent), true),
    ANAMNESIS_NATIONALITY_SECOND_PARENT(
        anamnesisProperty(Anamnesis::getNationalitySecondParent), true),
    ANAMNESIS_NUMBER_OF_SIBLINGS(anamnesisProperty(Anamnesis::getNumberOfSiblings), true),
    ANAMNESIS_PHYSIOTHERAPY(anamnesisProperty(Anamnesis::getPhysiotherapy), true),
    ANAMNESIS_PRELIMINARY_COURSE(anamnesisProperty(Anamnesis::getPreliminaryCourse), true),
    ANAMNESIS_SPEECH_THERAPY(anamnesisProperty(Anamnesis::getSpeechTherapy), true),
    ANAMNESIS_U_2(anamnesisProperty(Anamnesis::getU2), true),
    ANAMNESIS_U_3(anamnesisProperty(Anamnesis::getU3), true),
    ANAMNESIS_U_4(anamnesisProperty(Anamnesis::getU4), true),
    ANAMNESIS_U_5(anamnesisProperty(Anamnesis::getU5), true),
    ANAMNESIS_U_6(anamnesisProperty(Anamnesis::getU6), true),
    ANAMNESIS_U_7(anamnesisProperty(Anamnesis::getU7), true),
    ANAMNESIS_U_7_A(anamnesisProperty(Anamnesis::getU7a), true),
    ANAMNESIS_U_8(anamnesisProperty(Anamnesis::getU8), true),
    ANAMNESIS_U_9(anamnesisProperty(Anamnesis::getU9), true),
    VACCINATION_STATUS_DIPHTHERIA(
        vaccinationStatusProperty(VaccinationStatus::getDiphtheria), true),
    VACCINATION_STATUS_HEPATITIS_A(
        vaccinationStatusProperty(VaccinationStatus::getHepatitisA), true),
    VACCINATION_STATUS_HEPATITIS_B(
        vaccinationStatusProperty(VaccinationStatus::getHepatitisB), true),
    VACCINATION_STATUS_HIB(vaccinationStatusProperty(VaccinationStatus::getHib), true),
    VACCINATION_STATUS_MENINGOCOCCUS_B(
        vaccinationStatusProperty(VaccinationStatus::getMeningococcusB), true),
    VACCINATION_STATUS_MENINGOCOCCUS_C(
        vaccinationStatusProperty(VaccinationStatus::getMeningococcusC), true),
    VACCINATION_STATUS_MMR(vaccinationStatusProperty(VaccinationStatus::getMmr), true),
    VACCINATION_STATUS_PERKOMBI_HBV(
        vaccinationStatusProperty(VaccinationStatus::getPerkombiHbv), true),
    VACCINATION_STATUS_PERTUSSIS(vaccinationStatusProperty(VaccinationStatus::getPertussis), true),
    VACCINATION_STATUS_PNEUMOCOCCUS(
        vaccinationStatusProperty(VaccinationStatus::getPneumococcus), true),
    VACCINATION_STATUS_POLIO(vaccinationStatusProperty(VaccinationStatus::getPolio), true),
    VACCINATION_STATUS_ROTA(vaccinationStatusProperty(VaccinationStatus::getRota), true),
    VACCINATION_STATUS_TBE(vaccinationStatusProperty(VaccinationStatus::getTbe), true),
    VACCINATION_STATUS_TETANUS(vaccinationStatusProperty(VaccinationStatus::getTetanus), true),
    VACCINATION_STATUS_VACCINATION_SCHEME(
        vaccinationStatusProperty(VaccinationStatus::getVaccinationScheme), true),
    VACCINATION_STATUS_VARICELLA(vaccinationStatusProperty(VaccinationStatus::getVaricella), true),
    SOPESS_EXAMINATION_AUDITIVE_PROCESSING_RESULT(
        sopessExaminationProperty(SopessExaminationResult::getAuditiveProcessingResult), true),
    SOPESS_EXAMINATION_COUNTING_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getCountingPoints), true),
    SOPESS_EXAMINATION_FINE_MOTOR_SKILLS(
        sopessExaminationProperty(SopessExaminationResult::getFineMotorSkills), true),
    SOPESS_EXAMINATION_FORMATION_CH_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getFormationChPoints), true),
    SOPESS_EXAMINATION_FORMATION_SCH_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getFormationSchPoints), true),
    SOPESS_EXAMINATION_FORMATIONS_TR_DR_KR_GR_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getFormationsTrDrKrGrPoints), true),
    SOPESS_EXAMINATION_GROSS_MOTOR_SKILLS(
        sopessExaminationProperty(SopessExaminationResult::getGrossMotorSkills), true),
    SOPESS_EXAMINATION_JUMP_COUNT(
        sopessExaminationProperty(SopessExaminationResult::getJumpCount), true),
    SOPESS_EXAMINATION_KNOWLEDGE_THINKING_RESULT(
        sopessExaminationProperty(SopessExaminationResult::getKnowledgeThinkingResult), true),
    SOPESS_EXAMINATION_LETTER_B_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLetterBPoints), true),
    SOPESS_EXAMINATION_LETTER_F_AND_FORMATION_PF_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLetterFAndFormationPfPoints), true),
    SOPESS_EXAMINATION_LETTER_R_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLetterRPoints), true),
    SOPESS_EXAMINATION_LETTERS_G_AND_K_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLettersGAndKPoints), true),
    SOPESS_EXAMINATION_LETTERS_L_AND_N_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLettersLAndNPoints), true),
    SOPESS_EXAMINATION_LETTERS_S_AND_Z_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLettersSAndZPoints), true),
    SOPESS_EXAMINATION_LETTERS_T_AND_D_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getLettersTAndDPoints), true),
    SOPESS_EXAMINATION_PLURAL_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getPluralPoints), true),
    SOPESS_EXAMINATION_PREPOSITION_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getPrepositionPoints), true),
    SOPESS_EXAMINATION_PRIMARY_LANGUAGE(
        sopessExaminationProperty(SopessExaminationResult::getPrimaryLanguage), true),
    SOPESS_EXAMINATION_PSEUDOWORD_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getPseudowordPoints), true),
    SOPESS_EXAMINATION_PSYCHOLOGICAL_BEHAVIOR_RESULT(
        sopessExaminationProperty(SopessExaminationResult::getPsychologicalBehaviorResult), true),
    SOPESS_EXAMINATION_QUANTITY_KNOWLEDGE_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getQuantityKnowledgePoints), true),
    SOPESS_EXAMINATION_SELECTIVE_ATTENTION_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getSelectiveAttentionPoints), true),
    SOPESS_EXAMINATION_SPEECH_RESULT(
        sopessExaminationProperty(SopessExaminationResult::getSpeechResult), true),
    SOPESS_EXAMINATION_VISUAL_PERCEPTION_POINTS(
        sopessExaminationProperty(SopessExaminationResult::getVisualPerceptionPoints), true),
    SOPESS_EXAMINATION_VISUAL_PERCEPTION_RESULT(
        sopessExaminationProperty(SopessExaminationResult::getVisualPerceptionResult), true),
    SOPESS_EXAMINATION_VISUO_MOTOR(
        sopessExaminationProperty(SopessExaminationResult::getVisuoMotor), true),
    DEVELOPMENT_SCREENING_ABDOMEN(
        developmentScreeningProperty(DevelopmentScreening::getAbdomen), true),
    DEVELOPMENT_SCREENING_CHRONIC_DISEASE(
        developmentScreeningProperty(DevelopmentScreening::getChronicDisease), true),
    DEVELOPMENT_SCREENING_DIASTOLE(
        developmentScreeningProperty(DevelopmentScreening::getDiastole), true),
    DEVELOPMENT_SCREENING_DISABILITY(
        developmentScreeningProperty(DevelopmentScreening::getDisability), true),
    DEVELOPMENT_SCREENING_EAR_NOSE_THROAT(
        developmentScreeningProperty(DevelopmentScreening::getEarNoseThroat), true),
    DEVELOPMENT_SCREENING_EDUCATIONAL_ADVICE(
        developmentScreeningProperty(DevelopmentScreening::getEducationalAdvice), true),
    DEVELOPMENT_SCREENING_EXTRA_EFFORT(
        developmentScreeningProperty(DevelopmentScreening::getExtraEffort), true),
    DEVELOPMENT_SCREENING_HEIGHT(
        developmentScreeningProperty(DevelopmentScreening::getHeight), true),
    DEVELOPMENT_SCREENING_INFO_LETTER(
        developmentScreeningProperty(DevelopmentScreening::getInfoLetter), true),
    DEVELOPMENT_SCREENING_LANGUAGE_ADVICE(
        developmentScreeningProperty(DevelopmentScreening::getLanguageAdvice), true),
    DEVELOPMENT_SCREENING_METABOLISM(
        developmentScreeningProperty(DevelopmentScreening::getMetabolism), true),
    DEVELOPMENT_SCREENING_MOTOR_PROMOTION(
        developmentScreeningProperty(DevelopmentScreening::getMotorPromotion), true),
    DEVELOPMENT_SCREENING_MUSCULATURE_SKELETON(
        developmentScreeningProperty(DevelopmentScreening::getMusculatureSkeleton), true),
    DEVELOPMENT_SCREENING_NEUROLOGY(
        developmentScreeningProperty(DevelopmentScreening::getNeurology), true),
    DEVELOPMENT_SCREENING_NUTRITIONAL_ADVICE(
        developmentScreeningProperty(DevelopmentScreening::getNutritionalAdvice), true),
    DEVELOPMENT_SCREENING_NUTRITIONAL_CONDITION(
        developmentScreeningProperty(DevelopmentScreening::getNutritionalCondition), true),
    DEVELOPMENT_SCREENING_OTHER_SUPPORT(
        developmentScreeningProperty(DevelopmentScreening::getOtherSupport), true),
    DEVELOPMENT_SCREENING_RE_INTRODUCTION(
        developmentScreeningProperty(DevelopmentScreening::getReIntroduction), true),
    DEVELOPMENT_SCREENING_RESPIRATORY_CARDIOVASCULAR(
        developmentScreeningProperty(DevelopmentScreening::getRespiratoryCardiovascular), true),
    DEVELOPMENT_SCREENING_SCHOOL_COUNSELLING(
        developmentScreeningProperty(DevelopmentScreening::getSchoolCounselling), true),
    DEVELOPMENT_SCREENING_SCHOOL_RECOMMENDATION(
        developmentScreeningProperty(DevelopmentScreening::getSchoolRecommendation), true),
    DEVELOPMENT_SCREENING_SKIN(developmentScreeningProperty(DevelopmentScreening::getSkin), true),
    DEVELOPMENT_SCREENING_SOCIAL_SERVICE(
        developmentScreeningProperty(DevelopmentScreening::getSocialService), true),
    DEVELOPMENT_SCREENING_SYSTOLE(
        developmentScreeningProperty(DevelopmentScreening::getSystole), true),
    DEVELOPMENT_SCREENING_VACCINATION_ADVICE(
        developmentScreeningProperty(DevelopmentScreening::getVaccinationAdvice), true),
    DEVELOPMENT_SCREENING_WEIGHT(
        developmentScreeningProperty(DevelopmentScreening::getWeight), true),

    HEARING_TEST_RIGHT_EAR(hearingTestProperty(HearingTestResult::getRightEar), false),
    HEARING_TEST_LEFT_EAR(hearingTestProperty(HearingTestResult::getLeftEar), false),
    HEARING_TEST_NOTE(hearingTestProperty(HearingTestResult::getNote), false),
    ANAMNESIS_ADDITIONAL_THERAPIES(anamnesisProperty(Anamnesis::getAdditionalTherapies), false),
    ANAMNESIS_ALLERGIES(anamnesisProperty(Anamnesis::getAllergies), false),
    ANAMNESIS_CAN_SWIM(anamnesisProperty(Anamnesis::getCanSwim), false),
    ANAMNESIS_CHRONIC_ILLNESS_OR_DISABILITY_IN_FAMILY(
        anamnesisProperty(Anamnesis::getChronicIllnessOrDisabilityInFamily), false),
    ANAMNESIS_CLUB_SPORT(anamnesisProperty(Anamnesis::getClubSport), false),
    ANAMNESIS_DAYCARE_NAME(anamnesisProperty(Anamnesis::getDaycareName), false),
    ANAMNESIS_DEVELOPMENT_CONSPICUITIES(
        anamnesisProperty(Anamnesis::getDevelopmentConspicuities), false),
    ANAMNESIS_ERGO_THERAPY_END(anamnesisProperty(Anamnesis::getErgoTherapyEnd), false),
    ANAMNESIS_ERGO_THERAPY_START(anamnesisProperty(Anamnesis::getErgoTherapyStart), false),
    ANAMNESIS_GESTATIONAL_AGE(anamnesisProperty(Anamnesis::getGestationalAge), false),
    ANAMNESIS_MIGRATION_BACKGROUND(anamnesisProperty(Anamnesis::getHasMigrationBackground), false),
    ANAMNESIS_SEAHORSE_BADGE(anamnesisProperty(Anamnesis::getHasSeahorseBadge), false),
    ANAMNESIS_HEARING_AID(anamnesisProperty(Anamnesis::getHearingAid), false),
    ANAMNESIS_HEARING_IMPAIRMENT(anamnesisProperty(Anamnesis::getHearingImpairment), false),
    ANAMNESIS_HOSPITALIZATIONS_OR_OPERATIONS(
        anamnesisProperty(Anamnesis::getHospitalizationsOrOperations), false),
    ANAMNESIS_IN_DAYCARE_SINCE(anamnesisProperty(Anamnesis::getInDaycareSince), false),
    ANAMNESIS_INFANCY_CONSPICUITIES(anamnesisProperty(Anamnesis::getInfancyConspicuities), false),
    ANAMNESIS_OTHER_INTERESTS(anamnesisProperty(Anamnesis::getOtherInterests), false),
    ANAMNESIS_PERSONAL_CONSPICUITIES(anamnesisProperty(Anamnesis::getPersonalConspicuities), false),
    ANAMNESIS_PHYSIO_THERAPY_END(anamnesisProperty(Anamnesis::getPhysioTherapyEnd), false),
    ANAMNESIS_PHYSIO_THERAPY_START(anamnesisProperty(Anamnesis::getPhysioTherapyStart), false),
    ANAMNESIS_REGULAR_MEDICATION(anamnesisProperty(Anamnesis::getRegularMedication), false),
    ANAMNESIS_RESPONSIBLE_PHYSICIAN(anamnesisProperty(Anamnesis::getResponsiblePhysician), false),
    ANAMNESIS_SCHOOL_NAME(anamnesisProperty(Anamnesis::getSchoolName), false),
    ANAMNESIS_SEVERE_ILLNESSES(anamnesisProperty(Anamnesis::getSevereIllnesses), false),
    ANAMNESIS_SIBLINGS_BIRTH_YEARS(anamnesisProperty(Anamnesis::getSiblingsBirthYears), false),
    ANAMNESIS_SPECTACLES_IN_FAMILY(anamnesisProperty(Anamnesis::getSpectaclesInFamily), false),
    ANAMNESIS_SPECTACLES_SINCE(anamnesisProperty(Anamnesis::getSpectaclesSince), false),
    ANAMNESIS_SPEECH_IMPAIRMENT(anamnesisProperty(Anamnesis::getSpeechImpairment), false),
    ANAMNESIS_SPEECH_THERAPY_END(anamnesisProperty(Anamnesis::getSpeechTherapyEnd), false),
    ANAMNESIS_SPEECH_THERAPY_START(anamnesisProperty(Anamnesis::getSpeechTherapyStart), false),
    ANAMNESIS_UNDER_MEDICAL_TREATMENT_FOR(
        anamnesisProperty(Anamnesis::getUnderMedicalTreatmentFor), false),
    ANAMNESIS_VISION_IMPAIRMENT(anamnesisProperty(Anamnesis::getVisionImpairment), false),
    ANAMNESIS_VISION_SCHOOL_SINCE(anamnesisProperty(Anamnesis::getVisionSchoolSince), false),
    ANAMNESIS_WAS_IN_DAYCARE(anamnesisProperty(Anamnesis::getWasInDaycare), false),
    ANAMNESIS_NOTE(anamnesisProperty(Anamnesis::getNote), false),
    ANAMNESIS_LANGUAGE_SCREENING_CONSENT(
        anamnesisProperty(Anamnesis::getLanguageScreeningConsent), false),
    ANAMNESIS_DAILY_TEETH_BRUSHING(anamnesisProperty(Anamnesis::getDailyTeethBrushing), false),
    ANAMNESIS_TEETH_BRUSHING_AFTER_CARE(
        anamnesisProperty(Anamnesis::getTeethBrushingAfterCare), false),
    ANAMNESIS_ELECTRIC_TOOTH_BRUSH(anamnesisProperty(Anamnesis::getElectricToothBrush), false),
    ANAMNESIS_FLUORIDE_TOOTH_PASTE(anamnesisProperty(Anamnesis::getFluorideToothPaste), false),
    ANAMNESIS_MEDIA_CONSUMPTION(anamnesisProperty(Anamnesis::getMediaConsumption), false),
    EYE_EXAMINATION_AMBLYOPIA(eyeExaminationProperty(EyeExaminationResult::getAmblyopia), false),
    EYE_EXAMINATION_ASTIGMATISM(
        eyeExaminationProperty(EyeExaminationResult::getAstigmatism), false),
    EYE_EXAMINATION_COLOR_VISION_DISORDER(
        eyeExaminationProperty(EyeExaminationResult::getColorVisionDisorder), false),
    EYE_EXAMINATION_HYPEROPIA(eyeExaminationProperty(EyeExaminationResult::getHyperopia), false),
    EYE_EXAMINATION_LEFT_EYE(eyeExaminationProperty(EyeExaminationResult::getLeftEye), false),
    EYE_EXAMINATION_MYOPIA(eyeExaminationProperty(EyeExaminationResult::getMyopia), false),
    EYE_EXAMINATION_NOTE(eyeExaminationProperty(EyeExaminationResult::getNote), false),
    EYE_EXAMINATION_OTHER_DIAGNOSIS(
        eyeExaminationProperty(EyeExaminationResult::getOtherDiagnosis), false),
    EYE_EXAMINATION_RIGHT_EYE(eyeExaminationProperty(EyeExaminationResult::getRightEye), false),
    EYE_EXAMINATION_STRABISMUS(eyeExaminationProperty(EyeExaminationResult::getStrabismus), false),
    VACCINATION_STATUS_OTHER_VACCINATIONS(
        vaccinationStatusProperty(VaccinationStatus::getOtherVaccinations), false),
    VACCINATION_STATUS_VACCINATION_PASS_PRESENTED(
        vaccinationStatusProperty(VaccinationStatus::getVaccinationPassPresented), false),
    VACCINATION_STATUS_MEASLES_CONTRA_INDICATION(
        vaccinationStatusProperty(VaccinationStatus::getMeaslesContraIndication), false),
    VACCINATION_STATUS_MEASLES_CONTRA_INDICATION_IS_PERMANENT(
        vaccinationStatusProperty(VaccinationStatus::getMeaslesContraIndicationIsPermanent), false),
    VACCINATION_STATUS_MEASLES_CONTRA_INDICATION_UNTIL(
        vaccinationStatusProperty(VaccinationStatus::getMeaslesContraIndicationUntil), false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_AUDITIVE_PROCESSING(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterAuditiveProcessing),
        false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_FINE_MOTOR_SKILLS(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterFineMotorSkills), false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_GROSS_MOTOR_SKILLS(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterGrossMotorSkills), false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_KNOWLEDGE_THINKING(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterKnowledgeThinking),
        false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_PSYCHOLOGICAL_BEHAVIOR(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterPsychologicalBehavior),
        false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_SPEECH(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterSpeech), false),
    SOPESS_EXAMINATION_DOCTOR_LETTER_VISUAL_PERCEPTION(
        sopessExaminationProperty(SopessExaminationResult::getDoctorLetterVisualPerception), false),
    SOPESS_EXAMINATION_FAMILY_LANGUAGE(
        sopessExaminationProperty(SopessExaminationResult::getFamilyLanguage), false),
    SOPESS_EXAMINATION_GERMAN_KNOWLEDGE_CHILD(
        sopessExaminationProperty(SopessExaminationResult::getGermanKnowledgeChild), false),
    SOPESS_EXAMINATION_GERMAN_KNOWLEDGE_PRIMARY_CARER(
        sopessExaminationProperty(SopessExaminationResult::getGermanKnowledgePrimaryCarer), false),
    SOPESS_EXAMINATION_IN_GERMANY_SINCE(
        sopessExaminationProperty(SopessExaminationResult::getInGermanySince), false),
    SOPESS_EXAMINATION_HANDEDNESS_VALUE(
        sopessExaminationProperty(SopessExaminationResult::getHandednessValue), false),
    SOPESS_EXAMINATION_NOTE(sopessExaminationProperty(SopessExaminationResult::getNote), false),
    DEVELOPMENT_SCREENING_BMI(developmentScreeningProperty(DevelopmentScreening::getBmi), false),
    DEVELOPMENT_SCREENING_BMI_PERCENTILE(
        developmentScreeningProperty(DevelopmentScreening::getBmiPercentile), false),
    DEVELOPMENT_SCREENING_DISABILITY_TYPE(
        developmentScreeningProperty(DevelopmentScreening::getDisabilityType), false),
    DEVELOPMENT_SCREENING_FAMILY(
        developmentScreeningProperty(DevelopmentScreening::getFamily), false),
    DEVELOPMENT_SCREENING_HANDICAP_NOTE(
        developmentScreeningProperty(DevelopmentScreening::getHandicapNote), false),
    DEVELOPMENT_SCREENING_HEIGHT_PERCENTILE(
        developmentScreeningProperty(DevelopmentScreening::getHeightPercentile), false),
    DEVELOPMENT_SCREENING_MIGRATION(
        developmentScreeningProperty(DevelopmentScreening::getMigration), false),
    DEVELOPMENT_SCREENING_NON_COMPLIANCE(
        developmentScreeningProperty(DevelopmentScreening::getNonCompliance), false),
    DEVELOPMENT_SCREENING_OTHER_RISK(
        developmentScreeningProperty(DevelopmentScreening::getOtherRisk), false),
    DEVELOPMENT_SCREENING_PHYSICAL_EXAMINATION_NOTE(
        developmentScreeningProperty(DevelopmentScreening::getPhysicalExaminationNote), false),
    DEVELOPMENT_SCREENING_SCHOOL_FEEDBACK(
        developmentScreeningProperty(DevelopmentScreening::getSchoolFeedback), false),
    DEVELOPMENT_SCREENING_SOCIAL(
        developmentScreeningProperty(DevelopmentScreening::getSocial), false),
    DEVELOPMENT_SCREENING_WEIGHT_PERCENTILE(
        developmentScreeningProperty(DevelopmentScreening::getWeightPercentile), false),
    VACCINATION_STATUS_NOTE(vaccinationStatusProperty(VaccinationStatus::getNote), false),

    SCHOOL_ID(null, true),
    SCHOOL_YEAR(null, true),
    APPOINTMENT(null, false),
    EXAMINATION_DATE(null, false),
    HEARING_TEST_EXAMINATION_RESULT_DOCTOR_LETTER(null, false),
    EYE_EXAMINATION_EYE_EXAMINATION_DOCTOR_LETTER(null, false),
    EYE_EXAMINATION_ISHIHARA_EXAMINATION_DOCTOR_LETTER(null, false),
    EYE_EXAMINATION_LANG_EXAMINATION_DOCTOR_LETTER(null, false),
    DEVELOPMENT_SCREENING_CHRONIC_DISEASE_RESULT(null, false),
    DEVELOPMENT_SCREENING_CHRONIC_DISEASE_ICD10(null, false),
    DEVELOPMENT_SCREENING_DISABILITY_RESULT(null, false),
    DEVELOPMENT_SCREENING_DISABILITY_ICD10(null, false);

    final PropertyDescriptor descriptor;
    final boolean required;

    Property(PropertyDescriptor descriptor, boolean required) {
      this.descriptor = descriptor;
      this.required = required;
    }

    static Property fromDescriptor(PropertyDescriptor descriptor) {
      return Arrays.stream(values())
          .filter(property -> descriptor.equals(property.descriptor))
          .findAny()
          .orElse(null);
    }
  }

  private static PropertyDescriptor hearingTestProperty(
      TypedPropertyGetter<HearingTestResult, ?> getter) {
    return PropertyUtils.getPropertyDescriptor(HearingTestResult.class, getter);
  }

  private static PropertyDescriptor anamnesisProperty(TypedPropertyGetter<Anamnesis, ?> getter) {
    return PropertyUtils.getPropertyDescriptor(Anamnesis.class, getter);
  }

  private static PropertyDescriptor eyeExaminationProperty(
      TypedPropertyGetter<EyeExaminationResult, ?> getter) {
    return PropertyUtils.getPropertyDescriptor(EyeExaminationResult.class, getter);
  }

  private static PropertyDescriptor vaccinationStatusProperty(
      TypedPropertyGetter<VaccinationStatus, ?> getter) {
    return PropertyUtils.getPropertyDescriptor(VaccinationStatus.class, getter);
  }

  private static PropertyDescriptor sopessExaminationProperty(
      TypedPropertyGetter<SopessExaminationResult, ?> getter) {
    return PropertyUtils.getPropertyDescriptor(SopessExaminationResult.class, getter);
  }

  private static PropertyDescriptor developmentScreeningProperty(
      TypedPropertyGetter<DevelopmentScreening, ?> getter) {
    return PropertyUtils.getPropertyDescriptor(DevelopmentScreening.class, getter);
  }
}
