/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.base.gdpr.api.GetGdprProcedureFileStateIdsResponse;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.GdprDownloadPackageRepository;
import de.eshg.lib.procedure.domain.repository.GdprValidationTaskRepository;
import de.eshg.lib.procedure.domain.repository.OpenTaskSummaryRawData;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.BusinessProcedureInclusionStatusDto;
import de.eshg.lib.procedure.model.gdpr.BusinessProcedureWithInclusionStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GdprValidationTaskService<
    ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>> {
  private final GdprValidationTaskRepository validationTaskRepository;
  private final GdprDownloadPackageRepository downloadPackageRepository;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final GdprProcedureApi baseGdprProcedureApi;
  private static final Logger log = LoggerFactory.getLogger(GdprValidationTaskService.class);
  private final Clock clock;

  public GdprValidationTaskService(
      GdprValidationTaskRepository validationTaskRepository,
      GdprDownloadPackageRepository downloadPackageRepository,
      ProcedureRepository<ProcedureT> procedureRepository,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      GdprProcedureApi baseGdprProcedureApi,
      Clock clock) {
    this.validationTaskRepository = validationTaskRepository;
    this.downloadPackageRepository = downloadPackageRepository;
    this.procedureRepository = procedureRepository;
    this.enrichingMapper = enrichingMapper;
    this.baseGdprProcedureApi = baseGdprProcedureApi;
    this.clock = clock;
  }

  public GdprValidationTask getValidationTaskFromDb(UUID id) {
    return validationTaskRepository
        .findByGdprProcedureId(id)
        .orElseThrow(() -> new NotFoundException("GdprValidationTask not found."));
  }

  public Procedure<?, ?, ?, ?> getBusinessProcedureFromDb(UUID id) {
    return procedureRepository
        .findByExternalId(id)
        .orElseThrow(() -> new NotFoundException("BusinessProcedure not found."));
  }

  public void getFileStateIdsAndValidateLink(UUID gdprProcedureId, UUID businessProcedureId) {
    List<UUID> fileStateIdsToSearch = getAndValidateFileStateIds(gdprProcedureId);

    List<UUID> businessProcedureIds =
        procedureRepository.findIdsByFileStateIds(fileStateIdsToSearch);

    if (!businessProcedureIds.contains(businessProcedureId)) {
      throw new BadRequestException(
          "The requested business procedure does not have any fileState of the given GDPR procedure");
    }
  }

  public boolean validationTaskAlreadyExists(AddGdprValidationTaskRequest request) {
    Optional<GdprValidationTask> existingTask =
        validationTaskRepository.findByGdprProcedureId(request.gdprProcedureId());
    if (existingTask.isPresent()) {
      log.info(
          "A GdprValidationTask already exists for GdprProcedure with id {}",
          existingTask.get().getGdprProcedureId());
      return true;
    }
    return false;
  }

  public void searchBusinessProceduresAndUpdateValidationTask(
      List<UUID> fileStateIds, GdprValidationTask validationTask) {
    List<UUID> businessProcedureIds = procedureRepository.findIdsByFileStateIds(fileStateIds);
    if (businessProcedureIds.isEmpty()) {
      validationTask.setStatus(GdprValidationTaskStatus.CLOSED);
    }
  }

  public GdprValidationTask add(GdprValidationTask validationTask) {
    Instant now = clock.instant();
    validationTask.setCreatedAt(now);
    validationTask.setModifiedAt(now);

    return validationTaskRepository.save(validationTask);
  }

  public GdprDownloadPackage createAndSaveDownloadPackage(UUID businessProcedureId, byte[] zip) {
    GdprDownloadPackage downloadPackage = new GdprDownloadPackage();
    downloadPackage.setBusinessProcedureId(businessProcedureId);
    downloadPackage.setContent(zip);
    return downloadPackageRepository.save(downloadPackage);
  }

  public List<UUID> getAndValidateFileStateIds(UUID gdprProcedureId) {
    GetGdprProcedureFileStateIdsResponse fileStateResponse =
        baseGdprProcedureApi.getFileStateIds(gdprProcedureId);
    boolean hasFacilityFileStates = !fileStateResponse.facilityFileStateIds().isEmpty();
    boolean hasPersonFileStates = !fileStateResponse.personFileStateIds().isEmpty();

    if (!hasFacilityFileStates && !hasPersonFileStates) {
      throw new IllegalStateException("The GDPR procedure does not have any file state");
    } else if (hasFacilityFileStates && hasPersonFileStates) {
      throw new IllegalStateException(
          "The GDPR procedure has BOTH facility and person file states associated with it");
    }

    return hasFacilityFileStates
        ? fileStateResponse.facilityFileStateIds()
        : fileStateResponse.personFileStateIds();
  }

  public OpenTaskSummary getOpenGdprValidationTaskSummary() {
    OpenTaskSummaryRawData summaryRawData = validationTaskRepository.getOpenTaskSummary();
    return toOpenTaskSummary(summaryRawData);
  }

  private static OpenTaskSummary toOpenTaskSummary(OpenTaskSummaryRawData summaryRawData) {
    LocalDate earliestDueDate = toEarliestDueDate(summaryRawData.getOldestStartDate());
    return new OpenTaskSummary(summaryRawData.getCount(), earliestDueDate);
  }

  private static LocalDate toEarliestDueDate(Instant startedAt) {
    if (startedAt == null) {
      return null;
    }
    LocalDate startDate = startedAt.atOffset(ZoneOffset.UTC).toLocalDate();
    return startDate.plusDays(30);
  }

  public List<BusinessProcedureWithInclusionStatusDto> getBusinessProceduresWithInclusionStatus(
      List<UUID> fileStateIds) {
    List<ProcedureT> procedures = procedureRepository.findByFileStateIds(fileStateIds);
    List<UUID> procedureIds =
        procedures.stream().map(SequencedBaseEntityWithExternalId::getExternalId).toList();
    List<UUID> procedureIdsFromDownloads = downloadPackageRepository.findProcedureIds(procedureIds);
    List<ProcedureDto> enrichedProcedures = enrichingMapper.enrichAndMapProcedures(procedures);
    return enrichedProcedures.stream()
        .map(
            eP ->
                new BusinessProcedureWithInclusionStatusDto(
                    eP, getInclusionStatus(eP.procedureId(), procedureIdsFromDownloads)))
        .toList();
  }

  private static BusinessProcedureInclusionStatusDto getInclusionStatus(
      UUID id, List<UUID> includedIds) {
    return includedIds.contains(id)
        ? BusinessProcedureInclusionStatusDto.INCLUDED
        : BusinessProcedureInclusionStatusDto.UNDECIDED;
  }
}
