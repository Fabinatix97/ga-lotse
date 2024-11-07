/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document;

import de.eshg.travelmedicine.document.api.DocumentAnamnesisQuestionDto;
import de.eshg.travelmedicine.document.api.DocumentConfirmationDto;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.api.DocumentSectionDto;
import de.eshg.travelmedicine.document.api.DocumentSectionElementDto;
import de.eshg.travelmedicine.document.api.DocumentSubElementMultiSelectDto;
import de.eshg.travelmedicine.document.api.DocumentSubElementTextDto;
import java.util.List;

public class DocumentDtoHelper {

  private DocumentDtoHelper() {
    throw new IllegalStateException("Utility class");
  }

  public static boolean isDocumentContentCompletelyAnswered(
      DocumentContentDto medicalHistoryContentDto) {
    for (DocumentSectionDto section : medicalHistoryContentDto.sections()) {
      if (!isSectionCompletelyAnswered(section)) {
        return false;
      }
    }
    return true;
  }

  private static boolean isSectionCompletelyAnswered(DocumentSectionDto section) {
    for (DocumentSectionElementDto sectionElement : section.sectionElements()) {
      DocumentAnamnesisQuestionDto anamnesisQuestionDto = sectionElement.anamnesisQuestion();
      if (sectionElement.isAnamnesisQuestionSolely()
          && !isAnamnesisQuestionCompletelyAnswered(anamnesisQuestionDto)) {
        return false;
      }

      // textBlocks can never be not completely answered

      DocumentConfirmationDto confirmationDto = sectionElement.confirmation();
      if (sectionElement.isConfirmationSolely()
          && !isConfirmationCompletelyAnswered(confirmationDto)) {
        return false;
      }
    }

    return true;
  }

  private static boolean isAnamnesisQuestionCompletelyAnswered(DocumentAnamnesisQuestionDto data) {
    // simple question
    if (data.subElementMultiSelect().isEmpty()
        && data.subElementText() == null
        && (!isCompletelyAnsweredSimpleQuestion(data))) {
      return false;
    }

    // free text question
    if (data.subElementMultiSelect().isEmpty()
        && data.subElementText() != null
        && (!isCompletelyAnsweredFreeTextQuestion(data))) {
      return false;
    }

    // multiple choice question without free text question
    if (!data.subElementMultiSelect().isEmpty()
        && data.subElementText() == null
        && (!isCompletelyAnsweredMultipleChoiceQuestionWithoutFreeTextQuestion(data))) {
      return false;
    }

    // multiple choice question with free text question
    if (!data.subElementMultiSelect().isEmpty()
        && data.subElementText() != null
        && (!isCompletelyAnsweredMultipleChoiceQuestionWithFreeTextQuestion(data))) {
      return false;
    }

    return true;
  }

  private static boolean isCompletelyAnsweredSimpleQuestion(DocumentAnamnesisQuestionDto data) {
    // simple question should be answered with yes or no
    return data.answer() != null;
  }

  private static boolean isCompletelyAnsweredFreeTextQuestion(DocumentAnamnesisQuestionDto data) {
    // free text / open question should be answered with no or have (when answering the question
    // with yes) a non-blank free text field
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && isSubelementTextCompletelyAnswered(data.subElementText()));
  }

  private static boolean isCompletelyAnsweredMultipleChoiceQuestionWithoutFreeTextQuestion(
      DocumentAnamnesisQuestionDto data) {
    // multiple choice question should be answered with no or have (when answering the question with
    // yes) a non-blank free text field and/or at least one marked multiple choice answer
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && isMultiSelectCompletelyAnswered(data.subElementMultiSelect()));
  }

  private static boolean isCompletelyAnsweredMultipleChoiceQuestionWithFreeTextQuestion(
      DocumentAnamnesisQuestionDto data) {
    // multiple choice question should be answered with no or have (when answering the question with
    // yes) a non-blank free text field and/or at least one marked multiple choice answer
    return Boolean.FALSE.equals(data.answer())
        || (Boolean.TRUE.equals(data.answer())
            && (isSubelementTextCompletelyAnswered(data.subElementText())
                || isMultiSelectCompletelyAnswered(data.subElementMultiSelect())));
  }

  private static boolean isMultiSelectCompletelyAnswered(
      List<DocumentSubElementMultiSelectDto> subElementMultiSelects) {
    return subElementMultiSelects.stream()
        .anyMatch(multiSelect -> Boolean.TRUE.equals(multiSelect.answer()));
  }

  private static boolean isSubelementTextCompletelyAnswered(DocumentSubElementTextDto text) {
    if (text == null) {
      return false;
    }
    return text.answer() != null && !text.answer().isBlank();
  }

  private static boolean isConfirmationCompletelyAnswered(DocumentConfirmationDto confirmationDto) {
    if (confirmationDto == null) {
      return false;
    }
    return confirmationDto.answer() != null && Boolean.TRUE.equals(confirmationDto.answer());
  }
}
