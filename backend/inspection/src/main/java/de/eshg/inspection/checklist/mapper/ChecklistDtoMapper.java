/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.mapper;

import static de.eshg.inspection.checklist.mapper.ChecklistContextMapper.contextFrom;

import de.eshg.inspection.checklist.api.ChecklistDto;
import de.eshg.inspection.checklist.api.ChecklistSectionDto;
import de.eshg.inspection.checklist.api.GetChecklistsResponse;
import de.eshg.inspection.checklist.api.context.ChecklistContextDto;
import de.eshg.inspection.checklist.api.context.element.ChecklistSeparatorContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistAudioContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistCheckboxContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistImageContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistMultiSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistSingleSelectContextDto;
import de.eshg.inspection.checklist.api.context.element.field.ChecklistTextElementContextDto;
import de.eshg.inspection.checklist.api.element.ChecklistElementDto;
import de.eshg.inspection.checklist.api.element.ChecklistSeparatorElementDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistAudioFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistAudioMetaDataDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistCheckboxFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistImageFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistImageMetaDataDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistMultiSelectFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistSingleSelectFieldDto;
import de.eshg.inspection.checklist.api.element.field.ChecklistTextFieldDto;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.ChecklistSection;
import de.eshg.inspection.checklist.persistence.element.ChecklistAudio;
import de.eshg.inspection.checklist.persistence.element.ChecklistAudioElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistCheckboxElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistImage;
import de.eshg.inspection.checklist.persistence.element.ChecklistImageElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistMultiSelectElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistSingleSelectElement;
import de.eshg.inspection.checklist.persistence.element.ChecklistTextElement;
import de.eshg.inspection.checklistdefinition.persistence.section.ChecklistDefinitionSection;
import de.eshg.inspection.checklistdefinition.persistence.section.element.ChecklistDefinitionElement;
import de.eshg.inspection.common.persistence.MediaFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class ChecklistDtoMapper {

  private ChecklistDtoMapper() {}

  public static GetChecklistsResponse dtoFrom(List<Checklist> checklists) {
    return new GetChecklistsResponse(checklists.stream().map(ChecklistDtoMapper::dtoFrom).toList());
  }

  public static ChecklistDto dtoFrom(Checklist checklist) {
    ChecklistDto dto = new ChecklistDto();

    dto.setId(checklist.getId());
    dto.setCoreChecklist(
        checklist.getChecklistDefinitionVersion().getChecklistDefinition().isCoreChecklist());
    ChecklistContextDto context = contextFrom(checklist.getChecklistDefinitionVersion());
    dto.setContext(context);

    Map<UUID, ChecklistElement> elementMap = createElementMap(checklist);
    Map<UUID, ChecklistSection> sectionMap = createSectionMap(checklist);

    checklist
        .getChecklistDefinitionVersion()
        .getSections()
        .forEach(defSection -> dto.addSection(dtoFrom(defSection, sectionMap, elementMap)));

    return dto;
  }

  public static Map<UUID, ChecklistSection> createSectionMap(Checklist checklist) {
    Map<UUID, ChecklistSection> sectionMap = new HashMap<>();

    checklist
        .getChecklistDefinitionVersion()
        .getSections()
        .forEach(
            defSection -> {
              Optional<ChecklistSection> section =
                  checklist.getSections().stream()
                      .filter(
                          filterSection ->
                              filterSection
                                  .getChecklistDefinitionSection()
                                  .getId()
                                  .equals(defSection.getId()))
                      .findFirst();

              if (section.isPresent()) {
                sectionMap.put(defSection.getId(), section.get());
              } else {
                throw new IllegalStateException("Could not find a corresponding ChecklistSection");
              }
            });

    return sectionMap;
  }

  public static Map<UUID, ChecklistElement> createElementMap(Checklist checklist) {
    // build up element map with IDs of DefinitionElements, map to null
    Map<UUID, ChecklistElement> elementMap = new HashMap<>();
    checklist.getChecklistDefinitionVersion().getSections().stream()
        .flatMap(s -> s.getElements().stream())
        .forEach(element -> elementMap.put(element.getId(), null));
    // overwrite null values with corresponding ChecklistElements
    // remaining null values are assumed to be Separators
    checklist.getSections().stream()
        .flatMap(s -> s.getElements().stream())
        .forEach(el -> elementMap.put(el.getChecklistDefinitionElement().getId(), el));
    return elementMap;
  }

  public static ChecklistSectionDto dtoFrom(
      ChecklistDefinitionSection definitionSection,
      Map<UUID, ChecklistSection> sectionMap,
      Map<UUID, ChecklistElement> elementMap) {
    ChecklistSection section = sectionMap.get(definitionSection.getId());

    ChecklistSectionDto dto = new ChecklistSectionDto();

    dto.setId(section.getId());
    // we don't need the element contexts in the section because each element has its own context
    dto.setContext(contextFrom(section.getChecklistDefinitionSection(), false));
    dto.setElements(
        section.getChecklistDefinitionSection().getElements().stream()
            .map(element -> dtoFrom(element, elementMap))
            .toList());

    return dto;
  }

  public static ChecklistElementDto dtoFrom(
      ChecklistDefinitionElement definitionElement, Map<UUID, ChecklistElement> elementMap) {
    if (!elementMap.containsKey(definitionElement.getId())) {
      throw new IllegalStateException(
          String.format("no element found for definition id %s", definitionElement.getId()));
    }

    ChecklistElement element = elementMap.get(definitionElement.getId());

    // like stated in createElementMap function, we assume null value to be a Separator
    if (element == null) {
      ChecklistSeparatorContextDto context =
          (ChecklistSeparatorContextDto) contextFrom(definitionElement);
      return new ChecklistSeparatorElementDto(context);
    }
    ChecklistFieldDto dto =
        switch (element.getType()) {
          case TEXT -> {
            ChecklistTextElementContextDto context =
                (ChecklistTextElementContextDto) contextFrom(definitionElement);
            ChecklistTextElement textElement = (ChecklistTextElement) element;
            yield new ChecklistTextFieldDto(context, textElement.getInput());
          }
          case CHECKBOX -> {
            ChecklistCheckboxContextDto context =
                (ChecklistCheckboxContextDto) contextFrom(definitionElement);
            ChecklistCheckboxElement checkbox = (ChecklistCheckboxElement) element;
            yield new ChecklistCheckboxFieldDto(context, checkbox.isChecked());
          }
          case MULTI_SELECT -> {
            ChecklistMultiSelectContextDto context =
                (ChecklistMultiSelectContextDto) contextFrom(definitionElement);
            ChecklistMultiSelectElement multiSelect = (ChecklistMultiSelectElement) element;
            yield new ChecklistMultiSelectFieldDto(
                context, List.copyOf(multiSelect.getCheckedButtonNames()));
          }
          case SINGLE_SELECT -> {
            ChecklistSingleSelectContextDto context =
                (ChecklistSingleSelectContextDto) contextFrom(definitionElement);
            ChecklistSingleSelectElement singleSelect = (ChecklistSingleSelectElement) element;
            yield new ChecklistSingleSelectFieldDto(context, singleSelect.getCheckedButtonName());
          }
          case IMAGE -> {
            ChecklistImageContextDto context =
                (ChecklistImageContextDto) contextFrom(definitionElement);
            ChecklistImageElement imageElement = (ChecklistImageElement) element;
            List<ChecklistImageMetaDataDto> imageMetaData =
                imageElement.getImages().stream()
                    .map(ChecklistImage::getImageFile)
                    .filter(MediaFile::isNotDeleted)
                    .map(
                        mediaFile ->
                            new ChecklistImageMetaDataDto(
                                mediaFile.getFileExternalId(),
                                mediaFile.getFileName(),
                                mediaFile.getFileSize(),
                                mediaFile.getCreatedAt()))
                    .toList();
            yield new ChecklistImageFieldDto(context, imageMetaData);
          }
          case AUDIO -> {
            ChecklistAudioContextDto context =
                (ChecklistAudioContextDto) contextFrom(definitionElement);
            ChecklistAudioElement audioElement = (ChecklistAudioElement) element;
            List<ChecklistAudioMetaDataDto> audioMetaData =
                audioElement.getAudios().stream()
                    .map(ChecklistAudio::getAudioFile)
                    .filter(MediaFile::isNotDeleted)
                    .map(
                        mediaFile ->
                            new ChecklistAudioMetaDataDto(
                                mediaFile.getFileExternalId(),
                                mediaFile.getFileName(),
                                mediaFile.getFileSize(),
                                mediaFile.getCreatedAt()))
                    .toList();

            yield new ChecklistAudioFieldDto(context, audioMetaData);
          }
          default ->
              throw new IllegalStateException(
                  String.format("invalid element type: %s", element.getType()));
        };
    dto.setId(element.getId());
    dto.setIncident(element.getInspectionIncident() != null);
    return dto;
  }
}
