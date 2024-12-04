/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.PrettyPrinter;
import com.fasterxml.jackson.core.util.MinimalPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.eshg.centralrepository.client.CentralRepositoryRestClient;
import de.eshg.lib.centralrepository.api.ContentRequestDto;
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
import java.util.Optional;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class StatisticsCentralRepositoryService {
  private static final String MODULE_NAME = "statistics";
  private static final String EVALUATION_TEMPLATE = "evaluation-template";

  private static final Logger log =
      LoggerFactory.getLogger(StatisticsCentralRepositoryService.class);

  private final EvaluationTemplateService evaluationTemplateService;
  private final CentralRepositoryRestClient centralRepositoryRestClient;
  private final ObjectMapper objectMapper;
  private final PrettyPrinter minimalPrettyPrinter = new MinimalPrettyPrinter();

  public StatisticsCentralRepositoryService(
      EvaluationTemplateService evaluationTemplateService,
      CentralRepositoryRestClient centralRepositoryRestClient,
      ObjectMapper objectMapper) {
    this.evaluationTemplateService = evaluationTemplateService;
    this.centralRepositoryRestClient = centralRepositoryRestClient;
    this.objectMapper = objectMapper;
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateFromRepository uploadEvaluationTemplateToRepository(
      AddEvaluationTemplateToRepositoryRequest request) {
    EvaluationTemplate evaluationTemplate =
        evaluationTemplateService.getEvaluationTemplateInternal(request.templateId());

    MultiValueMap<String, Object> parts =
        createMultiValueBody(
            RepoMapper.mapToRepo(evaluationTemplate, request.name(), request.description()),
            request.changelog(),
            request.contact());

    MetadataResponseDto metadataResponseDto =
        callCentralRepositoryGetBody(
            () -> centralRepositoryRestClient.createEntry(MODULE_NAME, EVALUATION_TEMPLATE, parts));

    return RepoMapper.mapFromMetaData(metadataResponseDto);
  }

  private MultiValueMap<String, Object> createMultiValueBody(
      RepoEvaluationTemplate evaluationTemplate, String changelog, String contact) {
    MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
    String jsonContent;
    try {
      jsonContent =
          objectMapper.writer(minimalPrettyPrinter).writeValueAsString(evaluationTemplate);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Failed to convert content to JSON", e);
    }
    setMetaData(parts, RepoMapper.mapToMetaData(evaluationTemplate, changelog, contact));
    setJsonContent(parts, jsonContent);
    return parts;
  }

  private static void setMetaData(
      MultiValueMap<String, Object> parts, MetadataRequestDto metadataRequest) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    parts.add("metadata", new HttpEntity<>(metadataRequest, headers));
  }

  private static void setJsonContent(MultiValueMap<String, Object> parts, String jsonContent) {
    ContentRequestDto contentRequest =
        new ContentRequestDto(MediaType.APPLICATION_JSON_VALUE, jsonContent, null);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    parts.add("content", new HttpEntity<>(contentRequest, headers));
  }

  public GetEvaluationTemplatesFromRepositoryResponse getEvaluationTemplatesFromRepository() {
    MetadataListResponseDto metadataListResponseDto =
        callCentralRepositoryGetBody(
            () ->
                centralRepositoryRestClient.getMetadataOfVersionsWithModuleAndObjectName(
                    MODULE_NAME, EVALUATION_TEMPLATE, VersionFilterType.ALL));
    return RepoMapper.mapFromMetaData(metadataListResponseDto);
  }

  public EvaluationTemplateDetailsFromRepository getEvaluationTemplateFromRepository(
      long id, int version) {
    MetadataResponseDto metadataResponseDto =
        callCentralRepositoryGetBody(
            () ->
                centralRepositoryRestClient.getMetadataOfOneVersion(
                    MODULE_NAME, EVALUATION_TEMPLATE, id, version));
    RepoEvaluationTemplate repoEvaluationTemplate = getRepoEvaluationTemplate(id, version);
    return RepoMapper.mapToDetails(metadataResponseDto, repoEvaluationTemplate);
  }

  public RepoEvaluationTemplate getRepoEvaluationTemplate(long id, int version) {
    ContentRequestDto contentRequestDto =
        callCentralRepositoryGetBody(
            () ->
                centralRepositoryRestClient.getContentOfOneVersion(
                    MODULE_NAME, EVALUATION_TEMPLATE, id, version, ContentRequestDto.class));

    RepoEvaluationTemplate repoEvaluationTemplate;
    try {
      repoEvaluationTemplate =
          objectMapper.readValue(contentRequestDto.jsonContent(), RepoEvaluationTemplate.class);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Failed to read content from repo", e);
    }
    return repoEvaluationTemplate;
  }

  public void deleteEvaluationTemplateFromRepository(long id, int version) {
    callCentralRepository(
        () ->
            centralRepositoryRestClient.setOneVersionOfAnEntryAsDeleted(
                MODULE_NAME, EVALUATION_TEMPLATE, id, version));
  }

  private <T> T callCentralRepositoryGetBody(Supplier<ResponseEntity<T>> supplier) {
    ResponseEntity<T> responseEntity = callCentralRepository(supplier);
    return Optional.ofNullable(responseEntity.getBody())
        .orElseThrow(() -> new IllegalStateException("Central repository response body was empty"));
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
