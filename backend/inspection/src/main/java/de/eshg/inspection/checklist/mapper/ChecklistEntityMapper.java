/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.mapper;

import de.eshg.inspection.checklist.api.update.element.UpdateChecklistAudioDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistCheckboxDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistElementDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistImageDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistMultiSelectDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistSingleSelectDto;
import de.eshg.inspection.checklist.api.update.element.UpdateChecklistTextDto;
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
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionTextElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionCheckbox;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionFieldOption;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionMultiSelect;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionSingleSelect;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.inspection.common.persistence.MediaFileRepository;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ChecklistEntityMapper {

  private static final Logger LOG = LoggerFactory.getLogger(ChecklistEntityMapper.class);

  private final MediaFileRepository mediaFileRepository;

  ChecklistEntityMapper(MediaFileRepository mediaFileRepository) {
    this.mediaFileRepository = mediaFileRepository;
  }

  public static ChecklistSection newEntityFrom(ChecklistDefinitionSection section) {
    ChecklistSection checklistSection = new ChecklistSection();

    section.getElements().stream()
        .filter(element -> element.getType() != ChecklistElementType.SEPARATOR)
        .forEach(element -> checklistSection.addElement(newEntityFrom(element)));
    checklistSection.setChecklistDefinitionSection(section);

    return checklistSection;
  }

  private static ChecklistElement newEntityFrom(ChecklistDefinitionElement def) {
    ChecklistElement element =
        switch (def.getType()) {
          case TEXT -> new ChecklistTextElement();
          case CHECKBOX -> new ChecklistCheckboxElement();
          case MULTI_SELECT -> new ChecklistMultiSelectElement();
          case SINGLE_SELECT -> new ChecklistSingleSelectElement();
          case IMAGE -> new ChecklistImageElement();
          case AUDIO -> new ChecklistAudioElement();
          default ->
              throw new NotFoundException(
                  "Could not map ChecklistDefinitionElement type " + def.getType());
        };
    element.setChecklistDefinitionElement(def);
    return element;
  }

  public ChecklistElement updateElement(
      Checklist checklist, UpdateChecklistElementDto updateElementDto) {
    Inspection inspection = checklist.getInspection();
    ChecklistElement matchedElement = findElementInChecklist(checklist, updateElementDto.getId());

    if (Boolean.FALSE.equals(updateElementDto.isIncident())
        && matchedElement.getInspectionIncident() != null) {
      removeIncident(inspection, matchedElement);
    }

    try {
      switch (matchedElement.getType()) {
        case TEXT -> mapTextElement(inspection, matchedElement, updateElementDto);
        case CHECKBOX -> mapCheckboxElement(inspection, matchedElement, updateElementDto);
        case MULTI_SELECT -> mapMultiSelectElement(inspection, matchedElement, updateElementDto);
        case SINGLE_SELECT -> mapSingleSelectElement(inspection, matchedElement, updateElementDto);
        case IMAGE -> mapImageElement(matchedElement, updateElementDto);
        case AUDIO -> mapAudioElement(matchedElement, updateElementDto);
        default ->
            throw new NotFoundException(
                "Could not map ChecklistDefinitionElement type " + matchedElement.getType());
      }
    } catch (ClassCastException e) {
      throw new BadRequestException(
          String.format(
              "Can not update checklist. Mismatch of type for ID %s", updateElementDto.getId()));
    }
    return matchedElement;
  }

  private static ChecklistElement findElementInChecklist(Checklist checklist, UUID updateId) {
    Optional<ChecklistElement> matchedElement = Optional.empty();
    for (ChecklistSection section : checklist.getSections()) {
      matchedElement =
          section.getElements().stream()
              .filter(element -> element.getId().equals(updateId))
              .findFirst();
      if (matchedElement.isPresent()) break;
    }
    return matchedElement.orElseThrow(
        () -> new NotFoundException("No matching element with ID " + updateId));
  }

  private static void mapTextElement(
      Inspection inspection, ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    ChecklistTextElement textElement = (ChecklistTextElement) element;
    UpdateChecklistTextDto updateTextElement = (UpdateChecklistTextDto) updateElementDto;

    String updateInput = updateTextElement.getInput();
    boolean isNewInput = updateInput != null && !updateInput.equals(textElement.getInput());
    if (isNewInput) {
      textElement.setInput(updateInput);
    }

    if (Boolean.TRUE.equals(updateElementDto.isIncident())) {
      ChecklistDefinitionTextElement cldElement =
          (ChecklistDefinitionTextElement)
              Hibernate.unproxy(
                  textElement.getChecklistDefinitionElement(), ChecklistDefinitionElement.class);
      createOrUpdateIncident(element, inspection, cldElement.getText(), textElement.getInput());
    } else if (element.getInspectionIncident() != null
        && updateElementDto.isIncident() == null
        && isNewInput) {
      element.getInspectionIncident().setDescription(textElement.getInput());
    }
  }

  private static void mapCheckboxElement(
      Inspection inspection, ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    ChecklistCheckboxElement checkboxElement = (ChecklistCheckboxElement) element;
    UpdateChecklistCheckboxDto updateCheckboxElement =
        (UpdateChecklistCheckboxDto) updateElementDto;

    Boolean updateChecked = updateCheckboxElement.getChecked();
    boolean isNewInput =
        updateChecked != null && !updateChecked.equals(checkboxElement.isChecked());
    if (isNewInput) {
      checkboxElement.setChecked(updateChecked);
    }

    if (Boolean.TRUE.equals(updateElementDto.isIncident())) {
      ChecklistDefinitionCheckbox cldElement = getCldCheckbox(checkboxElement);
      String description = getCheckboxDescription(checkboxElement, cldElement);
      createOrUpdateIncident(
          element, inspection, cldElement.getText(), description != null ? description : "");
    } else if (element.getInspectionIncident() != null
        && updateElementDto.isIncident() == null
        && isNewInput) {
      String description = getCheckboxDescription(checkboxElement, getCldCheckbox(checkboxElement));
      element.getInspectionIncident().setDescription(description != null ? description : "");
    }
  }

  private static ChecklistDefinitionCheckbox getCldCheckbox(
      ChecklistCheckboxElement checkboxElement) {
    return (ChecklistDefinitionCheckbox)
        Hibernate.unproxy(
            checkboxElement.getChecklistDefinitionElement(), ChecklistDefinitionElement.class);
  }

  private static String getCheckboxDescription(
      ChecklistCheckboxElement checkboxElement, ChecklistDefinitionCheckbox cldElement) {
    return Boolean.TRUE.equals(checkboxElement.isChecked())
        ? cldElement.getTextModuleTrue()
        : cldElement.getTextModuleFalse();
  }

  private static void mapMultiSelectElement(
      Inspection inspection, ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    ChecklistMultiSelectElement multiSelectElement = (ChecklistMultiSelectElement) element;
    UpdateChecklistMultiSelectDto updateMultiSelectElement =
        (UpdateChecklistMultiSelectDto) updateElementDto;

    List<String> updateCheckedButtonNames = updateMultiSelectElement.getCheckedButtonNames();
    if (updateCheckedButtonNames != null) {
      multiSelectElement.getCheckedButtonNames().clear();
      multiSelectElement.getCheckedButtonNames().addAll(updateCheckedButtonNames);
    }

    if (Boolean.TRUE.equals(updateElementDto.isIncident())) {
      ChecklistDefinitionMultiSelect cldElement = getCldMultiSelect(multiSelectElement);
      String description = getMultiSelectDescription(cldElement, multiSelectElement);
      createOrUpdateIncident(element, inspection, cldElement.getText(), description);
    } else if (isUpdateableIncident(element, updateElementDto)
        && updateCheckedButtonNames != null) {
      String description =
          getMultiSelectDescription(getCldMultiSelect(multiSelectElement), multiSelectElement);
      element.getInspectionIncident().setDescription(description);
    }
  }

  private static ChecklistDefinitionMultiSelect getCldMultiSelect(
      ChecklistMultiSelectElement multiSelectElement) {
    return (ChecklistDefinitionMultiSelect)
        Hibernate.unproxy(
            multiSelectElement.getChecklistDefinitionElement(), ChecklistDefinitionElement.class);
  }

  private static String getMultiSelectDescription(
      ChecklistDefinitionMultiSelect cldElement, ChecklistMultiSelectElement multiSelectElement) {
    StringBuilder description = new StringBuilder();
    List<String> optionTrueTexts =
        cldElement.getItems().stream()
            .filter(option -> multiSelectElement.getCheckedButtonNames().contains(option.getText()))
            .map(ChecklistDefinitionFieldOption::getTextModuleTrue)
            .toList();
    for (int i = 0; i < optionTrueTexts.size(); i++) {
      description.append(optionTrueTexts.get(i));
      if (i < optionTrueTexts.size() - 1) {
        description.append('\n');
      }
    }
    return description.toString();
  }

  private static void mapSingleSelectElement(
      Inspection inspection, ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    ChecklistSingleSelectElement singleSelectElement = (ChecklistSingleSelectElement) element;
    UpdateChecklistSingleSelectDto singleMultiSelectElement =
        (UpdateChecklistSingleSelectDto) updateElementDto;

    String updateCheckedButtonName = singleMultiSelectElement.getCheckedButtonName();
    boolean isNewInput =
        updateCheckedButtonName != null
            && !updateCheckedButtonName.equals(singleSelectElement.getCheckedButtonName());
    if (isNewInput) {
      singleSelectElement.setCheckedButtonName(updateCheckedButtonName);
    }

    if (Boolean.TRUE.equals(updateElementDto.isIncident())) {
      ChecklistDefinitionSingleSelect cldElement = getCldSingleSelect(singleSelectElement);
      String description = getSingleSelectDescription(cldElement, singleSelectElement);
      createOrUpdateIncident(element, inspection, cldElement.getText(), description);
    } else if (element.getInspectionIncident() != null
        && updateElementDto.isIncident() == null
        && isNewInput) {
      String description =
          getSingleSelectDescription(getCldSingleSelect(singleSelectElement), singleSelectElement);
      element.getInspectionIncident().setDescription(description != null ? description : "");
    }
  }

  private static ChecklistDefinitionSingleSelect getCldSingleSelect(
      ChecklistSingleSelectElement singleSelectElement) {
    return (ChecklistDefinitionSingleSelect)
        Hibernate.unproxy(
            singleSelectElement.getChecklistDefinitionElement(), ChecklistDefinitionElement.class);
  }

  private static String getSingleSelectDescription(
      ChecklistDefinitionSingleSelect cldElement,
      ChecklistSingleSelectElement singleSelectElement) {
    return cldElement.getItems().stream()
        .filter(
            option ->
                singleSelectElement.getCheckedButtonName() != null
                    && singleSelectElement.getCheckedButtonName().equals(option.getText()))
        .map(ChecklistDefinitionFieldOption::getTextModuleTrue)
        .findFirst()
        .orElse("");
  }

  private void mapImageElement(
      ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    if (Boolean.TRUE.equals(updateElementDto.isIncident())) {
      throw new BadRequestException("Incident is not supported for image files");
    }

    ChecklistImageElement imageElement = (ChecklistImageElement) element;
    UpdateChecklistImageDto updateImageElement = (UpdateChecklistImageDto) updateElementDto;
    MediaFile imageFile =
        mediaFileRepository
            .findByFileExternalId(updateImageElement.getImageExternalId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Could not find image with ID " + updateImageElement.getImageExternalId()));
    imageElement.addImage(imageFile);
  }

  private void mapAudioElement(
      ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    if (Boolean.TRUE.equals(updateElementDto.isIncident())) {
      throw new BadRequestException("Incident is not supported for audio files");
    }

    ChecklistAudioElement audioElement = (ChecklistAudioElement) element;
    UpdateChecklistAudioDto updateAudioElement = (UpdateChecklistAudioDto) updateElementDto;

    MediaFile audioFile =
        mediaFileRepository
            .findByFileExternalId(updateAudioElement.getAudioExternalId())
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Could not find audio with ID " + updateAudioElement.getAudioExternalId()));
    audioElement.addAudio(audioFile);
  }

  private static void createOrUpdateIncident(
      ChecklistElement checklistElement, Inspection inspection, String title, String description) {
    InspectionIncident incident = checklistElement.getInspectionIncident();
    if (incident == null) {
      incident = new InspectionIncident();
      incident.setIncidentExternalId(checklistElement.getExternalId());
      incident.setTitle(title != null ? title : "");
      checklistElement.setInspectionIncident(incident);
      inspection.addIncident(incident);
    }
    incident.setDescription(description != null ? description : "");
  }

  private static void removeIncident(Inspection inspection, ChecklistElement matchedElement) {
    inspection.getIncidents().remove(matchedElement.getInspectionIncident());
    matchedElement.setInspectionIncident(null);
  }

  private static boolean isUpdateableIncident(
      ChecklistElement element, UpdateChecklistElementDto updateElementDto) {
    return element.getInspectionIncident() != null && updateElementDto.isIncident() == null;
  }
}
