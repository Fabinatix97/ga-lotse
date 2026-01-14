/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.travelmedicine.document.api.DocumentAnamnesisQuestionDto;
import de.eshg.travelmedicine.document.api.DocumentConfirmationDto;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import de.eshg.travelmedicine.document.api.DocumentSectionDto;
import de.eshg.travelmedicine.document.api.DocumentSectionElementDto;
import de.eshg.travelmedicine.document.api.DocumentSubElementMultiSelectDto;
import de.eshg.travelmedicine.document.api.DocumentSubElementTextDto;
import de.eshg.travelmedicine.document.api.DocumentTextBlockDto;

public class DocumentModifier {
  private final ObjectMapper objectMapper = new ObjectMapper();

  private final Boolean setBooleanAnswer;
  private final String setStringAnswer;

  private DocumentModifier(Boolean setBooleanAnswer, String setStringAnswer) {
    this.setBooleanAnswer = setBooleanAnswer;
    this.setStringAnswer = setStringAnswer;
  }

  // probably useful: wipes all answers in a document
  public static DocumentModifier wiper() {
    return new DocumentModifier(null, null);
  }

  // probably useful: fills all answers in a document
  public static DocumentModifier filler(boolean allBooleans, String allStrings) {
    return new DocumentModifier(allBooleans, allStrings);
  }

  public final DocumentContentDto modifyContent(DocumentContentDto documentContentDto) {
    if (documentContentDto == null) return null;
    return new DocumentContentDto(
        documentContentDto.sections().stream().map(this::modifySection).toList());
  }

  public String modifyContent(String documentContent) {
    DocumentContentDto documentContentDto = deserializeDocumentContent(documentContent);
    DocumentContentDto modifiedContentDto = modifyContent(documentContentDto);
    return serializeDocumentContent(modifiedContentDto);
  }

  protected DocumentSectionDto modifySection(DocumentSectionDto documentSectionDto) {
    if (documentSectionDto == null) return null;
    return new DocumentSectionDto(
        documentSectionDto.sectionTitle(),
        documentSectionDto.sectionElements().stream().map(this::modifySectionElement).toList());
  }

  protected DocumentSectionElementDto modifySectionElement(
      DocumentSectionElementDto documentSectionElementDto) {
    if (documentSectionElementDto == null) return null;
    return new DocumentSectionElementDto(
        this.modifyAnamnesisQuestion(documentSectionElementDto.anamnesisQuestion()),
        this.modifyTextBlock(documentSectionElementDto.textBlock()),
        this.modifyConfirmation(documentSectionElementDto.confirmation()));
  }

  protected DocumentAnamnesisQuestionDto modifyAnamnesisQuestion(
      DocumentAnamnesisQuestionDto documentAnamnesisQuestionDto) {
    if (documentAnamnesisQuestionDto == null) return null;
    return new DocumentAnamnesisQuestionDto(
        documentAnamnesisQuestionDto.questionText(),
        setBooleanAnswer,
        documentAnamnesisQuestionDto.subElementMultiSelect().stream()
            .map(this::modifySubElementMultiSelect)
            .toList(),
        this.modifySubElementText(documentAnamnesisQuestionDto.subElementText()));
  }

  protected DocumentTextBlockDto modifyTextBlock(DocumentTextBlockDto documentTextBlockDto) {
    // there's nothing to modify, actually, but we adopt the complete structure anyway
    if (documentTextBlockDto == null) return null;
    return new DocumentTextBlockDto(documentTextBlockDto.textField());
  }

  protected DocumentConfirmationDto modifyConfirmation(DocumentConfirmationDto confirmationDto) {
    if (confirmationDto == null) return null;
    return new DocumentConfirmationDto(confirmationDto.confirmationTextField(), setBooleanAnswer);
  }

  protected DocumentSubElementMultiSelectDto modifySubElementMultiSelect(
      DocumentSubElementMultiSelectDto documentSubElementMultiSelectDto) {
    if (documentSubElementMultiSelectDto == null) return null;
    return new DocumentSubElementMultiSelectDto(
        documentSubElementMultiSelectDto.questionText(), setBooleanAnswer);
  }

  protected DocumentSubElementTextDto modifySubElementText(
      DocumentSubElementTextDto documentSubElementTextDto) {
    if (documentSubElementTextDto == null) return null;
    return new DocumentSubElementTextDto(documentSubElementTextDto.questionText(), setStringAnswer);
  }

  private String serializeDocumentContent(DocumentContentDto documentContentDto) {
    try {
      return objectMapper.writeValueAsString(documentContentDto);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Document Content structure is corrupt");
    }
  }

  private DocumentContentDto deserializeDocumentContent(String documentContent) {
    try {
      return objectMapper.readValue(documentContent, DocumentContentDto.class);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Template content does not match required structure");
    }
  }
}
