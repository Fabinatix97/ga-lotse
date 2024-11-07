/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter;

import de.cronn.reflection.util.PropertyUtils;
import de.cronn.reflection.util.TypedPropertyGetter;
import de.eshg.schoolentry.api.RequiredProcedureData;
import de.eshg.schoolentry.domain.model.*;
import jakarta.validation.constraints.NotNull;
import java.beans.PropertyDescriptor;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class SchoolInfoLetterValidator {

  private SchoolInfoLetterValidator() {}

  public static Map<RequiredProcedureData, Boolean> validateSchoolEntryProcedure(
      SchoolEntryProcedure procedure) {
    Map<RequiredProcedureData, Boolean> result = new HashMap<>();

    result.put(
        RequiredProcedureData.DETAILS,
        procedure.getSchoolId() != null
            && (procedure.getAppointment() != null || procedure.getExaminationDate() != null));
    result.put(RequiredProcedureData.HEARING_TEST, validate(procedure.getHearingTestResult()));
    result.put(
        RequiredProcedureData.EYE_EXAMINATION, validate(procedure.getEyeExaminationResult()));
    result.put(RequiredProcedureData.ANAMNESIS, validate(procedure.getAnamnesis()));
    result.put(
        RequiredProcedureData.SOPESS_EXAMINATION, validate(procedure.getSopessExaminationResult()));
    result.put(
        RequiredProcedureData.DEVELOPMENT_SCREENING,
        validate(procedure.getDevelopmentScreeningResult()));
    result.put(
        RequiredProcedureData.VACCINATION_STATUS, validate(procedure.getVaccinationStatus()));

    result.compute(
        RequiredProcedureData.HEARING_TEST,
        validateSpecialCases(
            procedure.getHearingTestResult(),
            SchoolInfoLetterValidator::validateExaminationResult,
            Stream.of(HearingTestResult::getExaminationResult)));

    result.compute(
        RequiredProcedureData.EYE_EXAMINATION,
        validateSpecialCases(
            procedure.getEyeExaminationResult(),
            SchoolInfoLetterValidator::validateExaminationResult,
            Stream.of(
                EyeExaminationResult::getEyeExamination,
                EyeExaminationResult::getIshiharaExamination,
                EyeExaminationResult::getLangExamination)));

    result.compute(
        RequiredProcedureData.SOPESS_EXAMINATION,
        validateSpecialCases(
            procedure.getSopessExaminationResult(),
            mandatoryIfPrimaryLanguageIsNotGerman(procedure.getSopessExaminationResult()),
            Stream.of(
                SopessExaminationResult::getFamilyLanguage,
                SopessExaminationResult::getGermanKnowledgeChild,
                SopessExaminationResult::getGermanKnowledgePrimaryCarer)));

    result.compute(
        RequiredProcedureData.DEVELOPMENT_SCREENING,
        validateSpecialCases(
            procedure.getDevelopmentScreeningResult(),
            (HandicapWithDiagnosis handicap) ->
                !handicap.getResult() || !handicap.getIcd10Codes().isEmpty(),
            Stream.of(
                DevelopmentScreening::getChronicDisease, DevelopmentScreening::getDisability)));

    result.compute(
        RequiredProcedureData.DEVELOPMENT_SCREENING,
        validateSpecialCases(
            procedure.getDevelopmentScreeningResult(),
            (DisabilityType type) ->
                !procedure.getDevelopmentScreeningResult().getDisability().getResult()
                    || type != null,
            Stream.of(DevelopmentScreening::getDisabilityType)));

    return result;
  }

  private static <T extends ValidatableEntity> boolean validate(T validatableEntity) {
    return validatableEntity
        .getPropertiesToValidate()
        .filter(requiredProperties::contains)
        .map(prop -> PropertyUtils.read(validatableEntity, prop))
        .noneMatch(Objects::isNull);
  }

  @SuppressWarnings("unchecked")
  private static <T, U> BiFunction<RequiredProcedureData, Boolean, Boolean> validateSpecialCases(
      T toValidate, Predicate<U> validationFn, Stream<TypedPropertyGetter<T, U>> getters) {
    return (key, currentValue) -> {
      // if already invalid, abort
      if (Boolean.FALSE.equals(currentValue)) {
        return false;
      }
      // read values and validate with validationFn
      return getters
          .map(
              getter ->
                  PropertyUtils.read(
                      toValidate, PropertyUtils.getPropertyDescriptor(toValidate, getter)))
          .map(value -> (U) value)
          .allMatch(validationFn);
    };
  }

  private static boolean validateExaminationResult(@NotNull ExaminationResult result) {
    return !result.getValue().equals(ExaminationResultValue.DOCTOR_LETTER)
        || result.getDoctorLetter() != null;
  }

  private static <T> Predicate<T> mandatoryIfPrimaryLanguageIsNotGerman(
      SopessExaminationResult sopessExaminationResult) {
    return (T value) ->
        sopessExaminationResult.getPrimaryLanguage().equals(PrimaryLanguageValue.GERMAN)
            || value != null;
  }

  static final List<PropertyDescriptor> requiredProperties =
      List.of(
          hearingTestProperty(HearingTestResult::getExaminationResult),
          eyeExaminationProperty(EyeExaminationResult::getEyeExamination),
          eyeExaminationProperty(EyeExaminationResult::getIshiharaExamination),
          eyeExaminationProperty(EyeExaminationResult::getLangExamination),
          anamnesisProperty(Anamnesis::getBirthWeight),
          anamnesisProperty(Anamnesis::getChildLanguageScreening),
          anamnesisProperty(Anamnesis::getCountryOfBirthChild),
          anamnesisProperty(Anamnesis::getCountryOfBirthFirstParent),
          anamnesisProperty(Anamnesis::getCountryOfBirthSecondParent),
          anamnesisProperty(Anamnesis::getEarlySupport),
          anamnesisProperty(Anamnesis::getErgotherapy),
          anamnesisProperty(Anamnesis::getInGermanySince),
          anamnesisProperty(Anamnesis::getIntegrationPlace),
          anamnesisProperty(Anamnesis::getNationalityChild),
          anamnesisProperty(Anamnesis::getNationalityFirstParent),
          anamnesisProperty(Anamnesis::getNationalitySecondParent),
          anamnesisProperty(Anamnesis::getNumberOfSiblings),
          anamnesisProperty(Anamnesis::getPhysiotherapy),
          anamnesisProperty(Anamnesis::getPreliminaryCourse),
          anamnesisProperty(Anamnesis::getSpeechTherapy),
          anamnesisProperty(Anamnesis::getU2),
          anamnesisProperty(Anamnesis::getU3),
          anamnesisProperty(Anamnesis::getU4),
          anamnesisProperty(Anamnesis::getU5),
          anamnesisProperty(Anamnesis::getU6),
          anamnesisProperty(Anamnesis::getU7),
          anamnesisProperty(Anamnesis::getU7a),
          anamnesisProperty(Anamnesis::getU8),
          anamnesisProperty(Anamnesis::getU9),
          vaccinationStatusProperty(VaccinationStatus::getDiphtheria),
          vaccinationStatusProperty(VaccinationStatus::getHepatitisA),
          vaccinationStatusProperty(VaccinationStatus::getHepatitisB),
          vaccinationStatusProperty(VaccinationStatus::getHib),
          vaccinationStatusProperty(VaccinationStatus::getMeningococcusB),
          vaccinationStatusProperty(VaccinationStatus::getMeningococcusC),
          vaccinationStatusProperty(VaccinationStatus::getMmr),
          vaccinationStatusProperty(VaccinationStatus::getPerkombiHbv),
          vaccinationStatusProperty(VaccinationStatus::getPertussis),
          vaccinationStatusProperty(VaccinationStatus::getPneumococcus),
          vaccinationStatusProperty(VaccinationStatus::getPolio),
          vaccinationStatusProperty(VaccinationStatus::getRota),
          vaccinationStatusProperty(VaccinationStatus::getTbe),
          vaccinationStatusProperty(VaccinationStatus::getTetanus),
          vaccinationStatusProperty(VaccinationStatus::getVaccinationScheme),
          vaccinationStatusProperty(VaccinationStatus::getVaricella),
          sopessExaminationProperty(SopessExaminationResult::getAuditiveProcessingResult),
          sopessExaminationProperty(SopessExaminationResult::getCountingPoints),
          sopessExaminationProperty(SopessExaminationResult::getFineMotorSkills),
          sopessExaminationProperty(SopessExaminationResult::getFormationChPoints),
          sopessExaminationProperty(SopessExaminationResult::getFormationSchPoints),
          sopessExaminationProperty(SopessExaminationResult::getFormationsTrDrKrGrPoints),
          sopessExaminationProperty(SopessExaminationResult::getGrossMotorSkills),
          sopessExaminationProperty(SopessExaminationResult::getJumpCount),
          sopessExaminationProperty(SopessExaminationResult::getKnowledgeThinkingResult),
          sopessExaminationProperty(SopessExaminationResult::getLetterBPoints),
          sopessExaminationProperty(SopessExaminationResult::getLetterFAndFormationPfPoints),
          sopessExaminationProperty(SopessExaminationResult::getLetterRPoints),
          sopessExaminationProperty(SopessExaminationResult::getLettersGAndKPoints),
          sopessExaminationProperty(SopessExaminationResult::getLettersLAndNPoints),
          sopessExaminationProperty(SopessExaminationResult::getLettersSAndZPoints),
          sopessExaminationProperty(SopessExaminationResult::getLettersLAndNPoints),
          sopessExaminationProperty(SopessExaminationResult::getLettersTAndDPoints),
          sopessExaminationProperty(SopessExaminationResult::getPluralPoints),
          sopessExaminationProperty(SopessExaminationResult::getPrepositionPoints),
          sopessExaminationProperty(SopessExaminationResult::getPrimaryLanguage),
          sopessExaminationProperty(SopessExaminationResult::getPseudowordPoints),
          sopessExaminationProperty(SopessExaminationResult::getPsychologicalBehaviorResult),
          sopessExaminationProperty(SopessExaminationResult::getQuantityKnowledgePoints),
          sopessExaminationProperty(SopessExaminationResult::getSelectiveAttentionPoints),
          sopessExaminationProperty(SopessExaminationResult::getSpeechResult),
          sopessExaminationProperty(SopessExaminationResult::getVisualPerceptionPoints),
          sopessExaminationProperty(SopessExaminationResult::getVisualPerceptionResult),
          sopessExaminationProperty(SopessExaminationResult::getVisuoMotor),
          developmentScreeningProperty(DevelopmentScreening::getAbdomen),
          developmentScreeningProperty(DevelopmentScreening::getChronicDisease),
          developmentScreeningProperty(DevelopmentScreening::getDiastole),
          developmentScreeningProperty(DevelopmentScreening::getDisability),
          developmentScreeningProperty(DevelopmentScreening::getEarNoseThroat),
          developmentScreeningProperty(DevelopmentScreening::getEducationalAdvice),
          developmentScreeningProperty(DevelopmentScreening::getExtraEffort),
          developmentScreeningProperty(DevelopmentScreening::getHeight),
          developmentScreeningProperty(DevelopmentScreening::getInfoLetter),
          developmentScreeningProperty(DevelopmentScreening::getLanguageAdvice),
          developmentScreeningProperty(DevelopmentScreening::getMetabolism),
          developmentScreeningProperty(DevelopmentScreening::getMotorPromotion),
          developmentScreeningProperty(DevelopmentScreening::getMusculatureSkeleton),
          developmentScreeningProperty(DevelopmentScreening::getNeurology),
          developmentScreeningProperty(DevelopmentScreening::getNutritionalAdvice),
          developmentScreeningProperty(DevelopmentScreening::getNutritionalCondition),
          developmentScreeningProperty(DevelopmentScreening::getOtherSupport),
          developmentScreeningProperty(DevelopmentScreening::getReIntroduction),
          developmentScreeningProperty(DevelopmentScreening::getRespiratoryCardiovascular),
          developmentScreeningProperty(DevelopmentScreening::getSchoolCounselling),
          developmentScreeningProperty(DevelopmentScreening::getSchoolRecommendation),
          developmentScreeningProperty(DevelopmentScreening::getSkin),
          developmentScreeningProperty(DevelopmentScreening::getSocialService),
          developmentScreeningProperty(DevelopmentScreening::getSystole),
          developmentScreeningProperty(DevelopmentScreening::getVaccinationAdvice),
          developmentScreeningProperty(DevelopmentScreening::getWeight));

  static final List<PropertyDescriptor> optionalProperties =
      List.of(
          hearingTestProperty(HearingTestResult::getRightEar),
          hearingTestProperty(HearingTestResult::getLeftEar),
          hearingTestProperty(HearingTestResult::getNote),
          anamnesisProperty(Anamnesis::getAdditionalTherapies),
          anamnesisProperty(Anamnesis::getAllergies),
          anamnesisProperty(Anamnesis::getCanSwim),
          anamnesisProperty(Anamnesis::getChronicIllnessOrDisabilityInFamily),
          anamnesisProperty(Anamnesis::getClubSport),
          anamnesisProperty(Anamnesis::getDaycareName),
          anamnesisProperty(Anamnesis::getDevelopmentConspicuities),
          anamnesisProperty(Anamnesis::getErgoTherapyEnd),
          anamnesisProperty(Anamnesis::getErgoTherapyStart),
          anamnesisProperty(Anamnesis::getGestationalAge),
          anamnesisProperty(Anamnesis::getHasMigrationBackground),
          anamnesisProperty(Anamnesis::getHasSeahorseBadge),
          anamnesisProperty(Anamnesis::getHearingAid),
          anamnesisProperty(Anamnesis::getHearingImpairment),
          anamnesisProperty(Anamnesis::getHospitalizationsOrOperations),
          anamnesisProperty(Anamnesis::getInDaycareSince),
          anamnesisProperty(Anamnesis::getInfancyConspicuities),
          anamnesisProperty(Anamnesis::getOtherInterests),
          anamnesisProperty(Anamnesis::getPersonalConspicuities),
          anamnesisProperty(Anamnesis::getPhysioTherapyEnd),
          anamnesisProperty(Anamnesis::getPhysioTherapyStart),
          anamnesisProperty(Anamnesis::getRegularMedication),
          anamnesisProperty(Anamnesis::getResponsiblePhysician),
          anamnesisProperty(Anamnesis::getSchoolName),
          anamnesisProperty(Anamnesis::getSevereIllnesses),
          anamnesisProperty(Anamnesis::getSiblingsBirthYears),
          anamnesisProperty(Anamnesis::getSpectaclesInFamily),
          anamnesisProperty(Anamnesis::getSpectaclesSince),
          anamnesisProperty(Anamnesis::getSpeechImpairment),
          anamnesisProperty(Anamnesis::getSpeechTherapyEnd),
          anamnesisProperty(Anamnesis::getSpeechTherapyStart),
          anamnesisProperty(Anamnesis::getUnderMedicalTreatmentFor),
          anamnesisProperty(Anamnesis::getVisionImpairment),
          anamnesisProperty(Anamnesis::getVisionSchoolSince),
          anamnesisProperty(Anamnesis::getWasInDaycare),
          eyeExaminationProperty(EyeExaminationResult::getAmblyopia),
          eyeExaminationProperty(EyeExaminationResult::getAstigmatism),
          eyeExaminationProperty(EyeExaminationResult::getColorVisionDisorder),
          eyeExaminationProperty(EyeExaminationResult::getHyperopia),
          eyeExaminationProperty(EyeExaminationResult::getLeftEye),
          eyeExaminationProperty(EyeExaminationResult::getMyopia),
          eyeExaminationProperty(EyeExaminationResult::getNote),
          eyeExaminationProperty(EyeExaminationResult::getOtherDiagnosis),
          eyeExaminationProperty(EyeExaminationResult::getRightEye),
          eyeExaminationProperty(EyeExaminationResult::getStrabismus),
          vaccinationStatusProperty(VaccinationStatus::getOtherVaccinations),
          vaccinationStatusProperty(VaccinationStatus::getVaccinationPassPresented),
          vaccinationStatusProperty(VaccinationStatus::getMeaslesContraIndication),
          vaccinationStatusProperty(VaccinationStatus::getMeaslesContraIndicationIsPermanent),
          vaccinationStatusProperty(VaccinationStatus::getMeaslesContraIndicationUntil),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterAuditiveProcessing),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterFineMotorSkills),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterGrossMotorSkills),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterKnowledgeThinking),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterPsychologicalBehavior),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterSpeech),
          sopessExaminationProperty(SopessExaminationResult::getDoctorLetterVisualPerception),
          sopessExaminationProperty(SopessExaminationResult::getFamilyLanguage),
          sopessExaminationProperty(SopessExaminationResult::getGermanKnowledgeChild),
          sopessExaminationProperty(SopessExaminationResult::getGermanKnowledgePrimaryCarer),
          sopessExaminationProperty(SopessExaminationResult::getHandednessValue),
          sopessExaminationProperty(SopessExaminationResult::getNote),
          developmentScreeningProperty(DevelopmentScreening::getBmi),
          developmentScreeningProperty(DevelopmentScreening::getBmiPercentile),
          developmentScreeningProperty(DevelopmentScreening::getDisabilityType),
          developmentScreeningProperty(DevelopmentScreening::getFamily),
          developmentScreeningProperty(DevelopmentScreening::getHandicapNote),
          developmentScreeningProperty(DevelopmentScreening::getHeightPercentile),
          developmentScreeningProperty(DevelopmentScreening::getMigration),
          developmentScreeningProperty(DevelopmentScreening::getNonCompliance),
          developmentScreeningProperty(DevelopmentScreening::getOtherRisk),
          developmentScreeningProperty(DevelopmentScreening::getPhysicalExaminationNote),
          developmentScreeningProperty(DevelopmentScreening::getSchoolFeedback),
          developmentScreeningProperty(DevelopmentScreening::getSocial),
          developmentScreeningProperty(DevelopmentScreening::getWeightPercentile));

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
