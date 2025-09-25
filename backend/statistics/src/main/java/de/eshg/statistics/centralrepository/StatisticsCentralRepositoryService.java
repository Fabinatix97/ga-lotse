/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository;

import static de.eshg.centralrepository.client.JsonToResourceHelper.createResourceWithSizeForJsonString;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.centralrepository.client.JsonToResourceHelper.ResourceStream;
import de.eshg.lib.centralrepository.CentralRepositoryApi;
import de.eshg.lib.centralrepository.api.MetadataListResponseDto;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.lib.centralrepository.api.VersionFilterType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.EshgBusinessException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.EvaluationTemplateService;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateToRepositoryRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDetailsFromRepository;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateFromRepository;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesFromRepositoryResponse;
import de.eshg.statistics.centralrepository.dto.evaluationtemplate.RepoEvaluationTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import java.io.IOException;
import java.io.InputStream;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class StatisticsCentralRepositoryService {
  private static final String MODULE_NAME = "statistics";
  private static final String EVALUATION_TEMPLATE = "evaluation-template";

  private static final Logger log =
      LoggerFactory.getLogger(StatisticsCentralRepositoryService.class);

  private final EvaluationTemplateService evaluationTemplateService;
  private final CentralRepositoryApi centralRepositoryApi;
  private final ObjectMapper objectMapper;

  public StatisticsCentralRepositoryService(
      EvaluationTemplateService evaluationTemplateService,
      CentralRepositoryApi centralRepositoryApi,
      ObjectMapper objectMapper) {
    this.evaluationTemplateService = evaluationTemplateService;
    this.centralRepositoryApi = centralRepositoryApi;
    this.objectMapper = objectMapper;
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateFromRepository uploadEvaluationTemplateToRepository(
      AddEvaluationTemplateToRepositoryRequest request) {
    EvaluationTemplate evaluationTemplate =
        evaluationTemplateService.getEvaluationTemplateInternal(request.templateId());

    RepoEvaluationTemplate repoEvaluationTemplate =
        RepoMapper.mapToRepo(evaluationTemplate, request.name(), request.description());

    MetadataRequestDto metadataRequestDto =
        RepoMapper.mapToMetaData(repoEvaluationTemplate, request.changelog(), request.contact());

    ResourceStream resource =
        createResourceWithSizeForJsonString(repoEvaluationTemplate, objectMapper);

    MetadataResponseDto metadataResponseDto =
        callCentralRepository(
            () ->
                centralRepositoryApi.createEntry(
                    MODULE_NAME,
                    EVALUATION_TEMPLATE,
                    metadataRequestDto,
                    APPLICATION_JSON_VALUE,
                    resource.size(),
                    resource.stream()));

    return RepoMapper.mapFromMetaData(metadataResponseDto);
  }

  public GetEvaluationTemplatesFromRepositoryResponse getEvaluationTemplatesFromRepository() {
    MetadataListResponseDto metadataListResponseDto =
        callCentralRepository(
            () ->
                centralRepositoryApi.getMetadataOfVersionsWithModuleAndObjectName(
                    MODULE_NAME, EVALUATION_TEMPLATE, VersionFilterType.ALL, null, null, null));
    return RepoMapper.mapFromMetaData(metadataListResponseDto);
  }

  public EvaluationTemplateDetailsFromRepository getEvaluationTemplateFromRepository(
      long id, int version) {
    MetadataResponseDto metadataResponseDto =
        callCentralRepository(
            () ->
                centralRepositoryApi.getMetadataOfOneVersion(
                    MODULE_NAME, EVALUATION_TEMPLATE, id, version));
    RepoEvaluationTemplate repoEvaluationTemplate = getRepoEvaluationTemplate(id, version);
    return RepoMapper.mapToDetails(metadataResponseDto, repoEvaluationTemplate);
  }

  public RepoEvaluationTemplate getRepoEvaluationTemplate(long id, int version) {
    ResponseEntity<Resource> response =
        callCentralRepository(
            () ->
                centralRepositoryApi.getContentOfOneVersion(
                    MODULE_NAME, EVALUATION_TEMPLATE, id, version));
    if (response.getBody() == null) {
      throw new IllegalStateException("Central repository response body was empty");
    }

    RepoEvaluationTemplate repoEvaluationTemplate;
    try (InputStream inputStream = response.getBody().getInputStream()) {
      repoEvaluationTemplate = objectMapper.readValue(inputStream, RepoEvaluationTemplate.class);
    } catch (IOException e) {
      throw new IllegalStateException("Failed to read content from repo", e);
    }
    return repoEvaluationTemplate;
  }

  public void deleteEvaluationTemplateFromRepository(long id, int version) {
    callCentralRepository(
        () -> {
          centralRepositoryApi.setOneVersionOfAnEntryAsDeleted(
              MODULE_NAME, EVALUATION_TEMPLATE, id, version);
          return null;
        });
  }

  private <R> R callCentralRepository(Supplier<R> supplier) {
    EshgBusinessException exception;
    try {
      return supplier.get();
    } catch (HttpClientErrorException.Unauthorized unauthorized) {
      String message = "Not allowed to call central repository";
      log.error(message, unauthorized);
      exception = new BadRequestException(ErrorCode.UNAUTHORIZED, message);
    } catch (HttpClientErrorException.BadRequest badRequest) {
      String message = "Call to central repository failed";
      log.error(message, badRequest);
      exception = new BadRequestException("%s: %s".formatted(message, badRequest.getMessage()));
    } catch (HttpClientErrorException.NotFound notFound) {
      String message = "Entry not found";
      log.error(message, notFound);
      exception = new NotFoundException("%s: %s".formatted(message, notFound.getMessage()));
    }
    throw exception;
  }
}
