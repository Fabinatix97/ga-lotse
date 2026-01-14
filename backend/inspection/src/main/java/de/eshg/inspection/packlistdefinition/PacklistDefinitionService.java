/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.client.UserClient;
import de.eshg.inspection.packlistdefinition.api.AddPacklistDefinitionRevisionRequest;
import de.eshg.inspection.packlistdefinition.api.CreateNewPacklistDefinitionRequest;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionRevisionDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionsResponse;
import de.eshg.inspection.packlistdefinition.mapper.PacklistDefinitionDtoMapper;
import de.eshg.inspection.packlistdefinition.mapper.PacklistDefinitionEntityMapper;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinition;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRepository;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevisionRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class PacklistDefinitionService {

  private final UserClient userClient;
  private final PacklistDefinitionEntityMapper mapper;
  private final PacklistDefinitionRepository packlistDefinitionRepository;
  private final PacklistDefinitionRevisionRepository packlistDefinitionRevisionRepository;
  private final Clock clock;

  public PacklistDefinitionService(
      UserClient userClient,
      PacklistDefinitionEntityMapper mapper,
      PacklistDefinitionRepository packlistDefinitionRepository,
      PacklistDefinitionRevisionRepository packlistDefinitionRevisionRepository,
      Clock clock) {
    this.userClient = userClient;
    this.mapper = mapper;
    this.packlistDefinitionRepository = packlistDefinitionRepository;
    this.packlistDefinitionRevisionRepository = packlistDefinitionRevisionRepository;
    this.clock = clock;
  }

  public PacklistDefinitionsResponse getPacklistDefinitions() {
    List<PacklistDefinitionDto> definitions = new ArrayList<>();
    for (PacklistDefinition packlistDefinition : packlistDefinitionRepository.findAll()) {
      definitions.add(PacklistDefinitionDtoMapper.dtoFrom(packlistDefinition, false, null));
    }
    return new PacklistDefinitionsResponse(definitions);
  }

  public PacklistDefinitionDto getPacklistDefinitionRevisions(UUID id) {
    PacklistDefinition packlistDefinition =
        packlistDefinitionRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("PacklistDefinition"));
    Set<UUID> userIds =
        packlistDefinition.getRevisions().stream()
            .map(PacklistDefinitionRevision::getModifiedBy)
            .collect(Collectors.toSet());
    return PacklistDefinitionDtoMapper.dtoFrom(
        packlistDefinition, true, userClient.getUsersAsMap(userIds));
  }

  public PacklistDefinitionRevisionDto getPacklistDefinitionRevision(UUID revisionId) {
    PacklistDefinitionRevision packlistDefinitionRevision =
        packlistDefinitionRevisionRepository
            .findById(revisionId)
            .orElseThrow(() -> new NotFoundException("PacklistDefinitionRevision"));
    return PacklistDefinitionDtoMapper.dtoFrom(
        packlistDefinitionRevision,
        userClient.getUserById(packlistDefinitionRevision.getModifiedBy()));
  }

  public PacklistDefinitionDto createNewPacklistDefinition(
      CreateNewPacklistDefinitionRequest request) {
    PacklistDefinition entity = mapper.entityFrom(request);
    PacklistDefinition saved = packlistDefinitionRepository.saveAndFlush(entity);

    UserDto user = userClient.getUserById(saved.getRevisions().getFirst().getModifiedBy());
    Map<UUID, UserDto> users = Map.of(user.userId(), user);
    return PacklistDefinitionDtoMapper.dtoFrom(saved, true, users);
  }

  public PacklistDefinitionRevisionDto addPacklistDefinitionRevision(
      UUID id, AddPacklistDefinitionRevisionRequest request) {
    PacklistDefinition dbDefinition =
        packlistDefinitionRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("PacklistDefinition"));

    if (dbDefinition.getVersion() != request.version()) {
      throw new BadRequestException(
          ErrorCode.CONFLICT,
          String.format(
              "Outdated version: Lokal version is %d, but received %d",
              dbDefinition.getVersion(), request.version()));
    }

    return saveNewPacklistDefinitionRevision(request, dbDefinition);
  }

  PacklistDefinitionRevisionDto saveNewPacklistDefinitionRevision(
      AddPacklistDefinitionRevisionRequest request, PacklistDefinition dbDefinition) {
    // revisions are sorted by ascending revision number, so the last element has the highest
    // revision
    PacklistDefinitionRevision latestRevision = dbDefinition.getRevisions().getLast();

    latestRevision.setValidTo(Instant.now(clock));

    PacklistDefinitionRevision newRevisionEntity =
        mapper.entityFrom(request, dbDefinition, latestRevision.getRevision() + 1);

    PacklistDefinitionRevision savedRevision =
        packlistDefinitionRevisionRepository.save(newRevisionEntity);

    return PacklistDefinitionDtoMapper.dtoFrom(
        savedRevision, userClient.getUserById(savedRevision.getModifiedBy()));
  }
}
