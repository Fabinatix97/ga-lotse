/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.mapper;

import de.eshg.inspection.checklist.api.context.ChecklistContextDto;
import de.eshg.inspection.checklist.api.context.ChecklistSectionContextDto;
import de.eshg.inspection.checklist.api.context.element.ChecklistElementContextDto;
import de.eshg.inspection.checklist.api.context.element.ChecklistSeparatorContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistAudioContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistCheckboxContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistFieldContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistFieldOptionContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistImageContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistMultiSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistSingleSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistTextElementContextDto;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionTextElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionAudio;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionCheckbox;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionField;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionFieldOption;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionImage;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionMultiSelect;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionSingleSelect;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import org.hibernate.Hibernate;

public final class ChecklistContextMapper {

  private ChecklistContextMapper() {}

  public static ChecklistContextDto contextFrom(ChecklistDefinitionVersion version) {
    ChecklistContextDto context = new ChecklistContextDto();

    context.setId(version.getId());
    context.setVersion(version.getVersion());
    context.setDefId(version.getChecklistDefinition().getId());
    context.setDescription(version.getDescription());
    context.setName(version.getName());
    context.setValidFrom(version.getValidFrom());
    context.setValidTo(version.getValidTo());
    context.setExpandable(version.isExpandable());
    context.setDeleted(version.isDeleted());
    context.setPublished(version.isPublished());
    context.setLastModified(version.getLastModified());
    context.setSections(contextFrom(version.getSections()));
    context.setRepositoryVersion(version.getRepositoryVersion());

    return context;
  }

  public static List<ChecklistSectionContextDto> contextFrom(
      List<ChecklistDefinitionSection> sections) {
    return sections.stream().map(ChecklistContextMapper::contextFrom).toList();
  }

  public static ChecklistSectionContextDto contextFrom(ChecklistDefinitionSection section) {
    return contextFrom(section, true);
  }

  public static ChecklistSectionContextDto contextFrom(
      ChecklistDefinitionSection section, boolean withElements) {
    ChecklistSectionContextDto context = new ChecklistSectionContextDto();

    context.setId(section.getId());
    context.setTitle(section.getTitle());
    context.setElements(
        withElements
            ? section.getElements().stream().map(ChecklistContextMapper::contextFrom).toList()
            : List.of());

    return context;
  }

  public static ChecklistElementContextDto contextFrom(ChecklistDefinitionElement element) {
    ChecklistDefinitionElement elementEntity =
        Hibernate.unproxy(element, ChecklistDefinitionElement.class);
    switch (elementEntity.getType()) {
      case SEPARATOR -> {
        ChecklistSeparatorContextDto context = new ChecklistSeparatorContextDto();
        context.setId(elementEntity.getId());
        return context;
      }
      case TEXT -> {
        ChecklistTextElementContextDto context = new ChecklistTextElementContextDto();
        ChecklistDefinitionTextElement textElement = (ChecklistDefinitionTextElement) elementEntity;
        fillCldFieldValues(context, textElement);
        return context;
      }
      case CHECKBOX -> {
        ChecklistCheckboxContextDto context = new ChecklistCheckboxContextDto();
        ChecklistDefinitionCheckbox checkbox = (ChecklistDefinitionCheckbox) elementEntity;
        fillCldFieldValues(context, checkbox);
        context.setTextModuleTrue(checkbox.getTextModuleTrue());
        context.setTextModuleFalse(checkbox.getTextModuleFalse());
        return context;
      }
      case MULTI_SELECT -> {
        ChecklistMultiSelectContextDto context = new ChecklistMultiSelectContextDto();
        ChecklistDefinitionMultiSelect multiSelect = (ChecklistDefinitionMultiSelect) elementEntity;
        fillCldFieldValues(context, multiSelect);
        context.setItems(
            multiSelect.getItems().stream().map(ChecklistContextMapper::contextFrom).toList());
        return context;
      }
      case SINGLE_SELECT -> {
        ChecklistSingleSelectContextDto context = new ChecklistSingleSelectContextDto();
        ChecklistDefinitionSingleSelect singleSelect =
            (ChecklistDefinitionSingleSelect) elementEntity;
        fillCldFieldValues(context, singleSelect);
        context.setItems(
            singleSelect.getItems().stream().map(ChecklistContextMapper::contextFrom).toList());
        return context;
      }
      case IMAGE -> {
        ChecklistImageContextDto context = new ChecklistImageContextDto();
        ChecklistDefinitionImage picture = (ChecklistDefinitionImage) elementEntity;
        fillCldFieldValues(context, picture);
        return context;
      }
      case AUDIO -> {
        ChecklistAudioContextDto context = new ChecklistAudioContextDto();
        ChecklistDefinitionAudio audioNote = (ChecklistDefinitionAudio) elementEntity;
        fillCldFieldValues(context, audioNote);
        return context;
      }
      default -> throw new NotFoundException("Could not map ChecklistDefinitionElementType");
    }
  }

  public static ChecklistFieldOptionContextDto contextFrom(
      ChecklistDefinitionFieldOption fieldOption) {
    ChecklistFieldOptionContextDto context = new ChecklistFieldOptionContextDto();
    context.setId(fieldOption.getId());
    context.setText(fieldOption.getText());
    context.setTextModuleTrue(fieldOption.getTextModuleTrue());
    context.setTextModuleFalse(fieldOption.getTextModuleFalse());
    return context;
  }

  public static void fillCldFieldValues(
      ChecklistFieldContextDto context, ChecklistDefinitionField field) {
    context.setId(field.getId());
    context.setHelp(field.getHelp());
    context.setNote(field.getNote());
    context.setMandatory(field.isMandatory());
    context.setText(field.getText());
  }
}
