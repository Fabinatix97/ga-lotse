/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.statistics.options.Disability;
import de.eshg.schoolentry.statistics.options.DoctorLetterValue;
import de.eshg.schoolentry.statistics.options.ExaminationResultFourOptions;
import de.eshg.schoolentry.statistics.options.PhysicalExaminationResult;
import de.eshg.schoolentry.statistics.options.SchoolRecommendation;
import java.util.Optional;
import java.util.function.Function;

public class DevelopmentScreeningStatistics {
  private DevelopmentScreeningStatistics() {}

  static Object getDevelopmentScreeningAttribute(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, Object> developmentScreeningGetter) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return developmentScreeningGetter.apply(developmentScreeningResult);
  }

  static Object getDevelopmentScreeningAttributeOrUnknownInteger(
      SchoolEntryProcedure procedure,
      Function<DevelopmentScreening, Object> developmentScreeningGetter) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return Optional.ofNullable(developmentScreeningGetter.apply(developmentScreeningResult))
        .orElse(EsuAttributeUtil.UNKNOWN_INTEGER_999);
  }

  static Object getWeight(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return Optional.ofNullable(developmentScreeningResult.getWeight())
        .orElse(EsuAttributeUtil.UNKNOWN_DECIMAL_99_9);
  }

  static Object getDisabilityType(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return Disability.convertDisabilityTypeToValue(developmentScreeningResult.getDisabilityType());
  }

  static Object getSchoolRecommendation(SchoolEntryProcedure procedure) {
    DevelopmentScreening developmentScreeningResult = procedure.getDevelopmentScreeningResult();
    if (developmentScreeningResult == null) {
      return null;
    }
    return SchoolRecommendation.convertSchoolRecommendationToValue(
        developmentScreeningResult.getSchoolRecommendation());
  }

  static String getExaminationWithDiagnosisResultFourOptionValue(
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

  static String getExaminationWithDiagnosisResponseDoctorLetterValue(
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

  static Object getAllPsychoSozialRisk(DevelopmentScreening developmentScreening) {
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

  static Object getAllSocioEducationalPerformance(DevelopmentScreening developmentScreening) {
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

  static Object getAllPhysicalExamination(DevelopmentScreening developmentScreening) {
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
      return PhysicalExaminationResult.WITHOUT_FINDINGS;
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

  static Object getAllHandicap(SchoolEntryProcedure procedure) {
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

  static Object getHandicapWithDiagnosisValue(
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

  static String getHandicapIcd10Codes(
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
}
