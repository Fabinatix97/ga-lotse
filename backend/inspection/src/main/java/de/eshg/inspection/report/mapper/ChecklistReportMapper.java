/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.mapper;

import static java.util.Optional.ofNullable;

import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.ChecklistSection;
import de.eshg.inspection.checklist.persistence.element.ChecklistAudioElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistCheckboxElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistImageElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistMultiSelectElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistSingleSelectElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistTextElement;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionTextElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionAudio;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionCheckbox;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionImage;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionMultiSelect;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionSingleSelect;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.report.persistence.element.ReportElementAnswer;
import de.eshg.inspection.report.persistence.element.ReportElementAudios;
import de.eshg.inspection.report.persistence.element.ReportElementChapter;
import de.eshg.inspection.report.persistence.element.ReportElementImages;
import de.eshg.inspection.report.persistence.element.ReportElementQA;
import de.eshg.inspection.report.persistence.element.ReportElementSection;
import de.eshg.inspection.report.persistence.element.ReportElementSeparator;
import de.eshg.inspection.report.persistence.element.ReportElementTextBlock;
import de.eshg.inspection.report.persistence.element.ReportElementTopLevelTitle;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Hibernate;

public class ChecklistReportMapper {

  private static final String ERROR_MESSAGE_NO_SELECTION = "No selection for %s";
  private static final String ERROR_MESSAGE_MISSING_TEXT_INPUT = "Text input is missing for %s";

  private ChecklistReportMapper() {}

  public static void addChecklist(Report report, Checklist checklist) {
    addChapter(report, checklist.getChecklistDefinitionVersion().getName());

    List<ChecklistSection> sections = checklist.getSections();
    for (int i = 0; i < sections.size(); i++) {
      ChecklistSection section = sections.get(i);
      addSections(report, section, i + 1);
    }
  }

  private static void addSections(Report report, ChecklistSection section, int sectionNr) {
    addSection(
        report,
        getSectionTitleWithNumber(sectionNr, section.getChecklistDefinitionSection().getTitle()));
    int elementNr = 1;
    for (ChecklistDefinitionElement cldElement :
        section.getChecklistDefinitionSection().getElements()) {
      boolean incElementNr =
          handleCldElement(report, cldElement, section.getElements(), sectionNr, elementNr);
      if (incElementNr) elementNr++;
    }
  }

  private static boolean handleCldElement(
      Report report,
      ChecklistDefinitionElement checklistDefinitionElement,
      List<ChecklistElement> checklistElements,
      int sectionNr,
      int elementNr) {
    Optional<ChecklistElement> matchedElement =
        getChecklistElement(checklistDefinitionElement, checklistElements);
    if (matchedElement.isPresent()) {
      addElement(report, matchedElement.get(), sectionNr, elementNr);
      return true;
    } else {
      handleUnmatchedCldElement(report, checklistDefinitionElement);
      return false;
    }
  }

  private static Optional<ChecklistElement> getChecklistElement(
      ChecklistDefinitionElement checklistDefinitionElement,
      List<ChecklistElement> checklistElements) {
    return checklistElements.stream()
        .filter(
            checklistElement ->
                checklistElement.getChecklistDefinitionElement().equals(checklistDefinitionElement))
        .findFirst();
  }

  private static void handleUnmatchedCldElement(
      Report report, ChecklistDefinitionElement checklistDefinitionElement) {
    if (checklistDefinitionElement.getType() == ChecklistElementType.SEPARATOR) {
      addSeparator(report);
    } else {
      throw new BadRequestException("No matching element in checklist for CLD");
    }
  }

  private static String getSectionTitleWithNumber(int sectionNr, String title) {
    return "%d. %s".formatted(sectionNr, title);
  }

  private static String getElementTitleWithNumber(int sectionNr, int elementNr, String title) {
    return "%d.%d %s".formatted(sectionNr, elementNr, title);
  }

  private static void addElement(
      Report report, ChecklistElement element, int sectionNr, int elementNr) {
    ChecklistDefinitionElement cldElement =
        Hibernate.unproxy(
            element.getChecklistDefinitionElement(), ChecklistDefinitionElement.class);

    switch (element.getType()) {
      case TEXT ->
          addTextBlock(
              report,
              (ChecklistTextElement) element,
              (ChecklistDefinitionTextElement) cldElement,
              sectionNr,
              elementNr);
      case CHECKBOX ->
          addQuestionAndAnswers(
              report,
              (ChecklistCheckboxElement) element,
              (ChecklistDefinitionCheckbox) cldElement,
              sectionNr,
              elementNr);
      case MULTI_SELECT ->
          addQuestionAndAnswers(
              report,
              (ChecklistMultiSelectElement) element,
              (ChecklistDefinitionMultiSelect) cldElement,
              sectionNr,
              elementNr);
      case SINGLE_SELECT ->
          addQuestionAndAnswers(
              report,
              (ChecklistSingleSelectElement) element,
              (ChecklistDefinitionSingleSelect) cldElement,
              sectionNr,
              elementNr);
      case IMAGE ->
          addImage(
              report,
              (ChecklistImageElement) element,
              (ChecklistDefinitionImage) cldElement,
              sectionNr,
              elementNr);
      case AUDIO ->
          addAudio(
              report,
              (ChecklistAudioElement) element,
              (ChecklistDefinitionAudio) cldElement,
              sectionNr,
              elementNr);
      case SEPARATOR -> addSeparator(report);
      default ->
          throw new NotFoundException(
              "Could not map ChecklistDefinitionElement type " + element.getType());
    }
  }

  public static void addTopLevelTitle(Report report, String facilityName) {
    ReportElementTopLevelTitle topLevelTitle = new ReportElementTopLevelTitle();
    topLevelTitle.setEditable(false);
    topLevelTitle.setTitle(String.format("Begehungsprotokoll %s", facilityName));
    report.getReportElements().add(topLevelTitle);
  }

  private static void addChapter(Report report, String title) {
    ReportElementChapter chapter = new ReportElementChapter();
    chapter.setEditable(false);
    chapter.setTitle(title);
    report.getReportElements().add(chapter);
  }

  private static void addSection(Report report, String title) {
    ReportElementSection section = new ReportElementSection();
    section.setEditable(false);
    section.setTitle(title);
    report.getReportElements().add(section);
  }

  private static void addTextBlock(
      Report report,
      ChecklistTextElement textElement,
      ChecklistDefinitionTextElement cldElement,
      int sectionNr,
      int elementNr) {
    addTextBlock(
        report,
        getElementTitleWithNumber(sectionNr, elementNr, cldElement.getText()),
        textElement.getInput(),
        textElement.getInspectionIncident() != null,
        false,
        cldElement.isMandatory());
  }

  public static void addTextBlock(
      Report report, String title, String text, boolean isIncident, boolean isEditable) {
    addTextBlock(report, title, text, isIncident, isEditable, true);
  }

  private static void addTextBlock(
      Report report,
      String title,
      String text,
      boolean isIncident,
      boolean isEditable,
      boolean isMandatory) {
    if (isMandatory && StringUtils.isEmpty(text)) {
      throw new BadRequestException(ERROR_MESSAGE_MISSING_TEXT_INPUT.formatted(title));
    }
    ReportElementTextBlock textBlockElement = new ReportElementTextBlock();
    textBlockElement.setEditable(isEditable);
    textBlockElement.setIncident(isIncident);
    textBlockElement.setTitle(title);
    textBlockElement.setText(text);
    report.getReportElements().add(textBlockElement);
  }

  private static void addQuestionAndAnswers(
      Report report,
      ChecklistCheckboxElement element,
      ChecklistDefinitionCheckbox cldCheckbox,
      int sectionNr,
      int elementNr) {
    String title = getElementTitleWithNumber(sectionNr, elementNr, cldCheckbox.getText());
    if (cldCheckbox.isMandatory() && element.isChecked() == null) {
      throw new BadRequestException(ERROR_MESSAGE_NO_SELECTION.formatted(title));
    }
    ReportElementQA questionAndAnswersElement = new ReportElementQA();
    questionAndAnswersElement.setEditable(true);
    questionAndAnswersElement.setIncident(element.getInspectionIncident() != null);
    questionAndAnswersElement.setTitle(title);

    addAnswerElement(
        questionAndAnswersElement,
        ofNullable(element.isChecked()).orElse(false),
        "Ja",
        cldCheckbox.getTextModuleTrue());
    addAnswerElement(
        questionAndAnswersElement,
        ofNullable(element.isChecked()).map(b -> !b).orElse(false),
        "Nein",
        cldCheckbox.getTextModuleFalse());

    report.getReportElements().add(questionAndAnswersElement);
  }

  private static void addQuestionAndAnswers(
      Report report,
      ChecklistSingleSelectElement element,
      ChecklistDefinitionSingleSelect cldSingleSelect,
      int sectionNr,
      int elementNr) {
    String title = getElementTitleWithNumber(sectionNr, elementNr, cldSingleSelect.getText());
    if (cldSingleSelect.isMandatory() && element.getCheckedButtonName() == null) {
      throw new BadRequestException(ERROR_MESSAGE_NO_SELECTION.formatted(title));
    }

    ReportElementQA questionAndAnswersElement = new ReportElementQA();
    questionAndAnswersElement.setEditable(true);
    questionAndAnswersElement.setIncident(element.getInspectionIncident() != null);
    questionAndAnswersElement.setTitle(title);

    cldSingleSelect
        .getItems()
        .forEach(
            option -> {
              boolean isSelected =
                  element.getCheckedButtonName() != null
                      && element.getCheckedButtonName().equals(option.getText());
              String extraText =
                  isSelected ? option.getTextModuleTrue() : option.getTextModuleFalse();
              addAnswerElement(questionAndAnswersElement, isSelected, option.getText(), extraText);
            });

    report.getReportElements().add(questionAndAnswersElement);
  }

  private static void addQuestionAndAnswers(
      Report report,
      ChecklistMultiSelectElement element,
      ChecklistDefinitionMultiSelect cldMultiSelect,
      int sectionNr,
      int elementNr) {
    String title = getElementTitleWithNumber(sectionNr, elementNr, cldMultiSelect.getText());
    if (cldMultiSelect.isMandatory() && element.getCheckedButtonNames().isEmpty()) {
      throw new BadRequestException(ERROR_MESSAGE_NO_SELECTION.formatted(title));
    }

    ReportElementQA questionAndAnswersElement = new ReportElementQA();
    questionAndAnswersElement.setEditable(true);
    questionAndAnswersElement.setIncident(element.getInspectionIncident() != null);
    questionAndAnswersElement.setTitle(title);

    cldMultiSelect
        .getItems()
        .forEach(
            option -> {
              boolean isSelected = element.getCheckedButtonNames().contains(option.getText());
              String extraText =
                  isSelected ? option.getTextModuleTrue() : option.getTextModuleFalse();
              addAnswerElement(questionAndAnswersElement, isSelected, option.getText(), extraText);
            });

    report.getReportElements().add(questionAndAnswersElement);
  }

  private static void addAnswerElement(
      ReportElementQA questionAndAnswersElement,
      boolean isSelected,
      String text,
      String extraText) {
    ReportElementAnswer answerElement = new ReportElementAnswer();
    answerElement.setSelected(isSelected);
    answerElement.setText(text);
    answerElement.setExtraText(extraText);
    questionAndAnswersElement.getAnswers().add(answerElement);
  }

  private static void addImage(
      Report report,
      ChecklistImageElement imageElement,
      ChecklistDefinitionImage cldImageElement,
      int sectionNr,
      int elementNr) {
    ReportElementImages reportImageElement = new ReportElementImages();
    reportImageElement.setEditable(false);
    reportImageElement.setIncident(imageElement.getInspectionIncident() != null);
    reportImageElement.setTitle(
        getElementTitleWithNumber(sectionNr, elementNr, cldImageElement.getText()));
    imageElement.getImages().stream()
        .map(image -> image.getImageFile().getFileExternalId())
        .forEach(mediaFileId -> reportImageElement.getImageChecklistElementIds().add(mediaFileId));
    report.getReportElements().add(reportImageElement);
  }

  private static void addAudio(
      Report report,
      ChecklistAudioElement audioElement,
      ChecklistDefinitionAudio cldAudioElement,
      int sectionNr,
      int elementNr) {

    ReportElementAudios reportAudioElement = new ReportElementAudios();
    reportAudioElement.setEditable(false);
    reportAudioElement.setIncident(audioElement.getInspectionIncident() != null);
    reportAudioElement.setTitle(
        getElementTitleWithNumber(sectionNr, elementNr, cldAudioElement.getText()));
    audioElement.getAudios().stream()
        .map(audio -> audio.getAudioFile().getFileExternalId())
        .forEach(mediaFileId -> reportAudioElement.getAudioChecklistElementIds().add(mediaFileId));
    report.getReportElements().add(reportAudioElement);
  }

  private static void addSeparator(Report report) {
    ReportElementSeparator separatorElement = new ReportElementSeparator();
    report.getReportElements().add(separatorElement);
  }
}
