/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.schoolentry.domain.model.ExaminationResult;
import de.eshg.schoolentry.domain.model.ExaminationResultValue;
import de.eshg.schoolentry.domain.model.EyeExaminationResult;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.statistics.attributes.EsuVisionHearingAttribute;
import de.eshg.schoolentry.statistics.options.DoctorLetterValue;
import de.eshg.schoolentry.statistics.options.ExaminationResultFourOptions;
import java.util.function.Function;

class VisionHearingStatistics {
  private VisionHearingStatistics() {}

  static Object mapVisionHearingAttribute(
      SchoolEntryProcedure procedure, EsuVisionHearingAttribute attribute) {
    return switch (attribute) {
      case AUDIO ->
          getExaminationResultFourOptionValue(
              procedure.getHearingTestResult(), HearingTestResult::getExaminationResult);
      case KW_RM_AUDIO ->
          getExaminationResponseDoctorLetterValue(
              procedure.getHearingTestResult(), HearingTestResult::getExaminationResult);
      case VISCH ->
          getExaminationResultFourOptionValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getEyeExamination);
      case KW_RM_VISUS ->
          getExaminationResponseDoctorLetterValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getEyeExamination);
      case VISTR ->
          getExaminationResultFourOptionValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getLangExamination);
      case KW_RM_VISTR ->
          getExaminationResponseDoctorLetterValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getLangExamination);
      case FARB ->
          getExaminationResultFourOptionValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getIshiharaExamination);
      case KW_RM_FARB ->
          getExaminationResponseDoctorLetterValue(
              procedure.getEyeExaminationResult(), EyeExaminationResult::getIshiharaExamination);
      case KW_AMBLYOPIE ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getAmblyopia);
      case KW_ASTIGMATISMUS ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getAstigmatism);
      case KW_STOER_FARBS ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getColorVisionDisorder);
      case KW_HYPEROPIE ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getHyperopia);
      case KW_MYOPIE -> getEyeExaminationAttribute(procedure, EyeExaminationResult::getMyopia);
      case KW_STRABISM ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getStrabismus);
      case KW_AND_DIAGN ->
          getEyeExaminationAttribute(procedure, EyeExaminationResult::getOtherDiagnosis);
    };
  }

  private static <T> String getExaminationResultFourOptionValue(
      T testResult, Function<T, ExaminationResult> getExaminationResult) {

    if (testResult == null || getExaminationResult.apply(testResult) == null) {
      return null;
    } else {
      ExaminationResultValue examinationResultValue =
          getExaminationResult.apply(testResult).getValue();
      return ExaminationResultFourOptions.convertExaminationResultToValue(examinationResultValue);
    }
  }

  private static <T> String getExaminationResponseDoctorLetterValue(
      T testResult, Function<T, ExaminationResult> getExaminationResult) {
    if (testResult == null || getExaminationResult.apply(testResult) == null) {
      return null;
    } else {

      de.eshg.schoolentry.domain.model.DoctorLetterValue doctorLetterValue =
          getExaminationResult.apply(testResult).getDoctorLetter();
      return DoctorLetterValue.convertDoctorLetterValueToValue(doctorLetterValue);
    }
  }

  private static <T> T getEyeExaminationAttribute(
      SchoolEntryProcedure procedure, Function<EyeExaminationResult, T> eyeExaminationGetter) {
    EyeExaminationResult eyeExaminationResult = procedure.getEyeExaminationResult();
    if (eyeExaminationResult == null) {
      return null;
    }
    return eyeExaminationGetter.apply(eyeExaminationResult);
  }
}
