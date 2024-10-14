/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.medicalhistory;

import de.eshg.travelmedicine.medicalhistory.api.MedicalHistoryContentDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySectionDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySectionElementDataDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySectionElementDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySubElementMultiSelectDto;
import de.eshg.travelmedicine.medicalhistory.api.MedicalHistorySubElementTextDto;
import java.util.List;

public class MedicalHistoryHelper {

  private MedicalHistoryHelper() {
    throw new IllegalStateException("Utility class");
  }

  public static boolean isMedicalHistoryCompletelyAnswered(
      MedicalHistoryContentDto medicalHistoryContentDto) {
    for (MedicalHistorySectionDto section : medicalHistoryContentDto.medicalHistorySections()) {
      if (!isSectionCompletelyAnswered(section)) {
        return false;
      }
    }
    return true;
  }

  private static boolean isSectionCompletelyAnswered(MedicalHistorySectionDto section) {
    for (MedicalHistorySectionElementDto sectionElement : section.medicalHistorySectionElements()) {
      MedicalHistorySectionElementDataDto data = sectionElement.medicalHistorySectionElement();

      // simple question
      if (data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() == null
          && (!isCompletelyAnsweredSimpleQuestion(data))) {
        return false;
      }

      // free text question
      if (data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() != null
          && (!isCompletelyAnsweredFreeTextQuestion(data))) {
        return false;
      }

      // multiple choice question without free text question
      if (!data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() == null
          && (!isCompletelyAnsweredMultipleChoiceQuestionWithoutFreeTextQuestion(data))) {
        return false;
      }

      // multiple choice question with free text question
      if (!data.medicalHistorySubElementMultiSelects().isEmpty()
          && data.medicalHistorySubElementText() != null
          && (!isCompletelyAnsweredMultipleChoiceQuestionWithFreeTextQuestion(data))) {
        return false;
      }
    }
    return true;
  }

  private static boolean isCompletelyAnsweredSimpleQuestion(
      MedicalHistorySectionElementDataDto data) {
    // simple question should be answered with yes or no
    return data.answer() != null;
  }

  private static boolean isCompletelyAnsweredFreeTextQuestion(
      MedicalHistorySectionElementDataDto data) {
    // free text / open question should be answered with no or have (when answering the question
    // with yes) a non-blank free text field
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && isSubelementTextCompletelyAnswered(data.medicalHistorySubElementText()));
  }

  private static boolean isCompletelyAnsweredMultipleChoiceQuestionWithoutFreeTextQuestion(
      MedicalHistorySectionElementDataDto data) {
    // multiple choice question should be answered with no or have (when answering the question with
    // yes) a non-blank free text field and/or at least one marked multiple choice answer
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && isMultiSelectCompletelyAnswered(data.medicalHistorySubElementMultiSelects()));
  }

  private static boolean isCompletelyAnsweredMultipleChoiceQuestionWithFreeTextQuestion(
      MedicalHistorySectionElementDataDto data) {
    // multiple choice question should be answered with no or have (when answering the question with
    // yes) a non-blank free text field and/or at least one marked multiple choice answer
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && (isSubelementTextCompletelyAnswered(data.medicalHistorySubElementText())
                || isMultiSelectCompletelyAnswered(data.medicalHistorySubElementMultiSelects())));
  }

  private static boolean isMultiSelectCompletelyAnswered(
      List<MedicalHistorySubElementMultiSelectDto> medicalHistorySubElementMultiSelects) {
    return medicalHistorySubElementMultiSelects.stream()
        .anyMatch(multiSelect -> Boolean.TRUE.equals(multiSelect.answer()));
  }

  private static boolean isSubelementTextCompletelyAnswered(MedicalHistorySubElementTextDto text) {
    if (text == null) {
      return false;
    }
    return text.answer() != null && !text.answer().isBlank();
  }
}
