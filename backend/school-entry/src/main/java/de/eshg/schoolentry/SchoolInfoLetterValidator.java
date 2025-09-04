/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.cronn.reflection.util.PropertyUtils;
import de.cronn.reflection.util.TypedPropertyGetter;
import de.eshg.domain.model.GenericEntity;
import de.eshg.schoolentry.api.RequiredProcedureArea;
import de.eshg.schoolentry.domain.model.*;
import java.beans.PropertyDescriptor;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class SchoolInfoLetterValidator {

  private SchoolInfoLetterValidator() {}

  public static Set<RequiredProcedureArea> validateSchoolEntryProcedure(
      SchoolEntryProcedure procedure) {
    Set<RequiredProcedureArea> incompleteAreas = EnumSet.noneOf(RequiredProcedureArea.class);

    if (isDetailsIncomplete(procedure)) {
      incompleteAreas.add(RequiredProcedureArea.DETAILS);
    }

    if (isHearingTestIncomplete(procedure)) {
      incompleteAreas.add(RequiredProcedureArea.HEARING_TEST);
    }

    if (isEyeExaminationIncomplete(procedure)) {
      incompleteAreas.add(RequiredProcedureArea.EYE_EXAMINATION);
    }

    if (isIncomplete(procedure.getAnamnesis())) {
      incompleteAreas.add(RequiredProcedureArea.ANAMNESIS);
    }

    if (isSopessExaminationIncomplete(procedure.getSopessExaminationResult())) {
      incompleteAreas.add(RequiredProcedureArea.SOPESS_EXAMINATION);
    }

    if (isDevelopmentScreeningResultIncomplete(procedure)) {
      incompleteAreas.add(RequiredProcedureArea.DEVELOPMENT_SCREENING);
    }

    if (isIncomplete(procedure.getVaccinationStatus())) {
      incompleteAreas.add(RequiredProcedureArea.VACCINATION_STATUS);
    }

    return incompleteAreas;
  }

  private static boolean isDevelopmentScreeningResultIncomplete(SchoolEntryProcedure procedure) {
    return isIncomplete(procedure.getDevelopmentScreeningResult())
        || isHandicapResultIncomplete(procedure)
        || isDisabilityResultIncomplete(procedure);
  }

  private static boolean isDisabilityResultIncomplete(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    DisabilityType disabilityType = developmentScreeningResult.getDisabilityType();
    return developmentScreeningResult.getDisability().getResult() && disabilityType == null;
  }

  private static boolean isHandicapResultIncomplete(SchoolEntryProcedure procedure) {
    return isIncomplete(
        procedure.getDevelopmentScreeningResult(),
        SchoolInfoLetterValidator::isHandicapIncomplete,
        Stream.of(DevelopmentScreening::getChronicDisease, DevelopmentScreening::getDisability));
  }

  private static boolean isHandicapIncomplete(HandicapWithDiagnosis handicap) {
    if (handicap.getResult() == null) {
      return true;
    }
    return handicap.getResult() && handicap.getIcd10Codes().isEmpty();
  }

  private static boolean isSopessExaminationIncomplete(
      SopessExaminationResult sopessExaminationResult) {
    return isIncomplete(sopessExaminationResult)
        || isSopessExaminationIncompleteForNonGermanPrimaryLanguage(sopessExaminationResult);
  }

  private static boolean isSopessExaminationIncompleteForNonGermanPrimaryLanguage(
      SopessExaminationResult sopessExaminationResult) {
    if (Objects.equals(sopessExaminationResult.getPrimaryLanguage(), PrimaryLanguageValue.GERMAN)) {
      return false;
    }
    return isIncomplete(
        sopessExaminationResult,
        Objects::isNull,
        Stream.of(
            SopessExaminationResult::getFamilyLanguage,
            SopessExaminationResult::getGermanKnowledgeChild,
            SopessExaminationResult::getGermanKnowledgePrimaryCarer,
            SopessExaminationResult::getInGermanySince));
  }

  private static boolean isEyeExaminationIncomplete(SchoolEntryProcedure procedure) {
    return isIncomplete(procedure.getEyeExaminationResult())
        || isIncomplete(
            procedure.getEyeExaminationResult(),
            SchoolInfoLetterValidator::isExaminationResultIncomplete,
            Stream.of(
                EyeExaminationResult::getEyeExamination,
                EyeExaminationResult::getIshiharaExamination,
                EyeExaminationResult::getLangExamination));
  }

  private static boolean isHearingTestIncomplete(SchoolEntryProcedure procedure) {
    return isIncomplete(procedure.getHearingTestResult())
        || isExaminationResultIncomplete(procedure.getHearingTestResult().getExaminationResult());
  }

  public static boolean isDetailsIncomplete(SchoolEntryProcedure procedure) {
    return procedure.getSchoolId() == null
        || procedure.getSchoolYear() == null
        || procedure.getAppointment() == null && procedure.getExaminationDate() == null;
  }

  private static boolean isIncomplete(ValidatableEntity validatableEntity) {
    return validatableEntity
        .getPropertiesToValidate()
        .filter(REQUIRED_PROPERTIES::contains)
        .map(prop -> PropertyUtils.read(validatableEntity, prop))
        .anyMatch(Objects::isNull);
  }

  private static <T extends GenericEntity<?>, V> boolean isIncomplete(
      T toValidate, Predicate<V> isIncomplete, Stream<TypedPropertyGetter<T, V>> getters) {
    return getters.map(getter -> getter.get(toValidate)).anyMatch(isIncomplete);
  }

  private static boolean isExaminationResultIncomplete(ExaminationResult result) {
    return result.getValue().equals(ExaminationResultValue.DOCTOR_LETTER)
        && result.getDoctorLetter() == null;
  }

  static final List<PropertyDescriptor> REQUIRED_PROPERTIES =
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

  static final List<PropertyDescriptor> OPTIONAL_PROPERTIES =
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
          anamnesisProperty(Anamnesis::getNote),
          anamnesisProperty(Anamnesis::getLanguageScreeningConsent),
          anamnesisProperty(Anamnesis::getDailyTeethBrushing),
          anamnesisProperty(Anamnesis::getTeethBrushingAfterCare),
          anamnesisProperty(Anamnesis::getElectricToothBrush),
          anamnesisProperty(Anamnesis::getFluorideToothPaste),
          anamnesisProperty(Anamnesis::getMediaConsumption),
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
          sopessExaminationProperty(SopessExaminationResult::getInGermanySince),
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
          developmentScreeningProperty(DevelopmentScreening::getWeightPercentile),
          vaccinationStatusProperty(VaccinationStatus::getNote));

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
