/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition;

import static de.eshg.centralrepository.client.JsonToResourceHelper.createResourceWithSizeForJsonString;
import static de.eshg.inspection.checklistdefinition.mapper.CentralRepositoryMapper.createMetadataResponse;
import static de.eshg.inspection.checklistdefinition.mapper.CentralRepositoryMapper.getObjectName;
import static de.eshg.inspection.checklistdefinition.mapper.CentralRepositoryMapper.isChecklist;
import static de.eshg.inspection.checklistdefinition.mapper.CentralRepositoryMapper.prepareCentralRepoCld;
import static de.eshg.lib.keycloak.EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS;
import static de.eshg.rest.service.error.ErrorCode.INSUFFICIENT_USER_RIGHTS;
import static de.eshg.rest.service.security.CurrentUserHelper.currentUserHasNoRole;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.centralrepository.client.JsonToResourceHelper.ResourceStream;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoResponse;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoUpdateRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionFromCentralRepoUpdateRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionRequest;
import de.eshg.inspection.checklistdefinition.api.CreateNewChecklistDefinitionRequest;
import de.eshg.inspection.checklistdefinition.api.DeleteChecklistDefinitionCentralRepoRequest;
import de.eshg.inspection.checklistdefinition.api.GetChecklistDefinitionCentralRepoRequest;
import de.eshg.inspection.checklistdefinition.api.GetChecklistDefinitionCentralRepoResponse;
import de.eshg.inspection.checklistdefinition.api.GetNewestChecklistDefinitionsCentralRepoResponse;
import de.eshg.inspection.checklistdefinition.mapper.CentralRepositoryMapper;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinition;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionRepository;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.lib.centralrepository.CentralRepositoryApi;
import de.eshg.lib.centralrepository.api.MetadataListResponseDto;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.lib.centralrepository.api.VersionFilterType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class ChecklistDefinitionCentralRepoService {

  private static final Logger logger =
      LoggerFactory.getLogger(ChecklistDefinitionCentralRepoService.class);

  private static final String MODULE_NAME = "inspection";
  public static final String OBJECT_NAME_CHECKLIST = "checklistdefinition";
  public static final String OBJECT_NAME_CORE_CHECKLIST = "core_" + OBJECT_NAME_CHECKLIST;
  private static final String OBJECT_NAME_ALL = "*";
  private static final String ERROR_MESSAGE_NOT_ALLOWED = "Not allowed to call central repository";
  private static final String ERROR_MESSAGE_FAILED = "Call to central repository failed";
  private static final String ERROR_MESSAGE_EMPTY_BODY =
      "Central repository response body was empty";
  private static final String ERROR_MESSAGE_GET_CONTENT =
      "Could not retrieve entry from central repository";
  private static final String ERROR_MESSAGE_DELETE = "Failed to delete entry in central repository";
  public static final String NON_EXPANDABLE = "@nonExpandable";

  private final CentralRepositoryApi centralRepositoryApi;
  private final ChecklistDefinitionService checklistDefinitionService;
  private final ChecklistDefinitionRepository checklistDefinitionRepository;
  private final ObjectMapper objectMapper;
  private final ObjectTypeRepository objectTypeRepository;

  public ChecklistDefinitionCentralRepoService(
      CentralRepositoryApi centralRepositoryApi,
      ChecklistDefinitionService checklistDefinitionService,
      ChecklistDefinitionRepository checklistDefinitionRepository,
      ObjectMapper objectMapper,
      ObjectTypeRepository objectTypeRepository) {
    this.centralRepositoryApi = centralRepositoryApi;
    this.checklistDefinitionService = checklistDefinitionService;
    this.checklistDefinitionRepository = checklistDefinitionRepository;
    this.objectMapper = objectMapper;
    this.objectTypeRepository = objectTypeRepository;
  }

  ChecklistDefinitionCentralRepoResponse addChecklistDefinition(
      UUID cldId, int cldVersionNr, ChecklistDefinitionCentralRepoRequest request) {

    ChecklistDefinition cld = retrieveCld(cldId);
    validateChecklist(cld);

    if (cld.getMostRecentRepositoryVersion() != null) {
      String message =
          String.format(
              "Checklist definition already added to the central repository with version %d",
              cld.getMostRecentRepositoryVersion());
      throw new BadRequestException(ErrorCode.CONFLICT, message);
    }
    ChecklistDefinitionDto checklistDefinitionDto = prepareCentralRepoCld(cld, cldVersionNr);

    ChecklistDefinitionVersion cldv =
        cld.getVersions().stream()
            .filter(v -> cldVersionNr == v.getVersion())
            .findFirst()
            .orElseThrow();

    List<String> tags = cldv.isExpandable() ? null : Collections.singletonList(NON_EXPANDABLE);

    MetadataResponseDto metadataResponseDto =
        addCentralRepositoryRequest(request, checklistDefinitionDto, tags);

    saveRepositoryVersion(cld, cldVersionNr, metadataResponseDto);

    return new ChecklistDefinitionCentralRepoResponse(
        metadataResponseDto.id(), metadataResponseDto.version(), cldId, cldVersionNr);
  }

  ChecklistDefinitionCentralRepoResponse updateChecklistDefinition(
      UUID cldId, int cldVersionNr, ChecklistDefinitionCentralRepoUpdateRequest request) {
    ChecklistDefinition cld = retrieveCld(cldId);
    validateChecklist(cld);
    ChecklistDefinitionDto checklistDefinitionDto = prepareCentralRepoCld(cld, cldVersionNr);

    MetadataResponseDto metadataResponseDto =
        updateCentralRepositoryRequest(
            request,
            cld,
            checklistDefinitionDto,
            cld.getRepositoryId(),
            cld.getMostRecentRepositoryVersion());

    saveRepositoryVersion(cld, cldVersionNr, metadataResponseDto);

    return new ChecklistDefinitionCentralRepoResponse(
        metadataResponseDto.id(), metadataResponseDto.version(), cldId, cldVersionNr);
  }

  GetNewestChecklistDefinitionsCentralRepoResponse getNewestChecklistDefinitions() {
    MetadataListResponseDto responseBody =
        centralRepositoryApi.getMetadataOfVersionsWithModuleAndObjectName(
            MODULE_NAME, OBJECT_NAME_ALL, VersionFilterType.NEWEST, null, null, null);

    if (responseBody == null) {
      throw new IllegalStateException(ERROR_MESSAGE_EMPTY_BODY);
    }

    List<MetadataResponseDto> metadataResponseList =
        responseBody.items().stream()
            .filter(metadata -> isChecklist(metadata.objectName()))
            .toList();

    Map<Long, ChecklistDefinition> matchedLocalClds =
        getMatchedLocalChecklistDefinitions(metadataResponseList);

    return new GetNewestChecklistDefinitionsCentralRepoResponse(
        metadataResponseList.stream()
            .map(metadata -> createMetadataResponse(metadata, matchedLocalClds.get(metadata.id())))
            .toList());
  }

  ChecklistDefinitionCentralRepoResponse updateChecklistDefinitionsFromCentralRepo(
      ChecklistDefinitionFromCentralRepoUpdateRequest request) {

    Optional<ChecklistDefinition> localCld =
        checklistDefinitionRepository.findByRepositoryId(request.centralRepoId());
    ChecklistDefinitionDto centralRepoCld =
        getCentralRepoChecklistDefinition(
            request.centralRepoId(), request.centralRepoVersion(), request.isCoreChecklist());

    return localCld
        .map(
            checklistDefinition ->
                saveNewChecklistDefinitionVersion(request, checklistDefinition, centralRepoCld))
        .orElseGet(() -> saveNewChecklistDefinition(request, centralRepoCld));
  }

  GetChecklistDefinitionCentralRepoResponse getChecklistDefinition(
      GetChecklistDefinitionCentralRepoRequest request) {
    ChecklistDefinitionDto centralRepoCld =
        getCentralRepoChecklistDefinition(
            request.repositoryID(), request.repositoryVersion(), request.isCoreChecklist());
    MetadataResponseDto metaData =
        centralRepositoryApi.getMetadataOfOneVersion(
            MODULE_NAME,
            getObjectName(request.isCoreChecklist()),
            request.repositoryID(),
            request.repositoryVersion());
    if (metaData == null) {
      throw new IllegalStateException(ERROR_MESSAGE_EMPTY_BODY);
    }

    ChecklistDefinition localCld =
        checklistDefinitionRepository.findByRepositoryId(request.repositoryID()).orElse(null);

    return CentralRepositoryMapper.responseFrom(centralRepoCld, metaData, localCld);
  }

  void deleteChecklistDefinition(DeleteChecklistDefinitionCentralRepoRequest request) {
    deleteInCentralRepository(request);

    checklistDefinitionRepository
        .findByRepositoryId(request.repositoryID())
        .ifPresent(
            localCld -> {
              if (request.repositoryVersion() == null) {
                deleteRepositoryFromLocalCld(localCld);
              } else {
                deleteRepositoryVersionFromLocalCld(request.repositoryVersion(), localCld);
              }
            });
  }

  private MetadataResponseDto addCentralRepositoryRequest(
      ChecklistDefinitionCentralRepoRequest request,
      ChecklistDefinitionDto checklistDefinitionDto,
      List<String> tags) {
    String objectName = getObjectName(checklistDefinitionDto.coreChecklist());

    MetadataRequestDto metadata =
        new MetadataRequestDto(
            checklistDefinitionDto.objectType().name(),
            checklistDefinitionDto.name(),
            tags,
            request.description(),
            request.changeLog(),
            request.contact());

    ResourceStream resource =
        createResourceWithSizeForJsonString(checklistDefinitionDto, objectMapper);

    MetadataResponseDto metadataResponse;
    try {
      metadataResponse =
          centralRepositoryApi.createEntry(
              MODULE_NAME,
              objectName,
              metadata,
              APPLICATION_JSON_VALUE,
              resource.size(),
              resource.stream());
    } catch (HttpClientErrorException.Unauthorized unauthorized) {
      logger.error(ERROR_MESSAGE_NOT_ALLOWED, unauthorized);
      throw new BadRequestException(ErrorCode.UNAUTHORIZED, ERROR_MESSAGE_NOT_ALLOWED);
    } catch (HttpClientErrorException.BadRequest badRequest) {
      logger.error(ERROR_MESSAGE_FAILED, badRequest);
      throw new BadRequestException(ERROR_MESSAGE_FAILED);
    }

    return Optional.ofNullable(metadataResponse)
        .orElseThrow(() -> new IllegalStateException(ERROR_MESSAGE_EMPTY_BODY));
  }

  private MetadataResponseDto updateCentralRepositoryRequest(
      ChecklistDefinitionCentralRepoUpdateRequest request,
      ChecklistDefinition cld,
      ChecklistDefinitionDto checklistDefinitionDto,
      Long repositoryId,
      Integer repositoryVersion) {

    if (repositoryId == null) {
      throw new IllegalStateException("Could not retrieve repository ID");
    }
    if (repositoryVersion == null) {
      throw new IllegalStateException("Could not retrieve old repository version");
    }

    ChecklistDefinitionVersion cldv =
        cld.getVersions().stream()
            .filter(v -> repositoryVersion == v.getVersion())
            .findFirst()
            .orElseThrow();

    List<String> tags = cldv.isExpandable() ? null : Collections.singletonList(NON_EXPANDABLE);

    String objectName = getObjectName(checklistDefinitionDto.coreChecklist());

    MetadataRequestDto metadata =
        new MetadataRequestDto(
            checklistDefinitionDto.objectType().name(),
            checklistDefinitionDto.name(),
            tags,
            request.description(),
            request.changeLog(),
            request.contact());

    ResourceStream resource =
        createResourceWithSizeForJsonString(checklistDefinitionDto, objectMapper);

    MetadataResponseDto metadataResponse;
    try {
      metadataResponse =
          centralRepositoryApi.createNewVersionForEntry(
              MODULE_NAME,
              objectName,
              repositoryId,
              repositoryVersion,
              metadata,
              APPLICATION_JSON_VALUE,
              resource.size(),
              resource.stream());
    } catch (HttpClientErrorException.Unauthorized unauthorized) {
      logger.error(ERROR_MESSAGE_NOT_ALLOWED, unauthorized);
      throw new BadRequestException(ErrorCode.UNAUTHORIZED, ERROR_MESSAGE_NOT_ALLOWED);
    } catch (HttpClientErrorException.BadRequest badRequest) {
      logger.error(ERROR_MESSAGE_FAILED, badRequest);
      throw new BadRequestException(ERROR_MESSAGE_FAILED);
    } catch (HttpClientErrorException.Conflict conflict) {
      logger.error(ERROR_MESSAGE_FAILED, conflict);
      throw new BadRequestException(
          ErrorCode.CONFLICT, "Entry with newer version already exists in central repository");
    }

    return Optional.ofNullable(metadataResponse)
        .orElseThrow(() -> new IllegalStateException(ERROR_MESSAGE_EMPTY_BODY));
  }

  private ChecklistDefinitionDto getCentralRepoChecklistDefinition(
      long centralRepoId, int centralRepoVersion, boolean isCoreChecklist) {
    ResponseEntity<Resource> contentResponse;
    try {
      contentResponse =
          centralRepositoryApi.getContentOfOneVersion(
              MODULE_NAME, getObjectName(isCoreChecklist), centralRepoId, centralRepoVersion);
      if (contentResponse == null || contentResponse.getBody() == null) {
        throw new IllegalStateException(ERROR_MESSAGE_EMPTY_BODY);
      }
    } catch (HttpClientErrorException.BadRequest badRequest) {
      logger.error(ERROR_MESSAGE_GET_CONTENT, badRequest);
      throw new BadRequestException(ERROR_MESSAGE_GET_CONTENT);
    }

    try (InputStream inputStream = contentResponse.getBody().getInputStream()) {
      ChecklistDefinitionDto centralRepoCld =
          objectMapper.readValue(inputStream, ChecklistDefinitionDto.class);
      ObjectType objectType =
          objectTypeRepository
              .findByName(centralRepoCld.objectType().name())
              .orElseThrow(
                  () ->
                      new NotFoundException(
                          "Couldn't locally find an object type with name '%s'"
                              .formatted(centralRepoCld.objectType().name())));

      return CentralRepositoryMapper.mapLocalObjectTypeToCentralRepoCld(centralRepoCld, objectType);
    } catch (IOException e) {
      logger.error("Unable to read CLD central repo content", e);
      throw new IllegalStateException("Unable to read CLD central repo content");
    }
  }

  private void deleteInCentralRepository(DeleteChecklistDefinitionCentralRepoRequest request) {
    try {
      String objectName = getObjectName(request.isCoreChecklist());
      if (request.repositoryVersion() == null) {
        centralRepositoryApi.setEntryAsDeleted(MODULE_NAME, objectName, request.repositoryID());
      } else {
        centralRepositoryApi.setOneVersionOfAnEntryAsDeleted(
            MODULE_NAME, objectName, request.repositoryID(), request.repositoryVersion());
      }
    } catch (HttpClientErrorException.BadRequest badRequest) {
      logger.error(ERROR_MESSAGE_DELETE, badRequest);
      throw new BadRequestException(ERROR_MESSAGE_DELETE);
    }
  }

  private ChecklistDefinition retrieveCld(UUID cldId) {
    return checklistDefinitionRepository
        .findById(cldId)
        .orElseThrow(
            () -> new NotFoundException("Could not find checklist definition with given id"));
  }

  private Map<Long, ChecklistDefinition> getMatchedLocalChecklistDefinitions(
      List<MetadataResponseDto> metadataResponseList) {
    List<Long> centralRepoIds = metadataResponseList.stream().map(MetadataResponseDto::id).toList();
    return checklistDefinitionRepository.findAllByRepositoryIdIn(centralRepoIds).stream()
        .collect(StreamUtil.toLinkedHashMap(ChecklistDefinition::getRepositoryId));
  }

  private static void verifyCentralRepositoryVersion(
      ChecklistDefinition cld, int centralRepoVersion) {
    if (cld.getMostRecentRepositoryVersion() >= centralRepoVersion) {
      throw new BadRequestException(
          ErrorCode.CONFLICT,
          "Local checklist definition has already an equal or higher central repository version");
    }
  }

  private ChecklistDefinitionCentralRepoResponse saveNewChecklistDefinition(
      ChecklistDefinitionFromCentralRepoUpdateRequest request,
      ChecklistDefinitionDto centralRepoCld) {
    ChecklistDefinitionCentralRepoResponse checklistDefinitionDto;
    ChecklistDefinitionDto newChecklistDefinition =
        checklistDefinitionService.saveNewChecklistDefinition(
            new CreateNewChecklistDefinitionRequest(
                centralRepoCld.name(),
                centralRepoCld.versions().getFirst().context().getDescription(),
                centralRepoCld.versions().getFirst().context().isExpandable(),
                centralRepoCld.versions().getFirst().context().isDeleted(),
                centralRepoCld.coreChecklist(),
                centralRepoCld.published(),
                centralRepoCld.objectType().id(),
                centralRepoCld.versions().getFirst().context().getSections()));
    UUID localCldId = newChecklistDefinition.id();
    int localCldVersion = newChecklistDefinition.mostRecentVersion().context().getVersion();
    saveRepositoryVersion(
        localCldId, localCldVersion, request.centralRepoId(), request.centralRepoVersion());
    checklistDefinitionDto =
        new ChecklistDefinitionCentralRepoResponse(
            request.centralRepoId(), request.centralRepoVersion(), localCldId, localCldVersion);
    return checklistDefinitionDto;
  }

  private ChecklistDefinitionCentralRepoResponse saveNewChecklistDefinitionVersion(
      ChecklistDefinitionFromCentralRepoUpdateRequest request,
      ChecklistDefinition localCld,
      ChecklistDefinitionDto centralRepoCld) {
    ChecklistDefinitionCentralRepoResponse checklistDefinitionDto;
    verifyCentralRepositoryVersion(localCld, request.centralRepoVersion());
    ChecklistDefinitionVersionDto newCldVersion =
        checklistDefinitionService.saveNewChecklistDefinitionVersion(
            new ChecklistDefinitionVersionRequest(
                centralRepoCld.name(),
                centralRepoCld.versions().getFirst().context().getDescription(),
                centralRepoCld.versions().getFirst().context().isExpandable(),
                centralRepoCld.versions().getFirst().context().isDeleted(),
                centralRepoCld.versions().getFirst().context().isPublished(),
                centralRepoCld.versions().getFirst().context().getSections()),
            localCld);
    UUID localCldId = localCld.getExternalId();
    int localCldVersion = newCldVersion.context().getVersion();
    saveRepositoryVersion(
        localCld, localCldVersion, request.centralRepoId(), request.centralRepoVersion());
    checklistDefinitionDto =
        new ChecklistDefinitionCentralRepoResponse(
            request.centralRepoId(), request.centralRepoVersion(), localCldId, localCldVersion);
    return checklistDefinitionDto;
  }

  private static void saveRepositoryVersion(
      ChecklistDefinition cld, int cldVersionNr, MetadataResponseDto metadataResponseDto) {
    saveRepositoryVersion(
        cld, cldVersionNr, metadataResponseDto.id(), metadataResponseDto.version());
  }

  private void saveRepositoryVersion(
      UUID cldId, int cldVersionNr, long centralRepoId, int centralRepoVersion) {
    ChecklistDefinition cld =
        checklistDefinitionRepository
            .findById(cldId)
            .orElseThrow(() -> new NotFoundException("ChecklistDefinition"));
    saveRepositoryVersion(cld, cldVersionNr, centralRepoId, centralRepoVersion);
  }

  private static void saveRepositoryVersion(
      ChecklistDefinition cld, int cldVersionNr, long centralRepoId, int centralRepoVersion) {
    cld.setRepositoryId(centralRepoId);
    cld.setMostRecentRepositoryVersion(centralRepoVersion);
    Optional<ChecklistDefinitionVersion> cldVersionMatch =
        cld.getVersions().stream()
            .filter(version -> version.getVersion() == cldVersionNr)
            .findFirst();
    cldVersionMatch.ifPresent(
        matchedCldVersion -> {
          matchedCldVersion.setRepositoryVersion(centralRepoVersion);
          matchedCldVersion.setModifiedBy(CurrentUserHelper.getCurrentUserId());
          cld.setMostRecentVersionBasedOnRepo(matchedCldVersion.getVersion());
        });
  }

  private static void deleteRepositoryFromLocalCld(ChecklistDefinition localCld) {
    removeRepositoryFromLocalCld(localCld);
    localCld
        .getVersions()
        .forEach(
            cldVersion -> {
              cldVersion.setRepositoryVersion(null);
              cldVersion.setModifiedBy(CurrentUserHelper.getCurrentUserId());
            });
  }

  private static void deleteRepositoryVersionFromLocalCld(
      Integer repositoryVersion, ChecklistDefinition localCld) {
    localCld.getVersions().stream()
        .filter(version -> repositoryVersion.equals(version.getRepositoryVersion()))
        .findFirst()
        .ifPresent(
            cldVersionMatch -> {
              cldVersionMatch.setRepositoryVersion(null);
              cldVersionMatch.setModifiedBy(CurrentUserHelper.getCurrentUserId());

              resetLocalCldToMostRecentRepositoryVersion(repositoryVersion, localCld);
            });
  }

  private static void resetLocalCldToMostRecentRepositoryVersion(
      Integer repositoryVersion, ChecklistDefinition localCld) {
    if (repositoryVersion.equals(localCld.getMostRecentRepositoryVersion())) {
      Optional<ChecklistDefinitionVersion> mostRecentRepositoryVersion =
          localCld.getVersions().stream()
              .filter(version -> version.getRepositoryVersion() != null)
              .max(Comparator.comparing(ChecklistDefinitionVersion::getRepositoryVersion));
      mostRecentRepositoryVersion.ifPresentOrElse(
          version -> {
            localCld.setMostRecentRepositoryVersion(version.getRepositoryVersion());
            localCld.setMostRecentVersionBasedOnRepo(version.getVersion());
          },
          () -> removeRepositoryFromLocalCld(localCld));
    }
  }

  private static void removeRepositoryFromLocalCld(ChecklistDefinition localCld) {
    localCld.setRepositoryId(null);
    localCld.setMostRecentRepositoryVersion(null);
    localCld.setMostRecentVersionBasedOnRepo(null);
  }

  private static void validateChecklist(ChecklistDefinition definition) {
    if (!definition.isPublished()) {
      throw new BadRequestException(
          "Can not push an unpublished checklist definition to central repository");
    }
    if (definition.isCoreChecklist()
        && currentUserHasNoRole(INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS)) {
      throw new BadRequestException(
          INSUFFICIENT_USER_RIGHTS,
          "No rights to push core checklist definitions to central repository");
    }
  }
}
