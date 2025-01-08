/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics;

import de.eshg.schoolentry.domain.model.*;
import de.eshg.schoolentry.statistics.options.EvaluationResult;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;
import org.springframework.data.domain.Range;

public class StatisticsValueMappers {

  private StatisticsValueMappers() {}

  public static Function<Integer, EvaluationResult> jumpCountAssessment() {
    return getEvaluationResult(Range.closed(0, 6), Range.closed(7, 8), Range.closed(9, 30));
  }

  public static Function<Integer, EvaluationResult> visuoMotorAssessment() {
    return getEvaluationResult(Range.closed(0, 4), Range.closed(5, 6), Range.closed(7, 12));
  }

  public static Function<Integer, EvaluationResult> visualPerceptionAssessment() {
    return getEvaluationResult(Range.closed(0, 8), Range.closed(9, 10), Range.closed(11, 15));
  }

  public static Function<Integer, EvaluationResult> prepositionsAssessment() {
    return getEvaluationResult(Range.closed(0, 4), Range.closed(5, 5), Range.closed(6, 7));
  }

  public static Function<Integer, EvaluationResult> pluralsAssessment() {
    return getEvaluationResult(Range.closed(0, 3), Range.closed(4, 5), Range.closed(6, 7));
  }

  public static Function<Integer, EvaluationResult> countingAssessment() {
    return getEvaluationResult(Range.closed(0, 12), Range.closed(13, 16), Range.closed(17, 20));
  }

  public static Function<Integer, EvaluationResult> quantityKnowledgeAssessment() {
    return getEvaluationResult(Range.closed(0, 10), Range.closed(11, 13), Range.closed(14, 16));
  }

  public static Function<SopessExaminationResultValue, String>
      sopessExaminationResultToStatisticsLetter() {
    return sopessExaminationResultValue ->
        switch (sopessExaminationResultValue) {
          case null -> null;
          case OK -> "I";
          case KNOWN -> "B";
          case DOCTOR_LETTER -> "A";
          case BORDERLINE -> "G";
          case UNKNOWN -> "U";
        };
  }

  public static Function<Integer, EvaluationResult> pseudoWordAssessment() {
    return getEvaluationResult(Range.closed(0, 3), Range.closed(4, 4), Range.closed(5, 6));
  }

  public static Function<Integer, EvaluationResult> selectiveAttentionAssessment() {
    return getEvaluationResult(Range.closed(0, 10), Range.closed(11, 13), Range.closed(14, 29));
  }

  public static Function<PrimaryLanguageValue, String> primaryLanguageToStatisticsLetter() {
    return primaryLanguageValue ->
        switch (primaryLanguageValue) {
          case null -> null;
          case GERMAN -> "1";
          case OTHER -> "2";
          case UNKNOWN -> "9";
        };
  }

  public static Function<HandednessValue, String> handedness() {
    return handednessValue ->
        switch (handednessValue) {
          case null -> null;
          case RIGHT -> "R";
          case LEFT -> "L";
          case UNCERTAIN -> "X";
          case UNKNOWN -> "U";
        };
  }

  public static Function<ArticulationValue, String> articulationValueToStatisticsLetter() {
    return articulationValue ->
        switch (articulationValue) {
          case null -> null;
          case INCONSPICUOUS -> "0";
          case CONSPICUOUS -> "1";
          case UNKNOWN -> "9";
        };
  }

  public static Function<Stream<ArticulationValue>, Optional<Integer>> articulationPointSum() {
    return articulationValues ->
        articulationValues
            .filter(Objects::nonNull)
            .filter(value -> !value.equals(ArticulationValue.UNKNOWN))
            .map(ArticulationValue::getWeight)
            .reduce(Integer::sum);
  }

  public static Function<Optional<Integer>, String> articulationPointSumAssessment() {
    return articulationSumOptional ->
        articulationSumOptional
            .map(
                sum -> {
                  if (sum == 0) {
                    return "U";
                  } else if (sum > 0) {
                    return "A";
                  } else {
                    return null;
                  }
                })
            .orElse(null);
  }

  private static Function<Integer, EvaluationResult> getEvaluationResult(
      Range<Integer> conspicuousRange,
      Range<Integer> borderlineRange,
      Range<Integer> inconspicuousRange) {
    return value -> {
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
    };
  }
}
