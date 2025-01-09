/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import static de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus.CLOSED;

import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.base.gdpr.api.AddGdprDownloadsRequest;
import de.eshg.base.gdpr.api.GdprIdentificationDataDto;
import de.eshg.base.gdpr.api.GetGdprDownloadsResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureFileStateIdsResponse;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.GdprValidationTask_;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.*;
import de.eshg.lib.procedure.mapping.ProcedureLibraryEnrichingMapper;
import de.eshg.lib.procedure.model.ProcedureDto;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.BusinessProcedureInclusionStatusDto;
import de.eshg.lib.procedure.model.gdpr.BusinessProcedureWithInclusionStatusDto;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class GdprValidationTaskService<
    ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>> {

  private static final String AUDITLOG_CATEGORY = "DSGVO Prüfauftrag";

  private static final Logger log = LoggerFactory.getLogger(GdprValidationTaskService.class);
  private final GdprValidationTaskRepository validationTaskRepository;
  private final GdprDownloadPackageRepository downloadPackageRepository;
  private final ProcedureRepository<ProcedureT> procedureRepository;
  private final ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper;
  private final GdprProcedureApi baseGdprProcedureApi;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public GdprValidationTaskService(
      GdprValidationTaskRepository validationTaskRepository,
      GdprDownloadPackageRepository downloadPackageRepository,
      ProcedureRepository<ProcedureT> procedureRepository,
      ProcedureLibraryEnrichingMapper<ProcedureT, TaskT> enrichingMapper,
      GdprProcedureApi baseGdprProcedureApi,
      Clock clock,
      AuditLogger auditLogger) {
    this.validationTaskRepository = validationTaskRepository;
    this.downloadPackageRepository = downloadPackageRepository;
    this.procedureRepository = procedureRepository;
    this.enrichingMapper = enrichingMapper;
    this.baseGdprProcedureApi = baseGdprProcedureApi;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public GdprValidationTask getValidationTaskFromDb(UUID id) {
    return validationTaskRepository
        .findByGdprProcedureId(id)
        .orElseThrow(() -> new NotFoundException("GdprValidationTask not found."));
  }

  public List<GdprDownloadPackageInfo> findByDownloadIdIn(Set<UUID> downloadIds) {
    log.info("Fetching download packages from database for IDs: {}", downloadIds);
    if (downloadIds == null || downloadIds.isEmpty()) {
      return List.of();
    }
    return downloadPackageRepository.findInfoByExternalIdIn(downloadIds);
  }

  public List<UUID> findBusinessProcedureIdsByDownloadIdIn(Set<UUID> downloadIds) {
    log.info("Fetching download packages from database for IDs: {}", downloadIds);
    if (downloadIds == null || downloadIds.isEmpty()) {
      return List.of();
    }
    return downloadPackageRepository.findBusinessProcedureIdsByExternalIdIn(downloadIds);
  }

  public GdprDownloadPackage getDownloadPackage(UUID id) {
    log.info("Fetching download package from database by id: {}", id);
    return downloadPackageRepository
        .findByExternalId(id)
        .orElseThrow(() -> new NotFoundException("GdprDownloadPackage not found."));
  }

  public Procedure<?, ?, ?, ?> getBusinessProcedureFromDb(UUID id) {
    return procedureRepository
        .findByExternalId(id)
        .orElseThrow(() -> new NotFoundException("BusinessProcedure not found."));
  }

  public List<UUID> getFileStateIdsAndValidateLink(UUID gdprProcedureId, UUID businessProcedureId) {
    List<UUID> fileStateIdsToSearch = getAndValidateFileStateIds(gdprProcedureId);

    List<UUID> businessProcedureIds =
        procedureRepository.findIdsByFileStateIds(fileStateIdsToSearch);

    if (!businessProcedureIds.contains(businessProcedureId)) {
      throw new BadRequestException(
          "The requested business procedure does not have any fileState of the given GDPR procedure");
    }
    return fileStateIdsToSearch;
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
      validationTask.setStatus(CLOSED);
    }
  }

  public GdprValidationTask add(GdprValidationTask validationTask) {
    Instant now = clock.instant();
    validationTask.setCreatedAt(now);
    validationTask.setModifiedAt(now);

    GdprValidationTask saved = validationTaskRepository.save(validationTask);
    writeAuditLog("Prüfauftrag hinzufügen", mapAuditLog(validationTask));
    return saved;
  }

  public void sendDownloadId(UUID gdprProcedureId, UUID downloadId) {
    baseGdprProcedureApi.addDownloads(
        gdprProcedureId, new AddGdprDownloadsRequest(Set.of(downloadId)));
  }

  public GdprDownloadPackage createAndSaveDownloadPackage(UUID businessProcedureId, byte[] zip) {
    GdprDownloadPackage downloadPackage = new GdprDownloadPackage();
    downloadPackage.setBusinessProcedureId(businessProcedureId);
    downloadPackage.setContent(zip);
    return downloadPackageRepository.save(downloadPackage);
  }

  public GetGdprDownloadsResponse fetchDownloadIdsFromBase(UUID gdprProcedureId) {
    log.info("Fetching download IDs for GdprProcedureId: {}", gdprProcedureId);
    return baseGdprProcedureApi.getDownloads(gdprProcedureId);
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

  public GdprIdentificationDataDto getGdprIdentificationData(UUID gdprId) {
    return baseGdprProcedureApi.getGdprProcedure(gdprId).identificationData();
  }

  public OpenTaskSummary getOpenGdprValidationTaskSummary() {
    OpenTaskSummaryRawData summaryRawData = validationTaskRepository.getOpenTaskSummary();
    return toOpenTaskSummary(summaryRawData);
  }

  private static OpenTaskSummary toOpenTaskSummary(OpenTaskSummaryRawData summaryRawData) {
    LocalDate earliestDueDate = toDueDate(summaryRawData.getOldestStartDate());
    return new OpenTaskSummary(summaryRawData.getCount(), earliestDueDate);
  }

  public static LocalDate toDueDate(Instant startedAt) {
    if (startedAt == null) {
      return null;
    }
    LocalDate startDate = startedAt.atOffset(ZoneOffset.UTC).toLocalDate();
    return startDate.plusDays(30);
  }

  public List<BusinessProcedureWithInclusionStatusDto> getBusinessProceduresWithInclusionStatus(
      UUID gdprId, List<UUID> fileStateIds) {
    GetGdprDownloadsResponse downloadIdsFromBase = fetchDownloadIdsFromBase(gdprId);
    List<UUID> knownProcedureIds =
        findBusinessProcedureIdsByDownloadIdIn(downloadIdsFromBase.downloadIds());

    List<ProcedureT> procedures = procedureRepository.findByFileStateIds(fileStateIds);
    List<ProcedureDto> enrichedProcedures = enrichingMapper.enrichAndMapProcedures(procedures);
    return enrichedProcedures.stream()
        .map(
            eP ->
                new BusinessProcedureWithInclusionStatusDto(
                    eP, getInclusionStatus(eP.procedureId(), knownProcedureIds)))
        .toList();
  }

  private static BusinessProcedureInclusionStatusDto getInclusionStatus(
      UUID id, List<UUID> includedIds) {
    return includedIds.contains(id)
        ? BusinessProcedureInclusionStatusDto.INCLUDED
        : BusinessProcedureInclusionStatusDto.UNDECIDED;
  }

  public void closeTask(UUID gdprProcedureId) {
    GdprValidationTask task = getTaskForUpdate(gdprProcedureId);
    if (CLOSED != task.getStatus()) {
      log.info("Closing GdprProcedure with gdprProcedureId: {}", gdprProcedureId);
      task.setStatus(CLOSED);
      task.setClosedAt(clock.instant());
      writeAuditLog("Schließen Prüfauftrag", mapAuditLog(task));
    }
  }

  private GdprValidationTask getTaskForUpdate(UUID gdprProcedureId) {
    return validationTaskRepository
        .findByExternalIdForUpdate(gdprProcedureId)
        .orElseThrow(() -> new NotFoundException("GdprValidationTask not found."));
  }

  public Page<GdprValidationTask> findAll(
      GdprValidationTaskStatus status, PaginationUtil.PageSpec pageSpec) {
    Specification<GdprValidationTask> specification = Specification.allOf(hasStatus(status));

    return validationTaskRepository.findAll(
        specification,
        PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize(), Sort.by(pageSpec.order())));
  }

  private static Specification<GdprValidationTask> hasStatus(GdprValidationTaskStatus status) {
    if (status == null) {
      return (root, query, builder) -> builder.and();
    }
    return (root, query, cb) -> cb.equal(root.get(GdprValidationTask_.status), status);
  }

  public void writeAuditLog(String operationName, Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log(AUDITLOG_CATEGORY, operationName, attributes);
  }

  public Map<String, String> mapAuditLog(GdprValidationTask task) {
    return Map.of("Prüfauftrag ID", task.getGdprProcedureId().toString());
  }

  public boolean findDownloadPackageByGdprIdAndProcedureId(
      UUID gdprProcedureId, UUID businessProcedureId) {
    GetGdprDownloadsResponse downloadIdsFromBase = fetchDownloadIdsFromBase(gdprProcedureId);
    return downloadPackageRepository.existsByBusinessProcedureIdAndExternalIdIn(
        businessProcedureId, downloadIdsFromBase.downloadIds());
  }
}
