/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist;

import static de.eshg.inspection.inspection.InspectionUtils.checkInspectionIsNotClosed;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.packlist.api.GetPacklistsResponse;
import de.eshg.inspection.packlist.api.PacklistDto;
import de.eshg.inspection.packlist.mapper.PacklistDtoMapper;
import de.eshg.inspection.packlist.mapper.PacklistEntityMapper;
import de.eshg.inspection.packlist.persistence.Packlist;
import de.eshg.inspection.packlist.persistence.PacklistElement;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevisionRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class PacklistService {

  private final PacklistDefinitionRevisionRepository pldRevisionRepository;

  public PacklistService(PacklistDefinitionRevisionRepository pldRevisionRepository) {
    this.pldRevisionRepository = pldRevisionRepository;
  }

  public List<PacklistDefinitionRevision> getAvailablePLDs(Inspection inspection) {
    ObjectType objectType = inspection.getFacility().getObjectType();

    if (objectType != null) {
      final Set<UUID> availablePacklistDefinitions =
          inspection.getPacklists().stream()
              .map(pl -> pl.getPacklistDefinitionRevision().getPacklistDefinition())
              .map(GloballyUniqueEntityBase::getId)
              .collect(Collectors.toSet());

      return pldRevisionRepository.findNewestPLDRevisionsForObjectTypeWithExclusion(
          objectType, availablePacklistDefinitions);
    } else {
      return List.of();
    }
  }

  public void updateSelectedPacklistDefinitionRevisions(
      Inspection inspection, List<UUID> selectedPacklistDefinitionRevisionIds) {

    checkInspectionIsNotClosed(
        inspection,
        "Packlisten von abgeschlossenen Vorgängen können nicht geändert werden.",
        "packlist could not be updated");

    Map<UUID, PacklistDefinitionRevision> selectedRevisionsMap =
        pldRevisionRepository.findAllById(selectedPacklistDefinitionRevisionIds).stream()
            .collect(Collectors.toMap(PacklistDefinitionRevision::getId, Function.identity()));

    // first, some basic user input validation
    List<String> missingIds =
        selectedPacklistDefinitionRevisionIds.stream()
            .filter(id -> !selectedRevisionsMap.containsKey(id))
            .map(UUID::toString)
            .toList();
    if (!missingIds.isEmpty()) {
      throw new BadRequestException(
          "The following packlistDefinitionRevisionIds were not found: "
              + String.join(",", missingIds));
    }

    Set<UUID> pldrDefinitionSet = new HashSet<>();
    selectedRevisionsMap
        .values()
        .forEach(
            pldr -> {
              if (!pldr.getPacklistDefinition()
                  .getObjectType()
                  .getId()
                  .equals(inspection.getFacility().getObjectType().getId())) {
                throw new BadRequestException(
                    "Packlists are required to have the same object type as the inspection facility");
              }

              boolean uniquelyAdded = pldrDefinitionSet.add(pldr.getPacklistDefinition().getId());
              if (!uniquelyAdded) {
                throw new BadRequestException(
                    ErrorCode.CONFLICT,
                    "Only a single revision per packlist definition is allowed");
              }
            });

    updatePacklists(selectedRevisionsMap, inspection);

    // always sort packlists by name
    renumberPacklistPositions(inspection);
  }

  private void updatePacklists(
      Map<UUID, PacklistDefinitionRevision> selectedRevisionsMap, Inspection inspection) {

    List<UUID> packListsIdsToRemove =
        inspection.getPacklists().stream()
            .filter(
                pl -> {
                  boolean plIsStillSelected =
                      selectedRevisionsMap.containsKey(pl.getPacklistDefinitionRevision().getId());
                  return !plIsStillSelected;
                })
            .map(GloballyUniqueEntityBase::getId)
            .toList();

    // remove packlists that are now unselected
    inspection.getPacklists().removeIf(packlist -> packListsIdsToRemove.contains(packlist.getId()));

    // find new selected packlists and add them to newPacklists
    selectedRevisionsMap.forEach(
        (id, revision) -> {
          boolean revisionIdNotYetInNewPacklists =
              inspection.getPacklists().stream()
                  .noneMatch(pl -> pl.getPacklistDefinitionRevision().getId().equals(id));
          if (revisionIdNotYetInNewPacklists) {
            addRevisionToNewPacklists(revision, inspection, inspection.getPacklists());
          }
        });
  }

  private static void renumberPacklistPositions(Inspection inspection) {
    AtomicInteger count = new AtomicInteger(0);
    inspection.getPacklists().stream()
        .sorted(Comparator.comparing(pl -> pl.getPacklistDefinitionRevision().getName()))
        .forEach(pl -> pl.setPosition(count.getAndIncrement()));
  }

  private void addRevisionToNewPacklists(
      PacklistDefinitionRevision revision, Inspection inspection, List<Packlist> newPacklists) {
    if (revision.getValidTo() != null) {
      throw new BadRequestException(
          "not allowed to set old packlistDefinitionRevision; select the newest revision");
    }
    Packlist packlist = createPacklist(revision, inspection);
    packlist.setPosition(newPacklists.size());
    newPacklists.add(packlist);
  }

  private static Packlist createPacklist(
      PacklistDefinitionRevision revision, Inspection inspection) {
    Packlist packlist = new Packlist();
    packlist.setInspection(inspection);
    packlist.setPacklistDefinitionRevision(revision);
    revision
        .getElements()
        .forEach(element -> packlist.addElement(PacklistEntityMapper.newEntityFrom(element)));
    return packlist;
  }

  public GetPacklistsResponse getPacklists(Inspection inspection) {
    return PacklistDtoMapper.dtoFrom(inspection.getPacklists());
  }

  public PacklistDto checkPacklistElement(
      Inspection inspection, UUID packlistId, UUID packlistElementId, boolean checked) {
    Packlist packlist =
        inspection.getPacklists().stream()
            .filter(pl -> pl.getId().equals(packlistId))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("This packlist is not part of this inspection"));

    PacklistElement packlistElement =
        packlist.getElements().stream()
            .filter(e -> e.getId().equals(packlistElementId))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("This packlist element is not part of this packlist"));

    checkInspectionIsNotClosed(
        inspection,
        "Packlisten von abgeschlossenen Vorgängen können nicht geändert werden.",
        "packlist could not be updated");

    packlistElement.setChecked(checked);

    return PacklistDtoMapper.dtoFrom(packlistElement.getPacklist());
  }
}
