/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateWithDataSourcesRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateInfoDto;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateSortKey;
import de.eshg.statistics.api.evaluationtemplate.GetAllMinimalEvaluationTemplateInfosResponse;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesRequest;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesResponse;
import de.eshg.statistics.api.evaluationtemplate.UpdateEvaluationTemplateRequest;
import de.eshg.statistics.config.OriginalDataAccessConfig;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.EvaluationTemplateMapper;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate_;
import de.eshg.statistics.persistence.repository.EvaluationTemplateRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvaluationTemplateService {
  private final EvaluationTemplateRepository evaluationTemplateRepository;
  private final StatisticsUserService userService;
  private final Clock clock;
  private final OriginalDataAccessConfig originalDataAccessConfig;

  public EvaluationTemplateService(
      EvaluationTemplateRepository evaluationTemplateRepository,
      StatisticsUserService userService,
      Clock clock,
      OriginalDataAccessConfig originalDataAccessConfig) {
    this.evaluationTemplateRepository = evaluationTemplateRepository;
    this.userService = userService;
    this.clock = clock;
    this.originalDataAccessConfig = originalDataAccessConfig;
  }

  @Transactional
  public EvaluationTemplateDto addEvaluationTemplate(
      String name,
      String description,
      EvaluationTemplateData evaluationTemplateData,
      List<AvailableDataSource> availableDataSources) {
    EvaluationTemplate evaluationTemplate =
        evaluationTemplateRepository.save(
            EvaluationTemplateMapper.mapToPersistence(
                name, description, evaluationTemplateData, availableDataSources));
    return getEvaluationTemplateDto(evaluationTemplate);
  }

  private boolean withoutAnonymizationAllowed(EvaluationTemplate evaluationTemplate) {
    Set<String> businessModules =
        evaluationTemplate.getDataSources().stream()
            .map(DataSource::getBusinessModuleName)
            .collect(Collectors.toSet());
    return originalDataAccessConfig
        .getBusinessModulesOriginalDataAllowedForCurrentUser()
        .containsAll(businessModules);
  }

  @Transactional
  public EvaluationTemplateDto addEvaluationTemplate(
      AddEvaluationTemplateWithDataSourcesRequest addEvaluationTemplateWithDataSourcesRequest,
      List<AvailableDataSource> availableDataSources) {
    EvaluationTemplate evaluationTemplate =
        evaluationTemplateRepository.save(
            EvaluationTemplateMapper.mapToPersistence(
                addEvaluationTemplateWithDataSourcesRequest.name(),
                addEvaluationTemplateWithDataSourcesRequest.dataSources(),
                availableDataSources));
    return getEvaluationTemplateDto(evaluationTemplate);
  }

  @Transactional
  public EvaluationTemplateDto updateEvaluationTemplate(
      UUID templateId, UpdateEvaluationTemplateRequest updateEvaluationTemplateRequest) {
    EvaluationTemplate evaluationTemplate = getEvaluationTemplateInternal(templateId);
    evaluationTemplate.setName(updateEvaluationTemplateRequest.name());
    evaluationTemplate.setDescription(updateEvaluationTemplateRequest.description());
    return getEvaluationTemplateDto(evaluationTemplate);
  }

  @Transactional(readOnly = true)
  public GetAllMinimalEvaluationTemplateInfosResponse getAllEvaluationTemplates() {
    List<EvaluationTemplate> evaluationTemplates = evaluationTemplateRepository.findAll();

    return new GetAllMinimalEvaluationTemplateInfosResponse(
        evaluationTemplates.stream()
            .sorted(
                Comparator.comparing(EvaluationTemplate::getName)
                    .thenComparing(EvaluationTemplate::getId))
            .map(EvaluationTemplateMapper::mapToMinimalInfo)
            .toList());
  }

  @Transactional(readOnly = true)
  public GetEvaluationTemplatesResponse getEvaluationTemplates(
      GetEvaluationTemplatesRequest getEvaluationTemplatesRequest) {
    PageRequest pageRequest =
        PageRequest.of(
            getEvaluationTemplatesRequest.page(),
            getEvaluationTemplatesRequest.pageSize(),
            Sort.by(
                EvaluationMapper.mapSortDirection(getEvaluationTemplatesRequest.sortDirection()),
                mapSortKey(getEvaluationTemplatesRequest.sortKey()),
                BaseEntity_.ID));

    Page<EvaluationTemplate> evaluationTemplatePage =
        evaluationTemplateRepository.findAll(pageRequest);
    List<EvaluationTemplateInfoDto> evaluationTemplateDtos =
        evaluationTemplatePage.get().map(EvaluationTemplateMapper::mapToInfo).toList();

    Map<UUID, UserDto> resolvedUsers =
        userService.getResolvedUsers(
            evaluationTemplateDtos.stream()
                .map(EvaluationTemplateInfoDto::userId)
                .collect(Collectors.toSet()));

    return new GetEvaluationTemplatesResponse(
        evaluationTemplateDtos, resolvedUsers, evaluationTemplatePage.getTotalElements());
  }

  private static String mapSortKey(EvaluationTemplateSortKey sortKey) {
    return switch (sortKey) {
      case NAME -> EvaluationTemplate_.NAME;
      case ANALYSIS_COUNT -> EvaluationTemplate_.ANALYSIS_COUNT;
      case CREATED_AT -> EvaluationTemplate_.CREATED_AT;
    };
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateDto getEvaluationTemplate(UUID templateId) {
    EvaluationTemplate evaluationTemplate = getEvaluationTemplateInternal(templateId);
    return getEvaluationTemplateDto(evaluationTemplate);
  }

  private EvaluationTemplateDto getEvaluationTemplateDto(EvaluationTemplate evaluationTemplate) {
    return EvaluationTemplateMapper.mapToApi(
        evaluationTemplate,
        withoutAnonymizationAllowed(evaluationTemplate),
        userService.findUser(evaluationTemplate.getCreatedByUserId()));
  }

  @Transactional
  public void deleteEvaluationTemplate(UUID templateId) {
    evaluationTemplateRepository.delete(getEvaluationTemplateInternal(templateId));
  }

  public EvaluationTemplate getEvaluationTemplateInternal(UUID templateId) {
    return evaluationTemplateRepository
        .findByExternalId(templateId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Evaluation template with id %s not found".formatted(templateId)));
  }

  public void setLastUsageToNow(UUID templateId) {
    evaluationTemplateRepository
        .findByExternalId(templateId)
        .ifPresent(evaluationTemplate -> evaluationTemplate.setLastUsageAt(Instant.now(clock)));
  }
}
