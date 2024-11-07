/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.base.gdpr.GetGdprProcedureFileStateIdsResponse;
import de.eshg.lib.procedure.api.GdprValidationTaskApi;
import de.eshg.lib.procedure.domain.model.GdprValidationTask;
import de.eshg.lib.procedure.domain.model.GdprValidationTaskStatus;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import de.eshg.lib.procedure.mapping.GdprValidationTaskMapper;
import de.eshg.lib.procedure.model.gdpr.AddGdprValidationTaskRequest;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@Tag(name = "GdprValidationTask")
public class GdprValidationTaskController implements GdprValidationTaskApi {

  private final GdprValidationTaskService service;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;
  private final GdprProcedureApi baseGdprProcedureApi;
  private final ProcedureRepository<?> procedureRepository;

  public GdprValidationTaskController(
      GdprValidationTaskService service,
      GdprProcedureApi baseGdprProcedureApi,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      ProcedureRepository<?> procedureRepository) {
    this.service = service;
    this.baseGdprProcedureApi = baseGdprProcedureApi;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
    this.procedureRepository = procedureRepository;
  }

  @Override
  @Transactional
  public void addGdprValidationTask(AddGdprValidationTaskRequest request) {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.GDPR)) {
      throw new BadRequestException("New feature %s is not enabled".formatted(BaseFeature.GDPR));
    }
    GdprValidationTask procedure = GdprValidationTaskMapper.mapGdprValidationTaskToDm(request);
    GetGdprProcedureFileStateIdsResponse fileStateIds;
    try {
      fileStateIds = baseGdprProcedureApi.getFileStateIds(request.procedureId());
    } catch (HttpClientErrorException e) {
      throw new BadRequestException(
          "Error while getting file state ids from base: " + e.getMessage());
    }
    if (fileStateIds.facilityFileStateIds().isEmpty()
        && fileStateIds.personFileStateIds().isEmpty()) {
      throw new BadRequestException(
          "The base GDPR procedure %s does not have any file state"
              .formatted(request.procedureId()));
    } else if (fileStateIds.facilityFileStateIds().isEmpty()) {
      List<UUID> procedureIds =
          procedureRepository.findIdsByFileStateIds(fileStateIds.personFileStateIds());
      if (procedureIds.isEmpty()) {
        procedure.setStatus(GdprValidationTaskStatus.CLOSED);
      }
    } else if (fileStateIds.personFileStateIds().isEmpty()) {
      List<UUID> procedureIds =
          procedureRepository.findIdsByFileStateIds(fileStateIds.facilityFileStateIds());
      if (procedureIds.isEmpty()) {
        procedure.setStatus(GdprValidationTaskStatus.CLOSED);
      }
    } else {
      throw new IllegalStateException(
          "The base Gdpr procedure %s has BOTH facility and person file states associated with it"
              .formatted(request.procedureId()));
    }
    service.add(procedure);
  }
}
