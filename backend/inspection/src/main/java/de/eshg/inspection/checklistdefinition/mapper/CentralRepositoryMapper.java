/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.mapper;

import static de.eshg.inspection.checklistdefinition.ChecklistDefinitionCentralRepoService.*;
import static de.eshg.inspection.checklistdefinition.mapper.ChecklistDefinitionDtoMapper.dtoFrom;

import de.eshg.inspection.checklistdefinition.ChecklistDefinitionCentralRepoService;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoMetadata;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionDto;
import de.eshg.inspection.checklistdefinition.api.GetChecklistDefinitionCentralRepoResponse;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinition;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.lib.centralrepository.api.ContentRequestDto;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;

public final class CentralRepositoryMapper {

  private CentralRepositoryMapper() {}

  public static ChecklistDefinitionDto prepareCentralRepoCld(
      ChecklistDefinition cld, int cldVersionNr) {
    ChecklistDefinitionDto checklistDefinitionDto = dtoFrom(cld, false, null, true);
    ChecklistDefinitionVersionDto checklistDefinitionVersionDto =
        centralRepoVersionDtoFrom(cld, cldVersionNr)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        String.format(
                            "Could not find version %d for checklist definition with given id ",
                            cldVersionNr)));

    if (checklistDefinitionVersionDto.context().getRepositoryVersion() != null) {
      throw new BadRequestException(ErrorCode.CONFLICT, "Repository version already exists");
    }
    checklistDefinitionDto.versions().add(checklistDefinitionVersionDto);
    return checklistDefinitionDto;
  }

  private static Optional<ChecklistDefinitionVersionDto> centralRepoVersionDtoFrom(
      ChecklistDefinition entity, int versionNr) {
    return entity.getVersions().stream()
        .filter(cldVersion -> cldVersion.getVersion() == versionNr)
        .map(version -> dtoFrom(version, null))
        .findFirst();
  }

  public static boolean isChecklist(String objectName) {
    return OBJECT_NAME_CHECKLIST.equals(objectName)
        || OBJECT_NAME_CORE_CHECKLIST.equals(objectName);
  }

  public static String getObjectName(boolean isCoreChecklist) {
    return isCoreChecklist ? OBJECT_NAME_CORE_CHECKLIST : OBJECT_NAME_CHECKLIST;
  }

  public static void setMetadata(
      MultiValueMap<String, Object> parts,
      ChecklistDefinitionDto checklistDefinitionDto,
      List<String> tags,
      String description,
      String changeLog,
      String contact) {
    MetadataRequestDto metadataRequest =
        new MetadataRequestDto(
            checklistDefinitionDto.objectType().name(),
            checklistDefinitionDto.name(),
            tags,
            description,
            changeLog,
            contact);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    parts.add("metadata", new HttpEntity<>(metadataRequest, headers));
  }

  public static void setJsonContent(MultiValueMap<String, Object> parts, String jsonContent) {
    ContentRequestDto contentRequest =
        new ContentRequestDto(MediaType.APPLICATION_JSON_VALUE, jsonContent, null);
    HttpHeaders headers2 = new HttpHeaders();
    headers2.setContentType(MediaType.APPLICATION_JSON);
    parts.add("content", new HttpEntity<>(contentRequest, headers2));
  }

  public static ChecklistDefinitionCentralRepoMetadata createMetadataResponse(
      MetadataResponseDto metadata, ChecklistDefinition checklistDefinition) {

    UUID cldId = checklistDefinition != null ? checklistDefinition.getExternalId() : null;
    Integer localCldRepoVersion =
        checklistDefinition != null ? checklistDefinition.getMostRecentRepositoryVersion() : null;

    boolean isExpandable =
        !metadata.tags().contains(ChecklistDefinitionCentralRepoService.NON_EXPANDABLE);

    return new ChecklistDefinitionCentralRepoMetadata(
        metadata.id(),
        metadata.name(),
        metadata.version(),
        OBJECT_NAME_CORE_CHECKLIST.equals(metadata.objectName()),
        metadata.category(),
        metadata.description(),
        metadata.changeLog(),
        metadata.contact(),
        metadata.createdBy(),
        metadata.createdAt(),
        cldId,
        localCldRepoVersion,
        isExpandable);
  }

  public static GetChecklistDefinitionCentralRepoResponse responseFrom(
      ChecklistDefinitionDto centralRepoCld,
      MetadataResponseDto metadata,
      ChecklistDefinition localCld) {
    Integer localCldRepoVersion = null;

    if (localCld != null) {
      localCldRepoVersion = localCld.getMostRecentRepositoryVersion();
    }
    return new GetChecklistDefinitionCentralRepoResponse(
        centralRepoCld,
        metadata.description(),
        metadata.changeLog(),
        metadata.contact(),
        metadata.createdBy(),
        metadata.createdAt(),
        localCldRepoVersion);
  }

  public static ChecklistDefinitionDto mapLocalObjectTypeToCentralRepoCld(
      ChecklistDefinitionDto centralRepoCld, ObjectType localObjectType) {
    return new ChecklistDefinitionDto(
        centralRepoCld.id(),
        centralRepoCld.name(),
        centralRepoCld.coreChecklist(),
        centralRepoCld.expandable(),
        centralRepoCld.mostRecentRepositoryVersion(),
        centralRepoCld.mostRecentVersionBasedOnRepo(),
        new ObjectTypeRefDto(localObjectType.getId(), localObjectType.getName()),
        centralRepoCld.deleted(),
        centralRepoCld.published(),
        centralRepoCld.lastModified(),
        new ChecklistDefinitionVersionDto(
            centralRepoCld.mostRecentVersion().context(),
            centralRepoCld.mostRecentVersion().modifiedBy(),
            new ObjectTypeRefDto(localObjectType.getId(), localObjectType.getName()),
            centralRepoCld.mostRecentVersion().isCoreChecklist(),
            false),
        centralRepoCld.versions().stream()
            .map(
                v ->
                    new ChecklistDefinitionVersionDto(
                        v.context(),
                        v.modifiedBy(),
                        new ObjectTypeRefDto(localObjectType.getId(), localObjectType.getName()),
                        v.isCoreChecklist(),
                        false))
            .toList());
  }
}
