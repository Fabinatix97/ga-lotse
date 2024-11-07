/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
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
import de.eshg.travelmedicine.template.api.TemplateAnamnesisQuestionDto;
import de.eshg.travelmedicine.template.api.TemplateConfirmationDto;
import de.eshg.travelmedicine.template.api.TemplateContentDto;
import de.eshg.travelmedicine.template.api.TemplateSectionDto;
import de.eshg.travelmedicine.template.api.TemplateSectionElementDto;
import de.eshg.travelmedicine.template.api.TemplateSubElementMultiSelectDto;
import de.eshg.travelmedicine.template.api.TemplateSubElementTextDto;
import de.eshg.travelmedicine.template.api.TemplateTextBlockDto;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TemplateToDocumentMapper {
  private final ObjectMapper objectMapper = new ObjectMapper();

  public DocumentContentDto transferContent(TemplateContentDto templateContent) {
    if (templateContent == null) return null;
    List<DocumentSectionDto> sections =
        templateContent.templateSections().stream().map(this::mapSection).toList();

    return new DocumentContentDto(sections);
  }

  public String transferContent(String templateContent) {
    TemplateContentDto templateContentDto = deserializeTemplateContent(templateContent);
    DocumentContentDto documentContentDto = transferContent(templateContentDto);
    return serializeDocumentContent(documentContentDto);
  }

  private DocumentSectionDto mapSection(TemplateSectionDto templateSection) {
    if (templateSection == null) return null;
    List<DocumentSectionElementDto> sectionElements =
        templateSection.templateSectionElements().stream().map(this::mapSectionElement).toList();
    return new DocumentSectionDto(templateSection.sectionTitle(), sectionElements);
  }

  private DocumentSectionElementDto mapSectionElement(
      TemplateSectionElementDto templateSectionElement) {
    if (templateSectionElement == null) return null;

    DocumentAnamnesisQuestionDto documentAnamnesisQuestionDto =
        this.mapAnamnesisQuestion(templateSectionElement.templateAnamnesisQuestionDto());
    DocumentTextBlockDto documentTextBlockDto =
        this.mapTextBlock(templateSectionElement.templateTextBlockDto());
    DocumentConfirmationDto documentConfirmationDto =
        this.mapConfirmation(templateSectionElement.templateConfirmationDto());

    return new DocumentSectionElementDto(
        documentAnamnesisQuestionDto, documentTextBlockDto, documentConfirmationDto);
  }

  private DocumentAnamnesisQuestionDto mapAnamnesisQuestion(
      TemplateAnamnesisQuestionDto templateAnamnesisQuestion) {
    if (templateAnamnesisQuestion == null) return null;

    List<DocumentSubElementMultiSelectDto> documentSubElementMultiSelects =
        templateAnamnesisQuestion.templateSubElementMultiSelects().stream()
            .map(this::mapSubElementMultiSelect)
            .toList();
    DocumentSubElementTextDto documentSubElementText =
        mapSubElementText(templateAnamnesisQuestion.templateSubElementText());

    return new DocumentAnamnesisQuestionDto(
        templateAnamnesisQuestion.questionText(),
        defaultInitialBooleanAnswer(),
        documentSubElementMultiSelects,
        documentSubElementText);
  }

  private DocumentTextBlockDto mapTextBlock(TemplateTextBlockDto templateTextBlock) {
    if (templateTextBlock == null) return null;
    return new DocumentTextBlockDto(templateTextBlock.textField());
  }

  private DocumentConfirmationDto mapConfirmation(TemplateConfirmationDto templateConfirmation) {
    if (templateConfirmation == null) return null;
    return new DocumentConfirmationDto(
        templateConfirmation.confirmationTextField(), defaultInitialBooleanAnswer());
  }

  private DocumentSubElementMultiSelectDto mapSubElementMultiSelect(
      TemplateSubElementMultiSelectDto templateSubElementMultiSelect) {
    if (templateSubElementMultiSelect == null) return null;
    return new DocumentSubElementMultiSelectDto(
        templateSubElementMultiSelect.questionText(), defaultInitialBooleanAnswer());
  }

  private DocumentSubElementTextDto mapSubElementText(
      TemplateSubElementTextDto templateSubElementText) {
    if (templateSubElementText == null) return null;
    return new DocumentSubElementTextDto(
        templateSubElementText.questionText(), defaultInitialStringAnswer());
  }

  private Boolean defaultInitialBooleanAnswer() {
    return null;
  }

  private String defaultInitialStringAnswer() {
    return null;
  }

  private String serializeDocumentContent(DocumentContentDto documentContentDto) {
    try {
      return objectMapper.writeValueAsString(documentContentDto);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Document Content structure is corrupt");
    }
  }

  private TemplateContentDto deserializeTemplateContent(String templateContent) {
    try {
      return objectMapper.readValue(templateContent, TemplateContentDto.class);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Template content does not match required structure");
    }
  }
}
