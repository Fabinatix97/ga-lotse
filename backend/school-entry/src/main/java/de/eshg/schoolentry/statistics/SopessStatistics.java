/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.schoolentry.domain.model.ArticulationValue;
import de.eshg.schoolentry.domain.model.PrimaryLanguageValue;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.model.SopessExaminationResult;
import de.eshg.schoolentry.domain.model.SopessExaminationResultValue;
import de.eshg.schoolentry.statistics.attributes.EsuSopessAttribute;
import de.eshg.schoolentry.statistics.options.ChildLanguageKnowledge;
import de.eshg.schoolentry.statistics.options.DoctorLetterValue;
import de.eshg.schoolentry.statistics.options.EvaluationResult;
import de.eshg.schoolentry.statistics.options.GuardianLanguageKnowledge;
import de.eshg.schoolentry.statistics.options.Hand;
import de.eshg.schoolentry.statistics.options.Language;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;
import org.jetbrains.annotations.VisibleForTesting;
import org.springframework.data.domain.Range;

public class SopessStatistics {

  private SopessStatistics() {}

  static Object mapAttribute(SchoolEntryProcedure procedure, EsuSopessAttribute attribute) {
    return switch (attribute) {
      case KOORD -> getSopessExaminationAttribute(procedure, SopessExaminationResult::getJumpCount);
      case KOORD1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getJumpCount,
              SopessStatistics::jumpCountAssessment);
      case GROMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getGrossMotorSkills,
              SopessStatistics::sopessExaminationResultToStatisticsLetter);
      case KW_RM_GROMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterGrossMotorSkills,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case VISMOT ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getVisuoMotor);
      case VISMOT1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getVisuoMotor,
              SopessStatistics::visuoMotorAssessment);
      case FEIMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFineMotorSkills,
              SopessStatistics::sopessExaminationResultToStatisticsLetter);
      case KW_RM_FEIMO ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterFineMotorSkills,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case VISPER ->
          getSopessExaminationAttribute(
              procedure, SopessExaminationResult::getVisualPerceptionPoints);
      case VISPER1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getVisualPerceptionPoints,
              SopessStatistics::visualPerceptionAssessment);
      case VISWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getVisualPerceptionResult,
              SopessStatistics::sopessExaminationResultToStatisticsLetter);
      case KW_RM_VISWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterVisualPerception,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case PRAEP ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getPrepositionPoints);
      case PRAEP1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPrepositionPoints,
              SopessStatistics::prepositionsAssessmentAndGetValue);
      case PLUR ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getPluralPoints);
      case PLUR1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPluralPoints,
              SopessStatistics::pluralsAssessmentAndGetValue);
      case SPR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getSpeechResult,
              SopessStatistics::sopessExaminationResultToStatisticsLetter);
      case KW_RM_SPR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterSpeech,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case PSWOE ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getPseudowordPoints);
      case PSWOE1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPseudowordPoints,
              SopessStatistics::pseudoWordAssessment);
      case AUDWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getAuditiveProcessingResult,
              SopessStatistics::sopessExaminationResultToStatisticsLetter);
      case KW_RM_AUSWA ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterAuditiveProcessing,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case ZAEHL ->
          getSopessExaminationAttribute(procedure, SopessExaminationResult::getCountingPoints);
      case ZAEHL1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getCountingPoints,
              SopessStatistics::countingAssessment);
      case MENG ->
          getSopessExaminationAttribute(
              procedure, SopessExaminationResult::getQuantityKnowledgePoints);
      case MENG1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getQuantityKnowledgePoints,
              SopessStatistics::quantityKnowledgeAssessment);
      case WISSDE ->
          getSopessExaminationAttribute(
              procedure,
              SopessStatistics
                  ::sopessExaminationResultToStatisticsLetterFromKnowledgeThinkingResult);
      case KW_RM_WISSDE ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterKnowledgeThinking,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case SELAUFM ->
          getSopessExaminationAttribute(
              procedure, SopessExaminationResult::getSelectiveAttentionPoints);
      case SELAUFM1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getSelectiveAttentionPoints,
              SopessStatistics::selectiveAttentionAssessment);
      case PSYVER ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPsychologicalBehaviorResult,
              SopessStatistics::sopessExaminationResultToStatisticsLetter);
      case KW_RM_PSYVER ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getDoctorLetterKnowledgeThinking,
              DoctorLetterValue::convertDoctorLetterValueToValue);
      case HAND ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getHandednessValue,
              Hand::convertHandednessValueToValue);
      case ESPR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getPrimaryLanguage,
              SopessStatistics::primaryLanguageToStatisticsLetter);
      case SPRBP -> getGermanKnowledgePrimaryCarer(procedure.getSopessExaminationResult());
      case FAMSPR -> getFamilyLanguage(procedure.getSopessExaminationResult());
      case SPRDEU -> getGermanKnowledgeChild(procedure.getSopessExaminationResult());
      case DYS_S_Z ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersSAndZPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_SCH ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFormationSchPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_T_D ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersTAndDPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_CH ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFormationChPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_G_K ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersGAndKPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_L_N ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLettersLAndNPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_R ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLetterRPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_F_PF ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLetterFAndFormationPfPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_B ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getLetterBPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS_TR_DR_KR_GR ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getFormationsTrDrKrGrPoints,
              SopessStatistics::articulationValueToStatisticsLetter);
      case DYS ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getAllArticulationsValues,
              SopessStatistics::articulationPointSumOrNull);
      case DYS1 ->
          getSopessExaminationAttribute(
              procedure,
              SopessExaminationResult::getAllArticulationsValues,
              SopessStatistics::articulationPointSumAndMap);
    };
  }

  private static String articulationPointSumAndMap(Stream<ArticulationValue> values) {
    return articulationPointSum(values)
        .map(SopessStatistics::articulationPointSumAssessment)
        .orElse(null);
  }

  private static String articulationPointSumOrNull(Stream<ArticulationValue> values) {
    return articulationPointSum(values).map(Object::toString).orElse(null);
  }

  private static <T> T getSopessExaminationAttribute(
      SchoolEntryProcedure procedure, Function<SopessExaminationResult, T> sopessGetter) {
    return Optional.ofNullable(procedure.getSopessExaminationResult())
        .flatMap(result -> Optional.ofNullable(sopessGetter.apply(result)))
        .orElse(null);
  }

  private static String getFamilyLanguage(SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }

    String value =
        Language.convertFamilyLanguageToValue(sopessExaminationResult.getFamilyLanguage());

    if (value == null && hasGermanPrimaryLanguage(sopessExaminationResult)) {
      return Language.VALUE_99.getValue();
    } else return value;
  }

  private static String getGermanKnowledgePrimaryCarer(
      SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }

    String value =
        GuardianLanguageKnowledge.convertLanguageKnowledgeToValue(
            sopessExaminationResult.getGermanKnowledgePrimaryCarer());

    if (value == null && hasGermanPrimaryLanguage(sopessExaminationResult)) {
      return GuardianLanguageKnowledge.VALUE_9.getValue();
    } else return value;
  }

  private static boolean hasGermanPrimaryLanguage(SopessExaminationResult sopessExaminationResult) {
    return sopessExaminationResult.getPrimaryLanguage() == PrimaryLanguageValue.GERMAN;
  }

  private static String getGermanKnowledgeChild(SopessExaminationResult sopessExaminationResult) {
    if (sopessExaminationResult == null) {
      return null;
    }

    String value =
        ChildLanguageKnowledge.convertChildLanguageKnowledgeToValue(
            sopessExaminationResult.getGermanKnowledgeChild());

    if (value == null && hasGermanPrimaryLanguage(sopessExaminationResult)) {
      return ChildLanguageKnowledge.VALUE_9.getValue();
    } else return value;
  }

  private static <T, E> E getSopessExaminationAttribute(
      SchoolEntryProcedure procedure,
      Function<SopessExaminationResult, T> sopessGetter,
      Function<T, E> mapFn) {
    return Optional.ofNullable(procedure.getSopessExaminationResult())
        .flatMap(result -> Optional.ofNullable(sopessGetter.apply(result)))
        .map(mapFn)
        .orElse(null);
  }

  @VisibleForTesting
  static String jumpCountAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 6), Range.closed(7, 8), Range.closed(9, 30));
  }

  @VisibleForTesting
  static String visuoMotorAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 4), Range.closed(5, 6), Range.closed(7, 12));
  }

  @VisibleForTesting
  static String visualPerceptionAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 8), Range.closed(9, 10), Range.closed(11, 15));
  }

  private static String prepositionsAssessmentAndGetValue(Integer value) {
    return getValue(prepositionsAssessment(value));
  }

  public static EvaluationResult prepositionsAssessment(Integer value) {
    return evaluateResult(value, Range.closed(0, 4), Range.closed(5, 5), Range.closed(6, 8));
  }

  private static String pluralsAssessmentAndGetValue(Integer value) {
    return getValue(pluralsAssessment(value));
  }

  public static EvaluationResult pluralsAssessment(Integer value) {
    return evaluateResult(value, Range.closed(0, 3), Range.closed(4, 5), Range.closed(6, 7));
  }

  @VisibleForTesting
  static String countingAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 12), Range.closed(13, 16), Range.closed(17, 20));
  }

  @VisibleForTesting
  static String quantityKnowledgeAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 10), Range.closed(11, 13), Range.closed(14, 16));
  }

  private static String sopessExaminationResultToStatisticsLetterFromKnowledgeThinkingResult(
      SopessExaminationResult examinationResult) {
    return SopessStatistics.sopessExaminationResultToStatisticsLetter(
        examinationResult.getKnowledgeThinkingResult());
  }

  @VisibleForTesting
  static String sopessExaminationResultToStatisticsLetter(
      SopessExaminationResultValue sopessExaminationResultValue) {
    return switch (sopessExaminationResultValue) {
      case null -> null;
      case OK -> "I";
      case KNOWN -> "B";
      case DOCTOR_LETTER -> "A";
      case BORDERLINE -> "G";
      case UNKNOWN -> "U";
    };
  }

  @VisibleForTesting
  static String pseudoWordAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 3), Range.closed(4, 4), Range.closed(5, 6));
  }

  @VisibleForTesting
  static String selectiveAttentionAssessment(Integer value) {
    return evaluateResultAndGetValue(
        value, Range.closed(0, 10), Range.closed(11, 13), Range.closed(14, 29));
  }

  private static String primaryLanguageToStatisticsLetter(
      PrimaryLanguageValue primaryLanguageValue) {
    return switch (primaryLanguageValue) {
      case null -> null;
      case GERMAN -> "1";
      case OTHER -> "2";
      case UNKNOWN -> "9";
    };
  }

  private static String evaluateResultAndGetValue(
      Integer value,
      Range<Integer> conspicuousRange,
      Range<Integer> borderlineRange,
      Range<Integer> inconspicuousRange) {
    return getValue(evaluateResult(value, conspicuousRange, borderlineRange, inconspicuousRange));
  }

  private static EvaluationResult evaluateResult(
      Integer value,
      Range<Integer> conspicuousRange,
      Range<Integer> borderlineRange,
      Range<Integer> inconspicuousRange) {
    if (value == null) {
      return null;
    }
    if (conspicuousRange.contains(value)) {
      return EvaluationResult.CONSPICUOUS;
    }
    if (borderlineRange.contains(value)) {
      return EvaluationResult.BORDERLINE;
    }
    if (inconspicuousRange.contains(value)) {
      return EvaluationResult.INCONSPICUOUS;
    }
    return EvaluationResult.UNKNOWN;
  }

  @VisibleForTesting
  static String articulationPointSumAssessment(Integer sum) {
    if (sum == 0) {
      return "U";
    } else if (sum > 0) {
      return "A";
    } else {
      return null;
    }
  }

  public static Optional<Integer> articulationPointSum(
      Stream<ArticulationValue> articulationValues) {
    return articulationValues
        .filter(Objects::nonNull)
        .filter(value -> !value.equals(ArticulationValue.UNKNOWN))
        .map(ArticulationValue::getWeight)
        .reduce(Integer::sum);
  }

  @VisibleForTesting
  static String articulationValueToStatisticsLetter(ArticulationValue articulationValue) {
    return switch (articulationValue) {
      case null -> null;
      case INCONSPICUOUS -> "0";
      case CONSPICUOUS -> "1";
      case UNKNOWN -> "9";
    };
  }

  private static String getValue(EvaluationResult evaluationResult) {
    if (evaluationResult == null) {
      return null;
    }
    return evaluationResult.getValue();
  }
}
