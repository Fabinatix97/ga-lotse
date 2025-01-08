/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.util;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.schoolentry.api.EvaluationArticulationValueDto;
import de.eshg.schoolentry.api.EvaluationExaminationValueDto;

public class ValueEvaluatorUtil {

  private ValueEvaluatorUtil() {}

  interface EvaluationRanges<T> {
    boolean isInvalid(Integer value);

    T evaluate(Integer value);
  }

  public record EvaluationExaminationRanges(
      Range conspicuous, Range borderline, Range inconspicuous, int unknown)
      implements EvaluationRanges<EvaluationExaminationValueDto> {

    public boolean isInvalid(Integer value) {
      return !(value == null
          || value == unknown
          || conspicuous.includes(value)
          || borderline.includes(value)
          || inconspicuous.includes(value));
    }

    public EvaluationExaminationValueDto evaluate(Integer value) {
      if (value == null) {
        return null;
      }

      if (conspicuous.includes(value)) {
        return EvaluationExaminationValueDto.CONSPICUOUS;
      } else if (borderline.includes(value)) {
        return EvaluationExaminationValueDto.BORDERLINE;
      } else if (inconspicuous.includes(value)) {
        return EvaluationExaminationValueDto.INCONSPICUOUS;
      } else if (value == unknown) {
        return EvaluationExaminationValueDto.UNKNOWN;
      } else {
        throw new BadRequestException("Invalid value");
      }
    }
  }

  public record EvaluationArticulationRanges(Range inconspicuous, Range conspicuous)
      implements EvaluationRanges<EvaluationArticulationValueDto> {
    public boolean isInvalid(Integer value) {
      return !(value == null || inconspicuous.includes(value) || conspicuous.includes(value));
    }

    public EvaluationArticulationValueDto evaluate(Integer value) {
      if (value == null) {
        return null;
      }

      if (inconspicuous.includes(value)) {
        return EvaluationArticulationValueDto.INCONSPICUOUS;
      } else if (conspicuous.includes(value)) {
        return EvaluationArticulationValueDto.CONSPICUOUS;
      } else {
        throw new BadRequestException("Invalid value");
      }
    }
  }

  public record Range(int min, int max) {
    private static Range of(int min, int max) {
      return new Range(min, max);
    }

    private static Range of(int value) {
      return new Range(value, value);
    }

    private boolean includes(int value) {
      return value >= this.min && value <= this.max;
    }
  }

  public static final EvaluationExaminationRanges JUMP_COUNT_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 6), Range.of(7, 8), Range.of(9, 30), 99);

  public static final EvaluationExaminationRanges VISUO_MOTOR_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 4), Range.of(5, 6), Range.of(7, 12), 99);

  public static final EvaluationExaminationRanges VISUAL_PERCEPTION_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 8), Range.of(9, 10), Range.of(11, 15), 99);

  public static final EvaluationExaminationRanges PREPOSITION_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 4), Range.of(5), Range.of(6, 8), 9);

  public static final EvaluationExaminationRanges PLURAL_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 3), Range.of(4, 5), Range.of(6, 7), 9);

  public static final EvaluationExaminationRanges PSEUDOWORD_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 3), Range.of(4), Range.of(5, 6), 9);

  public static final EvaluationExaminationRanges COUNTING_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 12), Range.of(13, 16), Range.of(17, 20), 99);

  public static final EvaluationExaminationRanges QUANTITY_KNOWLEDGE_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 10), Range.of(11, 13), Range.of(14, 16), 99);

  public static final EvaluationExaminationRanges SELECTIVE_ATTENTION_EVALUATION =
      new EvaluationExaminationRanges(Range.of(0, 10), Range.of(11, 13), Range.of(14, 29), 99);

  public static final EvaluationArticulationRanges ARTICULATION_EVALUATION =
      new EvaluationArticulationRanges(Range.of(0), Range.of(1, 10));
}
