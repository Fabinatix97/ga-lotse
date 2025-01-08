/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.mapper;

import static de.eshg.inspection.checklist.mapper.ChecklistContextMapper.contextFrom;
import static de.eshg.inspection.checklistdefinition.mapper.ChecklistDefinitionEntityMapper.getLatestVersion;
import static java.util.Optional.ofNullable;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionDto;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinition;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.SortedSet;
import java.util.UUID;

public final class ChecklistDefinitionDtoMapper {

  // If you remove it, sonarlint will complain
  private ChecklistDefinitionDtoMapper() {}

  // you can create users Map via private getUsersAsMap function in ChecklistDefinitionService
  public static ChecklistDefinitionDto dtoFrom(
      ChecklistDefinition entity,
      boolean withVersions,
      Map<UUID, UserDto> users,
      boolean isCentralRepoDto) {
    // it's dull to load all versions just to retrieve the ID of the last one -- maybe can be
    // optimized later
    List<ChecklistDefinitionVersion> versions = entity.getVersions();
    var latestVersion = getLatestVersion(entity);
    boolean isExpandable = latestVersion.isExpandable();

    List<ChecklistDefinitionVersionDto> dtoVersions = new ArrayList<>();

    if (withVersions) {
      if (users != null && !users.isEmpty()) {
        dtoVersions =
            versions.stream()
                .map(version -> dtoFrom(version, users.get(version.getModifiedBy())))
                .toList();
      } else {
        dtoVersions = versions.stream().map(version -> dtoFrom(version, null)).toList();
      }
    }

    return new ChecklistDefinitionDto(
        entity.getId(),
        entity.getName(),
        entity.isCoreChecklist(),
        isExpandable,
        isCentralRepoDto ? null : entity.getMostRecentRepositoryVersion(),
        isCentralRepoDto ? null : entity.getMostRecentVersionBasedOnRepo(),
        dtoObjectTypeFrom(entity),
        entity.isDeleted(),
        entity.isPublished(),
        entity.getVersions().getLast().getLastModified(),
        dtoFrom(
            latestVersion,
            Optional.ofNullable(users)
                .map(usrs -> usrs.get(latestVersion.getModifiedBy()))
                .orElse(null)),
        dtoVersions);
  }

  public static ObjectTypeRefDto dtoObjectTypeFrom(ChecklistDefinition definition) {
    return ofNullable(definition.getObjectTypes())
        .filter(l -> !l.isEmpty())
        // although the database is able to store multiple objecttypes, we currently only use
        // the first one
        .map(SortedSet::first)
        .map(o -> new ObjectTypeRefDto(o.getId(), o.getName()))
        .orElse(null);
  }

  public static ChecklistDefinitionVersionDto dtoFrom(
      ChecklistDefinitionVersion version, UserDto modifiedByUser) {
    return new ChecklistDefinitionVersionDto(
        contextFrom(version),
        modifiedByUser,
        dtoObjectTypeFrom(version.getChecklistDefinition()),
        version.getChecklistDefinition().isCoreChecklist(),
        !version.getChecklistDefinition().isPublished());
  }
}
