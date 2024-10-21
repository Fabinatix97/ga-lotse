/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.api.AvailableDataSource;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateFromEvaluationRequest;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateWithDataSourcesRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.EvaluationTemplateMapper;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.repository.EvaluationTemplateRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvaluationTemplateService {
  private final EvaluationTemplateRepository evaluationTemplateRepository;
  private final Clock clock;

  public EvaluationTemplateService(
      EvaluationTemplateRepository evaluationTemplateRepository, Clock clock) {
    this.evaluationTemplateRepository = evaluationTemplateRepository;
    this.clock = clock;
  }

  @Transactional
  public EvaluationTemplateDto addEvaluationTemplate(
      AddEvaluationTemplateFromEvaluationRequest addEvaluationTemplateFromEvaluationRequest,
      EvaluationTemplateData evaluationTemplateData,
      List<AvailableDataSource> availableDataSources) {
    EvaluationTemplate evaluationTemplate =
        evaluationTemplateRepository.save(
            EvaluationTemplateMapper.mapToPersistence(
                addEvaluationTemplateFromEvaluationRequest.name(),
                evaluationTemplateData,
                availableDataSources));
    return EvaluationTemplateMapper.mapToApi(evaluationTemplate);
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
    return EvaluationTemplateMapper.mapToApi(evaluationTemplate);
  }

  @Transactional(readOnly = true)
  public List<EvaluationTemplateDto> getAllEvaluationTemplates() {
    List<EvaluationTemplate> evaluationTemplates =
        evaluationTemplateRepository.findAll(Sort.by(Sort.Direction.DESC, BaseEntity_.ID));

    return evaluationTemplates.stream().map(EvaluationTemplateMapper::mapToApi).toList();
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateDto getEvaluationTemplate(UUID templateId) {
    EvaluationTemplate evaluationTemplate = getEvaluationTemplateInternal(templateId);
    return EvaluationTemplateMapper.mapToApi(evaluationTemplate);
  }

  @Transactional
  public void deleteEvaluationTemplate(UUID templateId) {
    evaluationTemplateRepository.delete(getEvaluationTemplateInternal(templateId));
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
