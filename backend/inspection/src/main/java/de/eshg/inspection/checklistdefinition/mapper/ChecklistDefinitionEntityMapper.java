/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.mapper;

import de.eshg.inspection.checklist.api.context.ChecklistSectionContextDto;
import de.eshg.inspection.checklist.api.context.element.ChecklistSeparatorContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistAudioContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistCheckboxContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistFieldContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistFieldOptionContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistImageContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistMultiSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistSingleSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistTextElementContextDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionRequest;
import de.eshg.inspection.checklistdefinition.api.CreateNewChecklistDefinitionRequest;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinition;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionSeparator;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionTextElement;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionAudio;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionCheckbox;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionField;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionFieldOption;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionImage;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionMultiSelect;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionOptionSelect;
import de.eshg.inspection.checklistdefinition.persistence.section.element.field.ChecklistDefinitionSingleSelect;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ChecklistDefinitionEntityMapper {

  private final ObjectTypeRepository objectTypeRepository;
  private final Clock clock;

  public ChecklistDefinitionEntityMapper(ObjectTypeRepository objectTypeRepository, Clock clock) {
    this.objectTypeRepository = objectTypeRepository;
    this.clock = clock;
  }

  public ChecklistDefinition newEntityFrom(CreateNewChecklistDefinitionRequest request) {
    boolean published = Optional.ofNullable(request.published()).orElse(true);
    boolean deleted = Optional.ofNullable(request.deleted()).orElse(false);

    ChecklistDefinition definition = new ChecklistDefinition();
    definition.setCoreChecklist(Boolean.TRUE.equals(request.isCoreChecklist()));
    ObjectType objectType = findObjectType(request.objectTypeId());
    definition.getObjectTypes().add(objectType);

    ChecklistDefinitionVersion version = new ChecklistDefinitionVersion();
    version.setVersion(1);
    version.setName(request.name());
    version.setDescription(request.description());
    version.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    version.setDeleted(deleted);
    version.setPublished(published);
    request.sections().forEach((section -> version.addSection(entitySectionFrom(section))));

    registerNewVersion(published, deleted, definition, version);

    // to be able to call this, version needs to be registered to definition already
    version.setExpandable(Optional.ofNullable(request.isExpandable()).orElse(true));

    version.setLastModified(clock.instant());

    return definition;
  }

  public ChecklistDefinitionVersion newEntityFrom(
      ChecklistDefinitionVersionRequest request, ChecklistDefinition definition, int newVersion) {
    boolean published = Optional.ofNullable(request.published()).orElse(true);
    boolean deleted = Optional.ofNullable(request.deleted()).orElse(false);

    ChecklistDefinitionVersion version = new ChecklistDefinitionVersion();
    version.setName(request.name());
    version.setDescription(request.description());
    version.setVersion(newVersion);
    version.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    version.setPublished(published);
    version.setDeleted(Optional.ofNullable(request.deleted()).orElse(false));
    request.sections().forEach(section -> version.addSection(entitySectionFrom(section)));

    registerNewVersion(published, deleted, definition, version);

    // to be able to call this, version needs to be registered to definition already
    version.setExpandable(Optional.ofNullable(request.isExpandable()).orElse(true));

    version.setLastModified(clock.instant());

    return version;
  }

  public ChecklistDefinitionVersion editEntityFrom(
      ChecklistDefinitionVersionRequest request, ChecklistDefinitionVersion version) {
    boolean published = Optional.ofNullable(request.published()).orElse(true);
    boolean deleted = Optional.ofNullable(request.deleted()).orElse(false);
    Instant now = clock.instant();

    version.setName(request.name());
    version.setDescription(request.description());
    version.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    version.setPublished(published);
    version.setDeleted(deleted);
    version.getSections().clear();
    request.sections().forEach(section -> version.addSection(entitySectionFrom(section)));

    if (published) {
      version.setValidTo(null);
      version.setValidFrom(now);
      ChecklistDefinition cld = version.getChecklistDefinition();
      cld.setPublished(true);
      cld.setDeleted(deleted);
      if (cld.getVersions().size() >= 2) {
        ChecklistDefinitionVersion prev = cld.getVersions().get(cld.getVersions().size() - 2);
        prev.setValidTo(now);
      }
    }
    // to be able to call this, version needs to be registered to definition already
    version.setExpandable(Optional.ofNullable(request.isExpandable()).orElse(true));

    version.setLastModified(now);

    return version;
  }

  private void registerNewVersion(
      boolean published,
      boolean deleted,
      ChecklistDefinition definition,
      ChecklistDefinitionVersion version) {
    Instant now = clock.instant();
    if (published) {
      version.setValidFrom(now);
      version.setValidTo(null);
      definition.setDeleted(deleted);
      if (!definition.getVersions().isEmpty()) {
        getLatestVersion(definition).setValidTo(now);
      }
    } else {
      version.setValidFrom(null);
      version.setValidTo(null);
    }
    definition.setPublished(published);
    definition.addNewVersion(version); // also sets version.name to definition
  }

  private ChecklistDefinitionSection entitySectionFrom(ChecklistSectionContextDto section) {
    ChecklistDefinitionSection entitySection = new ChecklistDefinitionSection();
    entitySection.setTitle(section.getTitle());

    section
        .getElements()
        .forEach(
            element -> {
              final ChecklistDefinitionElement entitySectionElement;

              switch (element) {
                case ChecklistSeparatorContextDto ignored ->
                    entitySectionElement = new ChecklistDefinitionSeparator();
                case ChecklistCheckboxContextDto checkbox ->
                    entitySectionElement =
                        fillChecklistDefinitionCheckBoxValues(
                            new ChecklistDefinitionCheckbox(), checkbox);
                case ChecklistMultiSelectContextDto multiSelect -> {
                  entitySectionElement =
                      fillChecklistDefinitionFieldValues(
                          new ChecklistDefinitionMultiSelect(), multiSelect);
                  fillEntityOptions(
                      multiSelect.getItems(),
                      (ChecklistDefinitionMultiSelect) entitySectionElement);
                }
                case ChecklistSingleSelectContextDto singleSelect -> {
                  entitySectionElement =
                      fillChecklistDefinitionFieldValues(
                          new ChecklistDefinitionSingleSelect(), singleSelect);
                  fillEntityOptions(
                      singleSelect.getItems(),
                      (ChecklistDefinitionSingleSelect) entitySectionElement);
                }
                case ChecklistTextElementContextDto textElement ->
                    entitySectionElement =
                        fillChecklistDefinitionFieldValues(
                            new ChecklistDefinitionTextElement(), textElement);
                case ChecklistAudioContextDto audio ->
                    entitySectionElement =
                        fillChecklistDefinitionFieldValues(new ChecklistDefinitionAudio(), audio);
                case ChecklistImageContextDto image ->
                    entitySectionElement =
                        fillChecklistDefinitionFieldValues(new ChecklistDefinitionImage(), image);
                default ->
                    throw new NotFoundException("invalid element of unknown type: " + element);
              }

              entitySection.addElement(entitySectionElement);
            });

    return entitySection;
  }

  private void fillEntityOptions(
      List<ChecklistFieldOptionContextDto> items,
      ChecklistDefinitionOptionSelect singleOrMultiSelect) {
    if (items == null || items.isEmpty()) {
      return;
    }
    items.forEach(
        item -> {
          ChecklistDefinitionFieldOption option = new ChecklistDefinitionFieldOption();
          option.setText(item.getText());
          option.setTextModuleTrue(item.getTextModuleTrue());
          option.setTextModuleFalse(item.getTextModuleFalse());

          singleOrMultiSelect.addItem(option);
        });
  }

  private ChecklistDefinitionCheckbox fillChecklistDefinitionCheckBoxValues(
      ChecklistDefinitionCheckbox checkbox, ChecklistCheckboxContextDto dto) {
    checkbox.setTextModuleTrue(dto.getTextModuleTrue());
    checkbox.setTextModuleFalse(dto.getTextModuleFalse());

    fillChecklistDefinitionFieldValues(checkbox, dto);
    return checkbox;
  }

  private ChecklistDefinitionField fillChecklistDefinitionFieldValues(
      ChecklistDefinitionField field, ChecklistFieldContextDto dto) {
    field.setText(dto.getText());
    field.setMandatory(dto.isMandatory());
    field.setNote(dto.getNote());
    field.setHelp(dto.getHelp());

    return field;
  }

  private ObjectType findObjectType(UUID objectTypeId) {
    if (objectTypeId != null) {
      return objectTypeRepository
          .findById(objectTypeId)
          .orElseThrow(() -> new NotFoundException("Unknown objectTypeId"));
    }
    throw new BadRequestException("missing objectTypeId");
  }

  public static ChecklistDefinitionVersion getLatestVersion(
      ChecklistDefinition checklistDefinition) {
    // versions are sorted by ascending version number, so the last element has the highest version
    return checklistDefinition.getVersions().getLast();
  }
}
