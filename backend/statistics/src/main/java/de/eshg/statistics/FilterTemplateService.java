/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.rest.service.error.AlreadyExistsException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.aggregation.EvaluationService;
import de.eshg.statistics.api.filtertemplate.AddFilterTemplateRequest;
import de.eshg.statistics.api.filtertemplate.FilterTemplateDto;
import de.eshg.statistics.api.filtertemplate.FilterTemplateIdAndName;
import de.eshg.statistics.api.filtertemplate.GetFilterTemplatesForEvaluationResponse;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.FilterTemplate;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.repository.FilterTemplateRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FilterTemplateService {
  private final FilterTemplateRepository filterTemplateRepository;
  private final EvaluationService evaluationService;

  public FilterTemplateService(
      FilterTemplateRepository filterTemplateRepository, EvaluationService evaluationService) {
    this.filterTemplateRepository = filterTemplateRepository;
    this.evaluationService = evaluationService;
  }

  @Transactional
  public UUID addFilterTemplate(AddFilterTemplateRequest addFilterTemplateRequest) {
    if (filterTemplateRepository.findByName(addFilterTemplateRequest.name()).isPresent()) {
      throw new AlreadyExistsException(
          "A filter template with name '%s' already exists"
              .formatted(addFilterTemplateRequest.name()));
    }
    FilterTemplate filterTemplate = new FilterTemplate();
    filterTemplate.setName(addFilterTemplateRequest.name());
    filterTemplate.addFilters(
        addFilterTemplateRequest.filters().stream()
            .map(FilterParameterMapper::mapToPersistence)
            .toList());
    return filterTemplateRepository.save(filterTemplate).getExternalId();
  }

  @Transactional(readOnly = true)
  public FilterTemplateDto getFilterTemplate(UUID filterTemplateId) {
    FilterTemplate filterTemplate = getFilterTemplateInternal(filterTemplateId);
    return new FilterTemplateDto(
        filterTemplate.getExternalId(),
        filterTemplate.getName(),
        FilterParameterMapper.mapToApi(filterTemplate.getFilters()));
  }

  private FilterTemplate getFilterTemplateInternal(UUID filterTemplateId) {
    return filterTemplateRepository
        .findByExternalId(filterTemplateId)
        .orElseThrow(() -> new NotFoundException("FilterTemplate with given id not found"));
  }

  @Transactional(readOnly = true)
  public GetFilterTemplatesForEvaluationResponse findFilterTemplatesForEvaluation(
      UUID evaluationId) {
    Evaluation evaluation = evaluationService.getEvaluationInternal(evaluationId);
    List<String> allSearchKeys =
        evaluation.getTableColumns().stream().map(TableColumn::getSearchKey).toList();

    List<FilterTemplate> filterTemplates =
        filterTemplateRepository.findFilterTemplatesWithAllSearchKeysIn(allSearchKeys);

    return new GetFilterTemplatesForEvaluationResponse(
        filterTemplates.stream()
            .map(
                filterTemplate ->
                    new FilterTemplateIdAndName(
                        filterTemplate.getExternalId(), filterTemplate.getName()))
            .toList());
  }

  @Transactional
  public void deleteFilterTemplate(UUID filterTemplateId) {
    FilterTemplate filterTemplate = getFilterTemplateInternal(filterTemplateId);
    filterTemplateRepository.delete(filterTemplate);
  }
}
