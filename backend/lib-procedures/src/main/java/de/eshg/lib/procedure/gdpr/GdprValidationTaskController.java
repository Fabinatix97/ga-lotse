/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import static de.eshg.lib.procedure.mapping.GdprValidationTaskMapper.mapToApi;
import static de.eshg.lib.procedure.mapping.GdprValidationTaskMapper.mapToDm;
import static de.eshg.lib.procedure.mapping.GdprValidationTaskMapper.mapToPageSpec;

import de.eshg.base.SortDirection;
import de.eshg.base.gdpr.api.GdprIdentificationDataDto;
import de.eshg.base.util.PaginationUtil;
import de.eshg.domain.model.serialization.SerializationService;
import de.eshg.domain.model.serialization.ZipEditor;
import de.eshg.file.common.CustomMediaTypes;
import de.eshg.lib.procedure.api.GdprValidationTaskApi;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.repository.GdprDownloadPackageInfo;
import de.eshg.lib.procedure.mapping.GdprValidationTaskMapper;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.DeleteDownloadPackagesRequest;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskDto;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskFilterParameters;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskSortKey;
import de.eshg.lib.procedure.model.gdpr.GetAllValidationTasksResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprDownloadPackagesInfoResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprNotificationBannerResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskDetailsResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.persistence.IntentionalWritingTransaction;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "GdprValidationTask")
public class GdprValidationTaskController<
        ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>>
    implements GdprValidationTaskApi {

  private static final Logger log = LoggerFactory.getLogger(GdprValidationTaskController.class);
  private final GdprValidationTaskService<ProcedureT, TaskT> service;
  private final SerializationService serializationService;
  private final AbstractGdprZipEditorProvider zipEditorProvider;
  private final ProcedureDeletionService<ProcedureT> procedureDeletionService;

  public GdprValidationTaskController(
      GdprValidationTaskService<ProcedureT, TaskT> service,
      SerializationService serializationService,
      AbstractGdprZipEditorProvider zipEditorProvider,
      ProcedureDeletionService<ProcedureT> procedureDeletionService) {
    this.service = service;
    this.serializationService = serializationService;
    this.zipEditorProvider = zipEditorProvider;
    this.procedureDeletionService = procedureDeletionService;
  }

  @Override
  @Transactional
  public void addGdprValidationTask(AddGdprValidationTaskRequest request) {
    if (service.validationTaskAlreadyExists(request)) {
      return;
    }

    List<UUID> fileStateIdsToSearch = service.getAndValidateFileStateIds(request.gdprProcedureId());
    GdprValidationTask validationTask = GdprValidationTaskMapper.mapGdprValidationTaskToDm(request);
    service.searchBusinessProceduresAndUpdateValidationTask(fileStateIdsToSearch, validationTask);
    service.add(validationTask);
  }

  @Override
  @Transactional
  public void closeGdprValidationTask(UUID gdprProcedureId) {
    service.closeTask(gdprProcedureId);
  }

  @Override
  @Transactional
  public void addDownloadPackage(UUID gdprProcedureId, UUID businessProcedureId) {
    GdprValidationTask validationTask = service.getValidationTaskFromDb(gdprProcedureId);
    validateType(validationTask, GdprValidationTaskType.RIGHT_OF_ACCESS);
    validateStatus(validationTask, GdprValidationTaskStatus.OPEN);
    if (checkDownloadExistsAndLog(gdprProcedureId, businessProcedureId)) {
      return;
    }

    Procedure<?, ?, ?, ?> procedure = service.getBusinessProcedureFromDb(businessProcedureId);
    List<UUID> fileStateIds =
        service.getFileStateIdsAndValidateLink(gdprProcedureId, businessProcedureId);

    log.info(
        "Attempting to create a zip of procedure(id={}) for gdprProcedure(id={})",
        businessProcedureId,
        gdprProcedureId);

    String identificationDataHash = service.getIdentificationDataHash(gdprProcedureId);

    ZipEditor zipEditor = zipEditorProvider.create(fileStateIds);
    byte[] zip =
        serializationService.toZip(
            "DSGVO-Vorgang_" + businessProcedureId,
            procedure,
            zipEditor,
            SerializationUtil.createNormalizedSequenceIdObjectMapperCustomizer());
    UUID downloadId =
        service
            .createAndSaveDownloadPackage(businessProcedureId, identificationDataHash, zip)
            .getExternalId();
    service.sendDownloadId(gdprProcedureId, downloadId);
    service.writeAuditLog("Erstellung DSGVO Datenpaket", mapAuditlog(validationTask, procedure));
    log.info(
        "Created downloadPackage of procedure(id={}) for gdprProcedure(id={})",
        businessProcedureId,
        gdprProcedureId);
  }

  private boolean checkDownloadExistsAndLog(UUID gdprProcedureId, UUID businessProcedureId) {
    boolean downloadExists =
        service.findDownloadPackageByGdprIdAndProcedureId(gdprProcedureId, businessProcedureId);
    if (downloadExists) {
      log.info(
          "DownloadPackage of procedure(id={}) for gdprProcedure(id={}) already exists",
          businessProcedureId,
          gdprProcedureId);
    }
    return downloadExists;
  }

  private Map<String, String> mapAuditlog(
      GdprValidationTask validationTask, Procedure<?, ?, ?, ?> procedure) {
    return Map.of(
        "DSGVO Vorgang ID",
        validationTask.getGdprProcedureId().toString(),
        "Fachmodul Vorgang ID",
        procedure.getExternalId().toString());
  }

  private static void validateType(
      GdprValidationTask validationTask, GdprValidationTaskType gdprValidationTaskType) {
    if (!validationTask.getType().equals(gdprValidationTaskType)) {
      throw new BadRequestException("The GdprValidationTask has an invalid type");
    }
  }

  private static void validateStatus(
      GdprValidationTask validationTask, GdprValidationTaskStatus gdprValidationTaskStatus) {
    if (validationTask.getStatus() != gdprValidationTaskStatus) {
      throw new BadRequestException("The GdprValidationTask has an invalid Status");
    }
  }

  @Override
  public GetGdprNotificationBannerResponse getGdprNotificationBanner() {
    return GdprValidationTaskMapper.mapToValidationBannerResponse(
        service.getOpenGdprValidationTaskSummary());
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprValidationTaskResponse getGdprValidationTask(UUID gdprId) {
    GdprValidationTask existingTask = service.getValidationTaskFromDb(gdprId);
    return new GetGdprValidationTaskResponse(
        GdprValidationTaskMapper.mapToApi(existingTask.getStatus()));
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprDownloadPackagesInfoResponse getGdprDownloadPackagesInfo(UUID gdprProcedureId) {
    validateGdprValidationTaskIsClosed(gdprProcedureId);
    List<GdprDownloadPackageInfo> downloadPackagesInfo =
        service.getDownloadPackagesInfo(gdprProcedureId);

    return GdprValidationTaskMapper.mapToApiResponse(downloadPackagesInfo);
  }

  private void validateGdprValidationTaskIsClosed(UUID gdprProcedureId) {
    GdprValidationTask validationTaskFromDb = service.getValidationTaskFromDb(gdprProcedureId);
    GdprValidationTaskStatus status = validationTaskFromDb.getStatus();
    if (status != GdprValidationTaskStatus.CLOSED) {
      logErrorValidationTaskIsNotClosed(gdprProcedureId, status);
      throw new BadRequestException("The GdprValidationTask has an invalid status.");
    }
  }

  private static void logErrorValidationTaskIsNotClosed(
      UUID gdprProcedureId, GdprValidationTaskStatus status) {
    log.error(
        "GdprValidationTask(gdprProcedureId={}) is not in status CLOSED. Status is {}.",
        gdprProcedureId,
        status);
  }

  @Override
  public ResponseEntity<Resource> getGdprDownloadPackage(UUID downloadId) {
    GdprDownloadPackage downloadPackage = service.getDownloadPackage(downloadId);
    byte[] content = downloadPackage.getContent();

    service.writeAuditLog("Abrufen DSGVO Datenpaket", mapAuditlog(downloadPackage));

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(downloadPackageFilename(downloadId), StandardCharsets.UTF_8)
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, CustomMediaTypes.ZIP_VALUE)
        .body(new ByteArrayResource(content));
  }

  private static String downloadPackageFilename(UUID id) {
    return "DSGVO_Download_Paket_%s.zip".formatted(id);
  }

  @Override
  @Transactional
  @IntentionalWritingTransaction(reason = "Audit logging")
  public GetGdprValidationTaskDetailsResponse getGdprValidationTaskDetails(UUID gdprId) {
    List<UUID> fileStateIds = service.getAndValidateFileStateIds(gdprId);
    GdprValidationTask existingTask = service.getValidationTaskFromDb(gdprId);

    service.writeAuditLog("Abrufen Daten Überprüfungsvorgang", service.mapAuditLog(existingTask));

    GdprValidationTaskDto validationTaskDto = getGdprValidationTaskDto(existingTask);
    return new GetGdprValidationTaskDetailsResponse(
        validationTaskDto,
        service.getBusinessProceduresWithInclusionStatus(
            gdprId, existingTask.getType(), fileStateIds));
  }

  private GdprValidationTaskDto getGdprValidationTaskDto(GdprValidationTask task) {
    GdprIdentificationDataDto identificationData =
        service.getGdprIdentificationData(task.getGdprProcedureId());
    return new GdprValidationTaskDto(
        task.getGdprProcedureId(),
        GdprValidationTaskMapper.mapToApi(task.getStatus()),
        GdprValidationTaskService.toDueDate(task.getStartedAt()),
        identificationData,
        mapToApi(task.getType()));
  }

  @Override
  @Transactional(readOnly = true)
  public GetAllValidationTasksResponse getAllGdprValidationTasks(
      GdprValidationTaskFilterParameters parameters) {
    PaginationUtil.PageSpec pageSpec =
        mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(GdprValidationTaskSortKey.CREATED_AT),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    Page<GdprValidationTask> validationTasks =
        service.findAll(mapToDm(parameters.status()), pageSpec);
    List<GdprValidationTaskDto> validationTaskDtos =
        validationTasks.stream().map(this::getGdprValidationTaskDto).toList();

    return new GetAllValidationTasksResponse(
        validationTaskDtos, validationTasks.getTotalElements());
  }

  @Override
  @Transactional
  public void deleteBusinessProcedure(UUID gdprProcedureId, UUID businessProcedureId) {
    GdprValidationTask validationTask = service.getValidationTaskFromDb(gdprProcedureId);
    validateType(validationTask, GdprValidationTaskType.RIGHT_TO_ERASURE);
    validateStatus(validationTask, GdprValidationTaskStatus.OPEN);

    Optional<ProcedureT> businessProcedure =
        service.getBusinessProcedure(businessProcedureId, gdprProcedureId);
    if (businessProcedure.isEmpty()) {
      log.info("To be deleted business procedure not found.");
      return;
    }

    service.writeAuditLog(
        "Löschung Fachmodul Vorgang", mapAuditlog(validationTask, businessProcedure.get()));

    procedureDeletionService.deleteAndWriteToCemetery(businessProcedure.get(), Period.ZERO);
  }

  @Override
  @Transactional
  public void deleteGdprValidationTaskAndDownloadPackages(
      UUID gdprProcedureId, DeleteDownloadPackagesRequest request) {
    Optional<GdprValidationTask> validationTask = service.findValidationTask(gdprProcedureId);
    if (validationTask.isPresent()) {
      validateStatus(validationTask.get(), GdprValidationTaskStatus.CLOSED);

      service.writeAuditLog("Prüfauftrag löschen", service.mapAuditLog(validationTask.get()));
      service.deleteValidationTask(gdprProcedureId);
    } else {
      log.info("To be deleted validation task not found.");
    }

    service.writeAuditLog(
        "Löschen DSGVO Datenpakete", mapAuditlog(request.downloadIds(), "Datenpakete IDs"));
    service.deleteDownloadPackages(request.downloadIds());
  }

  private Map<String, String> mapAuditlog(List<UUID> ids, String message) {
    return Map.of(message, ids.stream().map(UUID::toString).collect(Collectors.joining(", ")));
  }

  private Map<String, String> mapAuditlog(GdprDownloadPackage downloadPackage) {
    return Map.of("Datenpaket", downloadPackage.getExternalId().toString());
  }
}
