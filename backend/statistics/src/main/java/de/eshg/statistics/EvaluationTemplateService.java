/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.aggregation.DataSourceAggregationService;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateWithDataSourcesRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateInfoDto;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateSortKey;
import de.eshg.statistics.api.evaluationtemplate.GetAllMinimalEvaluationTemplateInfosResponse;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesFilterOptions;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesRequest;
import de.eshg.statistics.api.evaluationtemplate.GetEvaluationTemplatesResponse;
import de.eshg.statistics.api.evaluationtemplate.UpdateEvaluationTemplateRequest;
import de.eshg.statistics.config.StatisticsConfig;
import de.eshg.statistics.config.StatisticsConfig.BusinessModuleConfig;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.EvaluationTemplateMapper;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource_;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate_;
import de.eshg.statistics.persistence.repository.EvaluationTemplateRepository;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

@Service
public class EvaluationTemplateService {
  private final EvaluationTemplateRepository evaluationTemplateRepository;
  private final StatisticsUserService userService;
  private final Clock clock;
  private final BusinessModuleConfig businessModuleConfig;
  private final DataSourceAggregationService dataSourceAggregationService;

  public EvaluationTemplateService(
      EvaluationTemplateRepository evaluationTemplateRepository,
      StatisticsUserService userService,
      Clock clock,
      StatisticsConfig statisticsConfig,
      DataSourceAggregationService dataSourceAggregationService) {
    this.evaluationTemplateRepository = evaluationTemplateRepository;
    this.userService = userService;
    this.clock = clock;
    this.businessModuleConfig = statisticsConfig.businessModule();
    this.dataSourceAggregationService = dataSourceAggregationService;
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

    List<Specification<EvaluationTemplate>> specifications = new ArrayList<>();
    GetEvaluationTemplatesFilterOptions filterOptions =
        getEvaluationTemplatesRequest.filterOptions();
    if (filterOptions != null) {
      OverviewSpecifications.<EvaluationTemplate>nameSpecification(
              filterOptions.name(), EvaluationTemplate_.NAME)
          .ifPresent(specifications::add);
      OverviewSpecifications.addDateSpecification(
          specifications, filterOptions.createdAt(), EvaluationTemplate_.CREATED_AT);
      addDataSourcesSpecification(specifications, filterOptions.dataSourceIds());
    }

    Page<EvaluationTemplate> evaluationTemplatePage =
        evaluationTemplateRepository.findAll(Specification.allOf(specifications), pageRequest);

    List<AvailableDataSource> availableDataSources =
        dataSourceAggregationService.getAvailableDataSources().availableDataSources();
    List<EvaluationTemplateInfoDto> evaluationTemplateDtos =
        evaluationTemplatePage
            .get()
            .map(
                evaluationTemplate ->
                    EvaluationTemplateMapper.mapToInfo(
                        evaluationTemplate,
                        this::sensitiveDataAllowed,
                        template -> getMostRestrictiveSensitivity(template, availableDataSources),
                        template -> getCanBeAnonymized(template, availableDataSources)))
            .toList();

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

  private void addDataSourcesSpecification(
      List<Specification<EvaluationTemplate>> specifications, List<UUID> dataSourceIds) {
    if (CollectionUtils.isEmpty(dataSourceIds)) {
      return;
    }

    specifications.add(
        (root, query, criteriaBuilder) -> {
          Assert.notNull(query, "CriteriaQuery must not be null");
          Subquery<DataSource> subquery = query.subquery(DataSource.class);
          Root<DataSource> dataSourceRoot = subquery.from(DataSource.class);

          subquery.select(dataSourceRoot);

          subquery.where(
              criteriaBuilder.and(
                  dataSourceRoot.get(DataSource_.EXTERNAL_DATA_SOURCE_ID).in(dataSourceIds),
                  criteriaBuilder.equal(
                      dataSourceRoot.get(DataSource_.EVALUATION_TEMPLATE), root)));

          return criteriaBuilder.exists(subquery);
        });
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateDto getEvaluationTemplate(UUID templateId) {
    EvaluationTemplate evaluationTemplate = getEvaluationTemplateInternal(templateId);
    return getEvaluationTemplateDto(evaluationTemplate);
  }

  private EvaluationTemplateDto getEvaluationTemplateDto(EvaluationTemplate evaluationTemplate) {
    List<AvailableDataSource> availableDataSources =
        dataSourceAggregationService.getAvailableDataSources().availableDataSources();
    return EvaluationTemplateMapper.mapToApi(
        evaluationTemplate,
        sensitiveDataAllowed(evaluationTemplate),
        getMostRestrictiveSensitivity(evaluationTemplate, availableDataSources),
        getCanBeAnonymized(evaluationTemplate, availableDataSources),
        userService.findUser(evaluationTemplate.getCreatedByUserId()));
  }

  private boolean sensitiveDataAllowed(EvaluationTemplate evaluationTemplate) {
    Set<String> businessModules =
        evaluationTemplate.getDataSources().stream()
            .map(DataSource::getBusinessModuleName)
            .collect(Collectors.toSet());
    return businessModuleConfig
        .getBusinessModulesSensitiveDataAllowedForCurrentUser()
        .containsAll(businessModules);
  }

  private DataSourceSensitivity getMostRestrictiveSensitivity(
      EvaluationTemplate evaluationTemplate, List<AvailableDataSource> availableDataSources) {
    if (anyDataSourceNotExisting(evaluationTemplate, availableDataSources)) {
      return null;
    }
    return DataSourceValidator.getMostRestrictiveSensitivity(
        getRelevantAvailableDataSources(evaluationTemplate, availableDataSources));
  }

  private boolean getCanBeAnonymized(
      EvaluationTemplate evaluationTemplate, List<AvailableDataSource> availableDataSources) {
    if (anyDataSourceNotExisting(evaluationTemplate, availableDataSources)) {
      return false;
    }
    return DataSourceValidator.getCanBeAnonymized(
        getRelevantAvailableDataSources(evaluationTemplate, availableDataSources));
  }

  private static boolean anyDataSourceNotExisting(
      EvaluationTemplate evaluationTemplate, List<AvailableDataSource> availableDataSources) {
    return evaluationTemplate.getDataSources().stream()
        .anyMatch(
            dataSource ->
                availableDataSources.stream()
                    .noneMatch(
                        availableDataSource -> isSameDataSource(dataSource, availableDataSource)));
  }

  private static List<AvailableDataSource> getRelevantAvailableDataSources(
      EvaluationTemplate evaluationTemplate, List<AvailableDataSource> availableDataSources) {
    return availableDataSources.stream()
        .filter(
            availableDataSource ->
                evaluationTemplate.getDataSources().stream()
                    .anyMatch(dataSource -> isSameDataSource(dataSource, availableDataSource)))
        .toList();
  }

  private static boolean isSameDataSource(
      DataSource dataSource, AvailableDataSource availableDataSource) {
    return availableDataSource.businessModuleName().equals(dataSource.getBusinessModuleName())
        && availableDataSource.id().equals(dataSource.getExternalDataSourceId());
  }

  @Transactional
  public void deleteEvaluationTemplate(UUID templateId) {
    evaluationTemplateRepository.delete(getEvaluationTemplateInternal(templateId));
  }

  public EvaluationTemplate getEvaluationTemplateInternal(UUID templateId) {
    return evaluationTemplateRepository
        .findByExternalId(templateId)
        .orElseThrow(() -> new NotFoundException("Evaluation template with given id not found"));
  }

  public void setLastUsageToNow(UUID templateId) {
    evaluationTemplateRepository
        .findByExternalId(templateId)
        .ifPresent(evaluationTemplate -> evaluationTemplate.setLastUsageAt(Instant.now(clock)));
  }
}
