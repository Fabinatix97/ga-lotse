/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.mapper;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionElementDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionRevisionDto;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinition;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionElement;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class PacklistDefinitionDtoMapper {

  // If you remove it, sonarlint will complain
  private PacklistDefinitionDtoMapper() {}

  public static PacklistDefinitionDto dtoFrom(
      PacklistDefinition entity, boolean withRevisions, Map<UUID, UserDto> users) {
    // it's dull to load all revisions just to retrieve the ID of the last one -- maybe can be
    // optimized later // TODO This was copied from checklists
    List<PacklistDefinitionRevision> revisions = entity.getRevisions();
    UUID mostRecentRevisionID = revisions.getLast().getId();
    int mostRecentRevisionNr = entity.getMostRecentRevisionNumber();

    List<PacklistDefinitionRevisionDto> dtoRevisions = new ArrayList<>();

    if (withRevisions) {
      if (users != null && !users.isEmpty()) {
        dtoRevisions =
            revisions.stream()
                .map(revision -> dtoFrom(revision, users.get(revision.getModifiedBy())))
                .toList();
      } else {
        dtoRevisions = revisions.stream().map(revision -> dtoFrom(revision, null)).toList();
      }
    }

    return new PacklistDefinitionDto(
        entity.getId(),
        entity.getName(),
        mostRecentRevisionID,
        mostRecentRevisionNr,
        dtoObjectTypeFrom(entity),
        dtoRevisions,
        entity.getVersion());
  }

  public static ObjectTypeRefDto dtoObjectTypeFrom(PacklistDefinition definition) {
    return new ObjectTypeRefDto(
        definition.getObjectType().getId(), definition.getObjectType().getName());
  }

  public static PacklistDefinitionRevisionDto dtoFrom(
      PacklistDefinitionRevision revision, UserDto modifiedByUser) {
    PacklistDefinitionRevisionDto packlistDefinitionRevisionDto =
        new PacklistDefinitionRevisionDto();
    packlistDefinitionRevisionDto.setId(revision.getId());
    packlistDefinitionRevisionDto.setDefId(revision.getPacklistDefinition().getId());
    packlistDefinitionRevisionDto.setName(revision.getName());
    packlistDefinitionRevisionDto.setDescription(revision.getDescription());
    packlistDefinitionRevisionDto.setValidFrom(revision.getValidFrom());
    packlistDefinitionRevisionDto.setValidTo(revision.getValidTo());
    packlistDefinitionRevisionDto.setRevision(revision.getRevision());
    packlistDefinitionRevisionDto.setModifiedBy(modifiedByUser);
    packlistDefinitionRevisionDto.setElements(
        revision.getElements().stream().map(PacklistDefinitionDtoMapper::elementDtoFrom).toList());
    packlistDefinitionRevisionDto.setObjectType(
        dtoObjectTypeFrom(revision.getPacklistDefinition()));
    return packlistDefinitionRevisionDto;
  }

  public static PacklistDefinitionElementDto elementDtoFrom(PacklistDefinitionElement element) {
    return new PacklistDefinitionElementDto(element.getId(), element.getText());
  }
}
