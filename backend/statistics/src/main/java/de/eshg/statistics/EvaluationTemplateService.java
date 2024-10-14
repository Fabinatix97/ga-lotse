/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.aggregation.DataSourceAggregationService;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.api.AvailableDataSource;
import de.eshg.statistics.api.BaseDataSourceAttribute;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.mapper.EvaluationTemplateMapper;
import de.eshg.statistics.persistence.entity.evaluationtemplate.DataSource;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.repository.EvaluationTemplateRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvaluationTemplateService {
  private final EvaluationTemplateRepository evaluationTemplateRepository;
  private final DataSourceAggregationService dataSourceAggregationService;
  private final DataSourceValidator dataSourceValidator;
  private final Clock clock;

  public EvaluationTemplateService(
      EvaluationTemplateRepository evaluationTemplateRepository,
      DataSourceAggregationService dataSourceAggregationService,
      DataSourceValidator dataSourceValidator,
      Clock clock) {
    this.evaluationTemplateRepository = evaluationTemplateRepository;
    this.dataSourceAggregationService = dataSourceAggregationService;
    this.dataSourceValidator = dataSourceValidator;
    this.clock = clock;
  }

  @Transactional
  public EvaluationTemplateDto addEvaluationTemplate(
      AddEvaluationTemplateRequest addEvaluationTemplateRequest) {
    dataSourceValidator.validateDataSources(addEvaluationTemplateRequest.dataSources());

    EvaluationTemplate evaluationTemplate =
        evaluationTemplateRepository.save(
            EvaluationTemplateMapper.mapToPersistence(addEvaluationTemplateRequest));
    return EvaluationTemplateMapper.mapToApi(
        evaluationTemplate,
        getCodeToNameMappingsByDataSourceId(
            getGetAvailableDataSources(Collections.singletonList(evaluationTemplate))));
  }

  @Transactional(readOnly = true)
  public List<EvaluationTemplateDto> getAllEvaluationTemplates() {
    List<EvaluationTemplate> evaluationTemplates =
        evaluationTemplateRepository.findAll(Sort.by(Sort.Direction.DESC, BaseEntity_.ID));

    Map<UUID, List<AttributeCodeToNameMapping>> codeToNameMappings =
        getCodeToNameMappingsByDataSourceId(getGetAvailableDataSources(evaluationTemplates));

    return evaluationTemplates.stream()
        .map(
            evaluationTemplate ->
                EvaluationTemplateMapper.mapToApi(evaluationTemplate, codeToNameMappings))
        .toList();
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateDto getEvaluationTemplate(UUID templateId) {
    EvaluationTemplate evaluationTemplate = getEvaluationTemplateInternal(templateId);
    return EvaluationTemplateMapper.mapToApi(
        evaluationTemplate,
        getCodeToNameMappingsByDataSourceId(
            getGetAvailableDataSources(Collections.singletonList(evaluationTemplate))));
  }

  @Transactional
  public void deleteEvaluationTemplate(UUID templateId) {
    evaluationTemplateRepository.delete(getEvaluationTemplateInternal(templateId));
  }

  private List<AvailableDataSource> getGetAvailableDataSources(
      List<EvaluationTemplate> evaluationTemplates) {
    Set<String> relevantBusinessModules =
        evaluationTemplates.stream()
            .flatMap(template -> template.getDataSources().stream())
            .map(DataSource::getBusinessModuleName)
            .collect(Collectors.toSet());
    return dataSourceAggregationService
        .getAvailableDataSources(relevantBusinessModules)
        .availableDataSources();
  }

  private Map<UUID, List<AttributeCodeToNameMapping>> getCodeToNameMappingsByDataSourceId(
      List<AvailableDataSource> availableDataSources) {
    return availableDataSources.stream()
        .collect(Collectors.toMap(AvailableDataSource::id, this::getCodeToNameMappings));
  }

  private List<AttributeCodeToNameMapping> getCodeToNameMappings(
      AvailableDataSource availableDataSource) {
    return availableDataSource.attributes().stream()
        .map(
            dataSourceAttribute ->
                new AttributeCodeToNameMapping(
                    dataSourceAttribute.code(),
                    dataSourceAttribute.name(),
                    dataSourceAttribute.baseAttributes() == null
                        ? new HashMap<>()
                        : dataSourceAttribute.baseAttributes().stream()
                            .collect(
                                Collectors.toMap(
                                    BaseDataSourceAttribute::code, BaseDataSourceAttribute::name))))
        .toList();
  }

  private EvaluationTemplate getEvaluationTemplateInternal(UUID templateId) {
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
