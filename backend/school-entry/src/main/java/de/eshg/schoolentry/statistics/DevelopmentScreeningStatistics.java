/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.statistics.attributes.EsuAttributeUtil;
import de.eshg.schoolentry.statistics.attributes.EsuDevelopmentScreeningAttribute;
import de.eshg.schoolentry.statistics.options.Child;
import de.eshg.schoolentry.statistics.options.Disability;
import de.eshg.schoolentry.statistics.options.DoctorLetterValue;
import de.eshg.schoolentry.statistics.options.ExaminationResultFourOptions;
import de.eshg.schoolentry.statistics.options.PhysicalExaminationResult;
import de.eshg.schoolentry.statistics.options.SchoolRecommendation;
import java.util.Optional;
import java.util.function.Function;

class DevelopmentScreeningStatistics {
  private DevelopmentScreeningStatistics() {}

  static Object mapAttribute(
      SchoolEntryProcedure procedure, EsuDevelopmentScreeningAttribute attribute) {
    return switch (attribute) {
      case KIND -> getProcedureType(procedure);
      case GROE ->
          getDevelopmentScreeningAttributeOrUnknownInteger(
              procedure, DevelopmentScreening::getHeight);
      case GROE_PERZ ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getHeightPercentile);
      case GEWI -> getWeight(procedure);
      case GEWI_PERZ ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getWeightPercentile);
      case BMI -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getBmi);
      case BMI_PERZ ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getBmiPercentile);
      case RRSYS ->
          getDevelopmentScreeningAttributeOrUnknownInteger(
              procedure, DevelopmentScreening::getSystole);
      case RRDIA ->
          getDevelopmentScreeningAttributeOrUnknownInteger(
              procedure, DevelopmentScreening::getDiastole);
      case KOERPERCHECK -> getAllPhysicalExamination(procedure.getDevelopmentScreeningResult());
      case EZ ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getNutritionalCondition);
      case RM_ERNAEHRUNGSZUSTAND ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getNutritionalCondition);
      case NEU ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getNeurology);
      case RM_NEUROLOGIE ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getNeurology);
      case AHK ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getRespiratoryCardiovascular);
      case RM_ATMUNG_HERZ_KREISLAUF ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getRespiratoryCardiovascular);
      case DERM ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getSkin);
      case RM_HAUT ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getSkin);
      case MUSK ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getMusculatureSkeleton);
      case RM_MUSKULATUR_SKELETT ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getMusculatureSkeleton);
      case ENDO ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getMetabolism);
      case RM_ENDO_STOFFW ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getMetabolism);
      case ABD ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getAbdomen);
      case RM_ABDOMEN ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getAbdomen);
      case HNO ->
          getExaminationWithDiagnosisResultFourOptionValue(
              procedure, DevelopmentScreening::getEarNoseThroat);
      case RM_HNO ->
          getExaminationWithDiagnosisResponseDoctorLetterValue(
              procedure, DevelopmentScreening::getEarNoseThroat);
      case HANDCAP -> getAllHandicap(procedure);
      case CHKR ->
          getHandicapWithDiagnosisValue(procedure, DevelopmentScreening::getChronicDisease);
      case DIAGCH1 -> getHandicapIcd10Codes(0, procedure, DevelopmentScreening::getChronicDisease);
      case DIAGCH2 -> getHandicapIcd10Codes(1, procedure, DevelopmentScreening::getChronicDisease);
      case DIAGCH3 -> getHandicapIcd10Codes(2, procedure, DevelopmentScreening::getChronicDisease);
      case BEHI -> getHandicapWithDiagnosisValue(procedure, DevelopmentScreening::getDisability);
      case BEHIART -> getDisabilityType(procedure);
      case DIAGB1 -> getHandicapIcd10Codes(0, procedure, DevelopmentScreening::getDisability);
      case DIAGB2 -> getHandicapIcd10Codes(1, procedure, DevelopmentScreening::getDisability);
      case DIAGB3 -> getHandicapIcd10Codes(2, procedure, DevelopmentScreening::getDisability);
      case PSYSOZRISK -> getAllPsychoSozialRisk(procedure.getDevelopmentScreeningResult());
      case FAMILIE -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getFamily);
      case NONCOMP ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getNonCompliance);
      case SOZIAL -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getSocial);
      case MIGRATION ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getMigration);
      case SONSTIGES_RISIKO ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getOtherRisk);
      case MASSN -> getAllSocioEducationalPerformance(procedure.getDevelopmentScreeningResult());
      case WSPR ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getReIntroduction);
      case SCHB ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getSchoolCounselling);
      case MOTO ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getMotorPromotion);
      case ERZB ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getEducationalAdvice);
      case SPRF ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getLanguageAdvice);
      case ERNB ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getNutritionalAdvice);
      case IMPF ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getVaccinationAdvice);
      case SOZD ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getSocialService);
      case SOHI ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getOtherSupport);
      case INFO -> getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getInfoLetter);
      case SCHULEMPF -> getSchoolRecommendation(procedure);
      case MEHR ->
          getDevelopmentScreeningAttribute(procedure, DevelopmentScreening::getExtraEffort);
    };
  }

  private static Object getDevelopmentScreeningAttribute(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, Object> developmentScreeningGetter) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return developmentScreeningGetter.apply(developmentScreeningResult);
  }

  private static Object getDevelopmentScreeningAttributeOrUnknownInteger(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, Object> developmentScreeningGetter) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return Optional.ofNullable(developmentScreeningGetter.apply(developmentScreeningResult))
        .orElse(EsuAttributeUtil.UNKNOWN_INTEGER_999);
  }

  private static Object getWeight(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return Optional.ofNullable(developmentScreeningResult.getWeight())
        .orElse(EsuAttributeUtil.UNKNOWN_DECIMAL_99_9);
  }

  private static Object getDisabilityType(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return Disability.convertDisabilityTypeToValue(developmentScreeningResult.getDisabilityType());
  }

  private static Object getSchoolRecommendation(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return SchoolRecommendation.convertSchoolRecommendationToValue(
        developmentScreeningResult.getSchoolRecommendation());
  }

  private static String getExaminationWithDiagnosisResultFourOptionValue(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, ExaminationWithDiagnosis> getExaminationResult) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null
        || getExaminationResult.apply(developmentScreeningResult) == null
        || getExaminationResult.apply(developmentScreeningResult).getResult() == null) {
      return null;
    } else {
      ExaminationResultValue examinationResultValue =
          getExaminationResult.apply(developmentScreeningResult).getResult().getValue();
      return ExaminationResultFourOptions.convertExaminationResultToValue(examinationResultValue);
    }
  }

  private static String getExaminationWithDiagnosisResponseDoctorLetterValue(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, ExaminationWithDiagnosis> getExaminationResult) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null
        || getExaminationResult.apply(developmentScreeningResult) == null
        || getExaminationResult.apply(developmentScreeningResult).getResult() == null) {
      return null;
    } else {

      de.eshg.schoolentry.domain.model.DoctorLetterValue doctorLetterValue =
          getExaminationResult.apply(developmentScreeningResult).getResult().getDoctorLetter();
      return DoctorLetterValue.convertDoctorLetterValueToValue(doctorLetterValue);
    }
  }

  private static Object getAllPsychoSozialRisk(DevelopmentScreening developmentScreening) {
    if (developmentScreening == null
        || developmentScreening.getFamily() == null
        || developmentScreening.getNonCompliance() == null
        || developmentScreening.getSocial() == null
        || developmentScreening.getMigration() == null
        || developmentScreening.getOtherRisk() == null) {
      return null;
    }
    return developmentScreening.getFamily()
        && developmentScreening.getNonCompliance()
        && developmentScreening.getSocial()
        && developmentScreening.getMigration()
        && developmentScreening.getOtherRisk();
  }

  private static Object getAllSocioEducationalPerformance(
      DevelopmentScreening developmentScreening) {
    if (developmentScreening == null
        || developmentScreening.getReIntroduction() == null
        || developmentScreening.getSchoolCounselling() == null
        || developmentScreening.getMotorPromotion() == null
        || developmentScreening.getEducationalAdvice() == null
        || developmentScreening.getLanguageAdvice() == null
        || developmentScreening.getNutritionalAdvice() == null
        || developmentScreening.getVaccinationAdvice() == null
        || developmentScreening.getSocialService() == null
        || developmentScreening.getOtherSupport() == null
        || developmentScreening.getInfoLetter() == null) {
      return null;
    }
    return developmentScreening.getReIntroduction()
        || developmentScreening.getSchoolCounselling()
        || developmentScreening.getMotorPromotion()
        || developmentScreening.getEducationalAdvice()
        || developmentScreening.getLanguageAdvice()
        || developmentScreening.getNutritionalAdvice()
        || developmentScreening.getVaccinationAdvice()
        || developmentScreening.getSocialService()
        || developmentScreening.getOtherSupport()
        || developmentScreening.getInfoLetter();
  }

  private static Object getAllPhysicalExamination(DevelopmentScreening developmentScreening) {
    if (developmentScreening == null
        || valueIsNull(developmentScreening.getNutritionalCondition())
        || valueIsNull(developmentScreening.getNeurology())
        || valueIsNull(developmentScreening.getRespiratoryCardiovascular())
        || valueIsNull(developmentScreening.getSkin())
        || valueIsNull(developmentScreening.getMusculatureSkeleton())
        || valueIsNull(developmentScreening.getMetabolism())
        || valueIsNull(developmentScreening.getAbdomen())
        || valueIsNull(developmentScreening.getEarNoseThroat())) {
      return null;
    }
    if (isDoctorLetterOrKnownResult(developmentScreening.getNutritionalCondition())
        || isDoctorLetterOrKnownResult(developmentScreening.getNeurology())
        || isDoctorLetterOrKnownResult(developmentScreening.getRespiratoryCardiovascular())
        || isDoctorLetterOrKnownResult(developmentScreening.getSkin())
        || isDoctorLetterOrKnownResult(developmentScreening.getMusculatureSkeleton())
        || isDoctorLetterOrKnownResult(developmentScreening.getMetabolism())
        || isDoctorLetterOrKnownResult(developmentScreening.getAbdomen())
        || isDoctorLetterOrKnownResult(developmentScreening.getEarNoseThroat())) {
      return PhysicalExaminationResult.WITH_FINDINGS.getValue();
    }
    if (isOk(developmentScreening.getNutritionalCondition())
        && isOk(developmentScreening.getNeurology())
        && isOk(developmentScreening.getRespiratoryCardiovascular())
        && isOk(developmentScreening.getSkin())
        && isOk(developmentScreening.getMusculatureSkeleton())
        && isOk(developmentScreening.getMetabolism())
        && isOk(developmentScreening.getAbdomen())
        && isOk(developmentScreening.getEarNoseThroat())) {
      return PhysicalExaminationResult.WITHOUT_FINDINGS.getValue();
    } else return PhysicalExaminationResult.UNKNOWN.getValue();
  }

  private static boolean valueIsNull(ExaminationWithDiagnosis resultValue) {
    return resultValue == null
        || resultValue.getResult() == null
        || resultValue.getResult().getValue() == null;
  }

  private static boolean isDoctorLetterOrKnownResult(ExaminationWithDiagnosis result) {
    return result.getResult().getValue() == ExaminationResultValue.DOCTOR_LETTER
        || result.getResult().getValue() == ExaminationResultValue.KNOWN;
  }

  private static boolean isOk(ExaminationWithDiagnosis result) {
    return result.getResult().getValue() == ExaminationResultValue.OK;
  }

  private static Object getAllHandicap(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null
        || valueIsNull(developmentScreeningResult.getDisability())
        || valueIsNull(developmentScreeningResult.getChronicDisease())) {
      return null;
    } else {
      return developmentScreeningResult.getDisability().getResult()
          && developmentScreeningResult.getChronicDisease().getResult();
    }
  }

  private static boolean valueIsNull(HandicapWithDiagnosis resultValue) {
    return resultValue == null || resultValue.getResult() == null;
  }

  private static Object getHandicapWithDiagnosisValue(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, HandicapWithDiagnosis> getExaminationResult) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null
        || valueIsNull(getExaminationResult.apply(developmentScreeningResult))) {
      return null;
    } else {
      return getExaminationResult.apply(developmentScreeningResult).getResult();
    }
  }

  private static String getHandicapIcd10Codes(
      int index,
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, HandicapWithDiagnosis> getExaminationResult) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null
        || getExaminationResult.apply(developmentScreeningResult) == null
        || getExaminationResult.apply(developmentScreeningResult).getIcd10Codes().size() <= index) {
      return null;
    } else {
      return getExaminationResult.apply(developmentScreeningResult).getIcd10Codes().get(index);
    }
  }

  private static String getProcedureType(SchoolEntryProcedure procedure) {
    if (procedure == null) {
      return null;
    }

    return Child.convertTypeToValue(procedure.getProcedureType());
  }
}
