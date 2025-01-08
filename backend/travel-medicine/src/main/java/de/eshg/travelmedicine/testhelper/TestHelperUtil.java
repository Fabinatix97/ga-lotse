/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import de.eshg.travelmedicine.document.api.DocumentAnamnesisQuestionDto;
import de.eshg.travelmedicine.document.api.DocumentConfirmationDto;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.api.DocumentSectionDto;
import de.eshg.travelmedicine.document.api.DocumentSectionElementDto;
import de.eshg.travelmedicine.document.api.DocumentSubElementMultiSelectDto;
import de.eshg.travelmedicine.document.api.DocumentSubElementTextDto;
import java.util.List;

public class TestHelperUtil {
  static DocumentContentDto answerDocumentContent(DocumentContentDto document) {
    List<DocumentSectionDto> sectionList =
        document.sections().stream()
            .map(
                s -> {
                  List<DocumentSectionElementDto> documentSectionElements =
                      s.sectionElements().stream()
                          .map(
                              e ->
                                  new DocumentSectionElementDto(
                                      answerAnamnesisQuestion(e.anamnesisQuestion()),
                                      e.textBlock(),
                                      answerConfirmation(e.confirmation())))
                          .toList();
                  return new DocumentSectionDto(s.sectionTitle(), documentSectionElements);
                })
            .toList();
    return new DocumentContentDto(sectionList);
  }

  static DocumentAnamnesisQuestionDto answerAnamnesisQuestion(
      DocumentAnamnesisQuestionDto anamnesisQuestion) {
    if (anamnesisQuestion == null) {
      return null;
    }

    List<DocumentSubElementMultiSelectDto> subElementMultiSelectList = List.of();
    if (!anamnesisQuestion.subElementMultiSelect().isEmpty()) {
      subElementMultiSelectList =
          anamnesisQuestion.subElementMultiSelect().stream()
              .map(e -> new DocumentSubElementMultiSelectDto(e.questionText(), true))
              .toList();
    }

    DocumentSubElementTextDto subElementText = null;
    if (anamnesisQuestion.subElementText() != null) {
      subElementText =
          new DocumentSubElementTextDto(
              anamnesisQuestion.subElementText().questionText(), "Offene Antwort");
    }
    return new DocumentAnamnesisQuestionDto(
        anamnesisQuestion.questionText(), true, subElementMultiSelectList, subElementText);
  }

  static DocumentConfirmationDto answerConfirmation(DocumentConfirmationDto documentConfirmation) {
    if (documentConfirmation == null) {
      return null;
    }
    return new DocumentConfirmationDto(documentConfirmation.confirmationTextField(), true);
  }
}
