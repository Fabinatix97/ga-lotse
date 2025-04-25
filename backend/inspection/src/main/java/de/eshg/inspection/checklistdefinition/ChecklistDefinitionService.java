/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition;

import static de.eshg.inspection.checklistdefinition.mapper.ChecklistDefinitionEntityMapper.getLatestVersion;
import static de.eshg.lib.keycloak.EmployeePermissionRole.INSPECTION_CORECHECKLISTDEFINITIONS_EDIT;
import static de.eshg.rest.service.error.ErrorCode.INSUFFICIENT_USER_RIGHTS;
import static de.eshg.rest.service.security.CurrentUserHelper.currentUserHasNoRole;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionsResponse;
import de.eshg.inspection.checklistdefinition.api.CreateNewChecklistDefinitionRequest;
import de.eshg.inspection.checklistdefinition.mapper.ChecklistDefinitionDtoMapper;
import de.eshg.inspection.checklistdefinition.mapper.ChecklistDefinitionEntityMapper;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinition;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionRepository;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersionRepository;
import de.eshg.inspection.client.UserClient;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class ChecklistDefinitionService {
  private final UserClient userClient;
  private final ChecklistDefinitionEntityMapper mapper;

  private final ChecklistDefinitionRepository checklistDefinitionRepository;
  private final ChecklistDefinitionVersionRepository checklistDefinitionVersionRepository;
  private final Clock clock;

  public ChecklistDefinitionService(
      UserClient userClient,
      ChecklistDefinitionEntityMapper mapper,
      ChecklistDefinitionRepository checklistDefinitionRepository,
      ChecklistDefinitionVersionRepository checklistDefinitionVersionRepository,
      Clock clock) {
    this.userClient = userClient;
    this.mapper = mapper;
    this.checklistDefinitionRepository = checklistDefinitionRepository;
    this.checklistDefinitionVersionRepository = checklistDefinitionVersionRepository;
    this.clock = clock;
  }

  public ChecklistDefinitionsResponse getChecklistDefinitions() {
    List<ChecklistDefinitionDto> sortedDefinitions =
        checklistDefinitionRepository.findAll().stream()
            .sorted(
                (cld1, cld2) -> {
                  int deletedComparison =
                      Boolean.compare(
                          getLatestVersion(cld1).isDeleted(), getLatestVersion(cld2).isDeleted());
                  if (deletedComparison != 0) {
                    return deletedComparison;
                  }
                  int objectTypeComparison =
                      StringUtils.compareIgnoreCase(
                          cld1.getObjectTypes().getFirst().getName(),
                          cld2.getObjectTypes().getFirst().getName());
                  if (objectTypeComparison != 0) {
                    return objectTypeComparison;
                  }
                  return StringUtils.compareIgnoreCase(
                      cld1.getName(), cld2.getName()); // nameComparison
                })
            .map(cld -> ChecklistDefinitionDtoMapper.dtoFrom(cld, false, null, false))
            .toList();
    return new ChecklistDefinitionsResponse(sortedDefinitions);
  }

  public ChecklistDefinitionDto getChecklistDefinitionVersions(UUID id) {
    ChecklistDefinition checklistDefinition =
        checklistDefinitionRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("ChecklistDefinition"));
    Set<UUID> userIds =
        checklistDefinition.getVersions().stream()
            .map(ChecklistDefinitionVersion::getModifiedBy)
            .collect(Collectors.toSet());
    return ChecklistDefinitionDtoMapper.dtoFrom(
        checklistDefinition, true, userClient.getUsersAsMap(userIds), false);
  }

  public ChecklistDefinitionVersionDto getChecklistDefinitionVersion(UUID versionId) {
    ChecklistDefinitionVersion checklistDefinitionVersion =
        checklistDefinitionVersionRepository
            .findById(versionId)
            .orElseThrow(() -> new NotFoundException("ChecklistDefinitionVersion"));
    return ChecklistDefinitionDtoMapper.dtoFrom(
        checklistDefinitionVersion,
        userClient.getUserById(checklistDefinitionVersion.getModifiedBy()));
  }

  public ChecklistDefinitionDto createNewChecklistDefinition(
      CreateNewChecklistDefinitionRequest request) {
    // check if user requested isCoreChecklist=true but has no rights for that
    if (request.isCoreChecklist() != null
        && request.isCoreChecklist().equals(TRUE)
        && mayNotEditCoreChecklists()) {
      throw new BadRequestException(
          INSUFFICIENT_USER_RIGHTS, "no rights to create core checklists");
    }

    // check if user requested isExpandable=false for a non-core checklist
    if ((request.isCoreChecklist() == null || request.isCoreChecklist().equals(FALSE))
        && request.isExpandable() != null
        && request.isExpandable().equals(FALSE)) {
      throw new BadRequestException(
          "setting a version to non-expandable is only allowed for core checklists");
    }

    return saveNewChecklistDefinition(request);
  }

  ChecklistDefinitionDto saveNewChecklistDefinition(CreateNewChecklistDefinitionRequest request) {
    ChecklistDefinition entity = mapper.newEntityFrom(request);
    ChecklistDefinition saved = checklistDefinitionRepository.saveAndFlush(entity);
    Map<UUID, UserDto> users;
    try {
      UserDto user = userClient.getUserById(saved.getVersions().getFirst().getModifiedBy());
      users = Map.of(user.userId(), user);
    } catch (HttpClientErrorException.Unauthorized e) {
      // this happens only during startup when the populator runs
      users = Map.of();
    }
    return ChecklistDefinitionDtoMapper.dtoFrom(saved, true, users, false);
  }

  public ChecklistDefinitionVersionDto addChecklistDefinitionVersion(
      UUID defId, ChecklistDefinitionVersionRequest request) {
    ChecklistDefinition dbDefinition =
        checklistDefinitionRepository
            .findById(defId)
            .orElseThrow(() -> new NotFoundException("ChecklistDefinition"));

    checkUserRightsForCldVersionRequest(dbDefinition, request);
    if (!getLatestVersion(dbDefinition).isPublished()) {
      throw new BadRequestException(
          "Can not create a new version if an existing unpublished version exists.");
    }

    return saveNewChecklistDefinitionVersion(request, dbDefinition);
  }

  public ChecklistDefinitionVersionDto editDraftChecklistDefinitionVersion(
      UUID versionId, ChecklistDefinitionVersionRequest request) {
    ChecklistDefinitionVersion dbVersion =
        checklistDefinitionVersionRepository
            .findById(versionId)
            .orElseThrow(() -> new NotFoundException("ChecklistDefinitionVersion"));
    ChecklistDefinition dbDefinition = dbVersion.getChecklistDefinition();

    if (dbVersion.isPublished()) {
      throw new BadRequestException(
          "This version can not be edited, because it is already published.");
    } else if (dbVersion.getId() != getLatestVersion(dbDefinition).getId()) {
      throw new IllegalStateException(
          "This version can not be edited, because it is not the newest draft version.");
    }

    checkUserRightsForCldVersionRequest(dbDefinition, request);

    ChecklistDefinitionVersion editedVersionEntity = mapper.editEntityFrom(request, dbVersion);

    ChecklistDefinitionVersion savedVersion =
        checklistDefinitionVersionRepository.save(editedVersionEntity);

    return ChecklistDefinitionDtoMapper.dtoFrom(
        savedVersion, userClient.getUserById(savedVersion.getModifiedBy()));
  }

  public void deleteDraftChecklistDefinitionVersion(UUID versionId) {
    ChecklistDefinitionVersion dbVersion =
        checklistDefinitionVersionRepository
            .findById(versionId)
            .orElseThrow(() -> new NotFoundException("ChecklistDefinitionVersion"));
    ChecklistDefinition dbDefinition = dbVersion.getChecklistDefinition();

    checkUserRightsForDeleteChecklistDefinitionVersion(dbDefinition);
    if (dbVersion.isPublished()) {
      throw new BadRequestException(
          "This version can not be deleted, because it is already published.");
    } else if (dbVersion.getId() != getLatestVersion(dbDefinition).getId()) {
      // In theory this shouldn't be possible, but we check for it just in case.
      throw new IllegalStateException(
          "This version can not be deleted, because it is not the newest draft version.");
    } else if (dbDefinition.getVersions().getLast() != dbVersion) {
      // In theory this shouldn't be possible, but we check for it just in case.
      throw new BadRequestException(
          "This version can not be deleted, because it is not the newest version.");
    }

    if (dbDefinition.getVersions().size() > 1) {
      dbDefinition.getVersions().removeLast();
      dbDefinition.setPublished(dbDefinition.getVersions().getLast().isPublished());
    } else {
      checklistDefinitionRepository.delete(dbDefinition);
    }
  }

  ChecklistDefinitionVersionDto saveNewChecklistDefinitionVersion(
      ChecklistDefinitionVersionRequest request, ChecklistDefinition dbDefinition) {
    ChecklistDefinitionVersion latestVersion = getLatestVersion(dbDefinition);

    if (Optional.ofNullable(request.published()).orElse(true)) {
      latestVersion.setValidTo(clock.instant());
    }

    ChecklistDefinitionVersion newVersionEntity =
        mapper.newEntityFrom(request, dbDefinition, latestVersion.getVersion() + 1);

    ChecklistDefinitionVersion savedVersion =
        checklistDefinitionVersionRepository.save(newVersionEntity);

    return ChecklistDefinitionDtoMapper.dtoFrom(
        savedVersion, userClient.getUserById(savedVersion.getModifiedBy()));
  }

  private static void checkUserRightsForCldVersionRequest(
      ChecklistDefinition dbDefinition, ChecklistDefinitionVersionRequest request) {
    // check if user tried to modify a core checklist but has no rights for that
    if (dbDefinition.isCoreChecklist() && mayNotEditCoreChecklists()) {
      throw new BadRequestException(INSUFFICIENT_USER_RIGHTS, "no rights to edit core checklists");
    }

    // check if user requested isExpandable=false but has no rights for that
    if (request.isExpandable() != null && request.isExpandable().equals(FALSE)) {
      if (mayNotEditCoreChecklists()) {
        throw new BadRequestException(
            INSUFFICIENT_USER_RIGHTS, "no rights to mark a checklist as non-expandable");
      }
      if (!dbDefinition.isCoreChecklist()) {
        throw new BadRequestException(
            "setting a version to non-expandable is only allowed for core checklists");
      }
    }
  }

  private static void checkUserRightsForDeleteChecklistDefinitionVersion(
      ChecklistDefinition dbDefinition) {
    // check if user tried to delete a core checklist but has no rights for that
    if (dbDefinition.isCoreChecklist() && mayNotEditCoreChecklists()) {
      throw new BadRequestException(INSUFFICIENT_USER_RIGHTS, "no rights to edit core checklists");
    }
  }

  private static boolean mayNotEditCoreChecklists() {
    return currentUserHasNoRole(INSPECTION_CORECHECKLISTDEFINITIONS_EDIT);
  }
}
