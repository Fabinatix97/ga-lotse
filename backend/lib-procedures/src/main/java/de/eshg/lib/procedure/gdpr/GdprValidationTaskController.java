/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import static de.eshg.lib.procedure.BaseFeatureTogglesHelper.assertNewFeatureEnabled;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.base.gdpr.api.AddGdprDownloadsRequest;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.api.GdprValidationTaskApi;
import de.eshg.lib.procedure.domain.model.GdprDownloadPackage;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.serialization.SerializationService;
import de.eshg.lib.procedure.mapping.GdprValidationTaskMapper;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.lib.procedure.model.gdpr.GetGdprNotificationBannerResponse;
import de.eshg.lib.procedure.model.gdpr.GetGdprValidationTaskResponse;
import de.eshg.lib.procedure.model.gdpr.GetRelatedBusinessProceduresResponse;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "GdprValidationTask")
public class GdprValidationTaskController<
        ProcedureT extends Procedure<ProcedureT, TaskT, ?, ?>, TaskT extends Task<ProcedureT>>
    implements GdprValidationTaskApi {

  private static final Logger log = LoggerFactory.getLogger(GdprValidationTaskController.class);
  private final GdprValidationTaskService<ProcedureT, TaskT> service;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final GdprProcedureApi baseGdprProcedureApi;
  private final SerializationService serializationService;
  private final AuditLogger auditLogger;

  public GdprValidationTaskController(
      GdprValidationTaskService<ProcedureT, TaskT> service,
      GdprProcedureApi baseGdprProcedureApi,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      SerializationService serializationService,
      AuditLogger auditLogger) {
    this.service = service;
    this.baseGdprProcedureApi = baseGdprProcedureApi;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.serializationService = serializationService;
    this.auditLogger = auditLogger;
  }

  @Override
  @Transactional
  public void addGdprValidationTask(AddGdprValidationTaskRequest request) {
    assertNewFeatureEnabled(BaseFeature.GDPR, baseFeatureTogglesApi.getFeatureToggles());
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
  public void addDownloadPackage(UUID gdprProcedureId, UUID businessProcedureId) {
    assertNewFeatureEnabled(BaseFeature.GDPR, baseFeatureTogglesApi.getFeatureToggles());
    GdprValidationTask validationTask = service.getValidationTaskFromDb(gdprProcedureId);
    validateType(validationTask, GdprValidationTaskType.RIGHT_OF_ACCESS);
    validateStatus(validationTask, GdprValidationTaskStatus.OPEN);

    Procedure<?, ?, ?, ?> procedure = service.getBusinessProcedureFromDb(businessProcedureId);
    service.getFileStateIdsAndValidateLink(gdprProcedureId, businessProcedureId);

    log.info(
        "Attempting to create a zip of procedure(id={}) for gdprProcedure(id={})",
        businessProcedureId,
        gdprProcedureId);
    byte[] zip = serializationService.toZip("DSGVO-Vorgang_" + businessProcedureId, procedure);
    GdprDownloadPackage downloadPackage =
        service.createAndSaveDownloadPackage(businessProcedureId, zip);
    UUID downloadId = downloadPackage.getExternalId();
    baseGdprProcedureApi.addDownloads(
        gdprProcedureId, new AddGdprDownloadsRequest(Set.of(downloadId)));
    auditLogger.log(
        "DSGVO",
        "Erstellung DSGVO Datenpaket",
        Map.of(
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "ID des DSGVO-Vorgangs",
            gdprProcedureId.toString(),
            "ID des Fachmodule-Vorgangs",
            businessProcedureId.toString()));
    log.info(
        "Created downloadPackage of procedure(id={}) for gdprProcedure(id={})",
        businessProcedureId,
        gdprProcedureId);
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
    assertNewFeatureEnabled(BaseFeature.GDPR, baseFeatureTogglesApi.getFeatureToggles());
    return GdprValidationTaskMapper.mapToValidationBannerResponse(
        service.getOpenGdprValidationTaskSummary());
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprValidationTaskResponse getGdprValidationTask(UUID gdprId) {
    assertNewFeatureEnabled(BaseFeature.GDPR, baseFeatureTogglesApi.getFeatureToggles());
    return getAndMapGdprValidationTask(gdprId);
  }

  private GetGdprValidationTaskResponse getAndMapGdprValidationTask(UUID gdprId) {
    GdprValidationTask existingTask = service.getValidationTaskFromDb(gdprId);
    return new GetGdprValidationTaskResponse(
        GdprValidationTaskMapper.mapToApi(existingTask.getStatus()));
  }

  @Override
  @Transactional(readOnly = true)
  public GetRelatedBusinessProceduresResponse getRelatedBusinessProcedures(UUID gdprId) {
    assertNewFeatureEnabled(BaseFeature.GDPR, baseFeatureTogglesApi.getFeatureToggles());
    List<UUID> fileStateIds = service.getAndValidateFileStateIds(gdprId);

    GetGdprValidationTaskResponse validationTaskResponse = getAndMapGdprValidationTask(gdprId);

    return new GetRelatedBusinessProceduresResponse(
        validationTaskResponse, service.getBusinessProceduresWithInclusionStatus(fileStateIds));
  }
}
