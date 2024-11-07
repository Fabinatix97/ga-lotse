/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import static java.util.stream.Collectors.toMap;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.SearchReferenceFacilitiesResponse;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.facility.FacilityMapper;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.inspection.api.FacilityDuplicateReviewDto;
import de.eshg.inspection.inspection.api.FacilityForDuplicateReviewDto;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.inspection.inspection.api.InspectionDuplicateReviewDto;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

  private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

  private final InspectionService inspectionService;
  private final FacilityClient facilityClient;
  private final FacilityRepository facilityRepository;
  private final InspectionRepository inspectionRepository;
  private final TransactionHelper transactionHelper;
  private final ProcedureDeletionService<Inspection> inspectionDeletionService;

  public ReviewService(
      InspectionService inspectionService,
      FacilityClient facilityClient,
      FacilityRepository facilityRepository,
      InspectionRepository inspectionRepository,
      TransactionHelper transactionHelper,
      ProcedureDeletionService<Inspection> inspectionDeletionService) {
    this.inspectionService = inspectionService;
    this.facilityClient = facilityClient;
    this.facilityRepository = facilityRepository;
    this.inspectionRepository = inspectionRepository;
    this.transactionHelper = transactionHelper;
    this.inspectionDeletionService = inspectionDeletionService;
  }

  public InspectionDuplicateReviewDto reviewInspectionDuplicates(UUID inspectionId) {
    Inspection inspection = inspectionService.loadInspection(inspectionId);

    GetFacilityFileStateResponse facilityFileState =
        facilityClient.getFacilityFileState(inspection.getFacility().getCentralFileStateId());

    String title = facilityFileState.name();

    return new InspectionDuplicateReviewDto(
        InspectionMapper.mapToDtoForDuplicateReview(inspection, title),
        inspection.getPossibleDuplicates().stream()
            .map(i -> InspectionMapper.mapToDtoForDuplicateReview(i, title))
            .toList());
  }

  public FacilityDuplicateReviewDto reviewFacilityDuplicates(UUID inspectionId) {
    InspectionDto inspection = inspectionService.loadInspectionDTO(inspectionId);

    UUID referenceIdOfImportedFacility =
        facilityClient.getReferenceFacility(inspection.facility().baseFacility().id()).id();

    FacilityForDuplicateReviewDto inspectionFacility =
        FacilityMapper.mapToFacilityForDuplicateReviewDto(
            referenceIdOfImportedFacility,
            inspection.facility().baseFacility(),
            inspection.facility().objectType());

    String facilityName = inspection.facility().baseFacility().name();
    SearchReferenceFacilitiesResponse searchResponse =
        facilityClient.searchReferenceFacilities(facilityName);

    return new FacilityDuplicateReviewDto(
        inspectionFacility,
        searchResponse.facilities().stream()
            .filter(f -> !f.id().equals(referenceIdOfImportedFacility))
            .map(FacilityMapper::mapToFacilityForDuplicateReviewDto)
            .sorted( // We sort to keep the order deterministic for the tests
                Comparator.comparing(FacilityForDuplicateReviewDto::name)
                    .thenComparing(FacilityForDuplicateReviewDto::street)
                    .thenComparing(FacilityForDuplicateReviewDto::houseNo)
                    .thenComparing(FacilityForDuplicateReviewDto::addressAddition)
                    .thenComparing(FacilityForDuplicateReviewDto::postalCode)
                    .thenComparing(FacilityForDuplicateReviewDto::city)
                    .thenComparing(f -> String.join(",", f.emailAddresses()))
                    .thenComparing(f -> String.join(",", f.phoneNumbers()))
                    .thenComparing(f -> f.objectType().name())
                    .thenComparing(FacilityForDuplicateReviewDto::referenceId)
                    .thenComparing(f -> f.objectType().id()))
            .toList());
  }

  public void resolveInspectionDuplicate(UUID inspectionId, boolean keepInspection) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);

    if (inspection.getPossibleDuplicates().isEmpty()) {
      throw new BadRequestException(
          ErrorCode.BAD_REQUEST,
          String.format(
              "Inspection with external id %s is not marked as duplicate.",
              inspection.getExternalId().toString()));
    }

    if (keepInspection) {
      inspection.getPossibleDuplicates().clear();
    } else {
      inspectionRepository.deleteInspectionFromDuplicatesLists(inspection.getId());
      inspectionDeletionService.delete(inspectionId);
    }
  }

  public void resolveFacilityDuplicate(UUID inspectionId, UUID chosenReferenceId) {
    AtomicBoolean deleteFacility = new AtomicBoolean(false);
    Set<UUID> centralFileStatesToDelete = new HashSet<>();
    Set<Long> inspectionIdsToUpdate = new HashSet<>();

    transactionHelper.executeInTransaction(
        () -> {
          Inspection importedInspection = inspectionService.loadInspectionForUpdate(inspectionId);
          Facility inspectionFacility = importedInspection.getFacility();
          UUID referenceIdOfImportedInspection =
              facilityClient.getReferenceFacility(importedInspection.getCentralFileStateId()).id();

          if (!inspectionFacility.hasPossibleDuplicates()) {
            throw new BadRequestException(
                ErrorCode.BAD_REQUEST,
                String.format(
                    "Facility of inspection with external id %s is not marked as duplicate.",
                    importedInspection.getExternalId().toString()));
          }

          // If the chosen facility is the one created in the import, we use that one.
          if (referenceIdOfImportedInspection.equals(chosenReferenceId)) {
            inspectionFacility.setPossibleDuplicates(false);
            return;
          }

          // Otherwise determine all centralFileStateIds for that chosenReferenceId and find all
          // associated inspections and their facilities.
          List<UUID> centralFileStateIdsOfChosenFacility =
              facilityClient.getFacilityFileStateIdsAssociatedWithReferenceFacility(
                  chosenReferenceId);
          List<Inspection> allInspectionsOfReferenceFacility =
              inspectionRepository.findByCentralFileStateIds(centralFileStateIdsOfChosenFacility);
          Collection<Facility> facilities =
              allInspectionsOfReferenceFacility.stream()
                  .map(Inspection::getFacility)
                  .collect(toMap(Facility::getId, v -> v, (v, w) -> v))
                  .values();

          // determine the "target inspection facility" (the one that remains)
          Facility targetFacility =
              switch (facilities.size()) {
                case 0 -> inspectionFacility;
                case 1 -> facilities.iterator().next();
                default -> {
                  Facility first = facilities.iterator().next();
                  log.error(
                      "Found {} inspection facilities for these centralFileStateIds: {}; using the first one with id {}",
                      facilities.size(),
                      centralFileStateIdsOfChosenFacility,
                      first.getId());
                  yield first;
                }
              };

          if (targetFacility == inspectionFacility) {
            inspectionFacility.setPossibleDuplicates(false);

            UUID previousFileStateId = inspectionFacility.getCentralFileStateId();
            centralFileStatesToDelete.add(previousFileStateId);
            inspectionFacility.setCentralFileStateId(
                createNewFileState(chosenReferenceId, previousFileStateId));
          }

          List<Inspection> allInspectionsOfImportedInspection =
              inspectionRepository.findAllInspectionsForFacility(inspectionFacility);

          // We memorize the ids of the inspections we update here, so we can validate later that
          // they no longer have the central file state ids we want to delete
          inspectionIdsToUpdate.addAll(
              allInspectionsOfImportedInspection.stream()
                  .map(SequencedBaseEntity::getId)
                  .collect(Collectors.toSet()));

          for (Inspection inspectionToBeUpdated : allInspectionsOfImportedInspection) {
            // We record the old central file state IDs here because we will overwrite them, but we
            // won't set the deleteFacility flag before the end of the transaction in case it fails
            // and rolls back
            UUID previousFileStateId = inspectionToBeUpdated.getCentralFileStateId();
            centralFileStatesToDelete.add(previousFileStateId);

            // Replace the current centralFileState of the inspection with a new centralFileState
            // that has the same data, but with the 'chosenReferenceId' as new reference id:
            inspectionToBeUpdated
                .getRelatedFacility()
                .setCentralFileStateId(createNewFileState(chosenReferenceId, previousFileStateId));

            // Change the reference of the inspection to the new facility
            if (targetFacility != inspectionFacility) {
              inspectionToBeUpdated.getRelatedFacility().setFacility(targetFacility);
            } else {
              // If the targetFacility is the original facility, its central file state id also has
              // to be updated
              inspectionFacility.setCentralFileStateId(
                  inspectionToBeUpdated.getCentralFileStateId());
            }
          }

          if (targetFacility != inspectionFacility) {
            facilityRepository.delete(inspectionFacility);
            centralFileStatesToDelete.add(inspectionFacility.getCentralFileStateId());
          }

          for (Inspection inspectionToBeUpdated : allInspectionsOfImportedInspection) {
            checkForInspectionDuplicates(inspectionToBeUpdated);
          }

          deleteFacility.set(true);
        });

    if (deleteFacility.get() && !centralFileStatesToDelete.isEmpty()) {
      // We read the central file state ids used for this facility in order to double-check if it
      // is safe to delete the obsolete central file states
      Set<UUID> centralFileStateIdsInDatabase =
          transactionHelper.executeInReadOnlyTransaction(
              () -> {
                Inspection inspection = inspectionService.loadInspection(inspectionId);
                List<Inspection> allInspectionsOfFacility =
                    inspectionRepository.findAllById(inspectionIdsToUpdate);
                Set<UUID> centralFileStateIds = new HashSet<>();
                centralFileStateIds.add(inspection.getFacility().getCentralFileStateId());
                centralFileStateIds.add(inspection.getCentralFileStateId());
                centralFileStateIds.addAll(
                    allInspectionsOfFacility.stream()
                        .map(Inspection::getCentralFileStateId)
                        .collect(Collectors.toSet()));
                return centralFileStateIds;
              });

      if (!Collections.disjoint(centralFileStatesToDelete, centralFileStateIdsInDatabase)) {
        throw new IllegalStateException(
            "Facility to be deleted was not successfully removed from all inspections");
      } else {
        facilityClient.markFacilityFileStateForDeletion(centralFileStatesToDelete);
      }
    }
  }

  private UUID createNewFileState(UUID chosenReferenceId, UUID previousFileStateId) {
    GetFacilityFileStateResponse previousFileState =
        facilityClient.getFacilityFileState(previousFileStateId);

    AddFacilityFileStateResponse newFileState =
        facilityClient.addFacilityFileState(
            new AddFacilityFileStateRequest(
                chosenReferenceId,
                previousFileState.name(),
                previousFileState.emailAddresses(),
                previousFileState.phoneNumbers(),
                previousFileState.contactPersons(),
                previousFileState.contactAddress(),
                previousFileState.differentBillingAddress(),
                previousFileState.dataOrigin(),
                null));
    return newFileState.id();
  }

  private void checkForInspectionDuplicates(Inspection inspection) {
    UUID centralFileStateId = inspection.getFacility().getCentralFileStateId();

    List<UUID> centralFileStateIds =
        facilityClient.getFacilityFileStateIdsWithSameReferenceFacility(centralFileStateId);

    Instant startTime =
        Optional.ofNullable(inspection.getExecutionAppointment())
            .orElse(inspection.getPlannedAppointment())
            .getAppointmentStart()
            .truncatedTo(ChronoUnit.DAYS);
    Instant endTime = startTime.plus(1, ChronoUnit.DAYS);

    List<Inspection> possibleInspectionDuplicates =
        inspectionRepository.findByCentralFileStateIdsAndAppointment(
            centralFileStateIds, startTime, endTime, inspection.getId());

    if (!possibleInspectionDuplicates.isEmpty()) {
      Collection<Inspection> newUniqueValues =
          Stream.concat(
                  inspection.getPossibleDuplicates().stream(),
                  possibleInspectionDuplicates.stream())
              .collect(toMap(Inspection::getId, v -> v, (v, w) -> v))
              .values();
      inspection.getPossibleDuplicates().clear();
      inspection.getPossibleDuplicates().addAll(newUniqueValues);
    }
  }
}
