/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.statistics.aggregation.DataSourceAggregationService;
import de.eshg.statistics.aggregation.DataSourceValidator;
import de.eshg.statistics.api.AddStatisticsSchemeRequest;
import de.eshg.statistics.api.AvailableDataSource;
import de.eshg.statistics.api.BaseDataSourceAttribute;
import de.eshg.statistics.api.StatisticsSchemeDto;
import de.eshg.statistics.mapper.StatisticsSchemeMapper;
import de.eshg.statistics.persistence.entity.scheme.DataSource;
import de.eshg.statistics.persistence.entity.scheme.StatisticsScheme;
import de.eshg.statistics.persistence.repository.StatisticsSchemeRepository;
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
public class StatisticsSchemeService {
  private final StatisticsSchemeRepository statisticsSchemeRepository;
  private final DataSourceAggregationService dataSourceAggregationService;
  private final DataSourceValidator dataSourceValidator;
  private final Clock clock;

  public StatisticsSchemeService(
      StatisticsSchemeRepository statisticsSchemeRepository,
      DataSourceAggregationService dataSourceAggregationService,
      DataSourceValidator dataSourceValidator,
      Clock clock) {
    this.statisticsSchemeRepository = statisticsSchemeRepository;
    this.dataSourceAggregationService = dataSourceAggregationService;
    this.dataSourceValidator = dataSourceValidator;
    this.clock = clock;
  }

  @Transactional
  public StatisticsSchemeDto addStatisticsScheme(
      AddStatisticsSchemeRequest addStatisticsSchemeRequest) {
    dataSourceValidator.validateDataSources(addStatisticsSchemeRequest.dataSources());

    StatisticsScheme statisticsScheme =
        statisticsSchemeRepository.save(
            StatisticsSchemeMapper.mapToPersistence(addStatisticsSchemeRequest));
    return StatisticsSchemeMapper.mapToApi(
        statisticsScheme,
        getCodeToNameMappingsByDataSourceId(
            getGetAvailableDataSources(Collections.singletonList(statisticsScheme))));
  }

  @Transactional(readOnly = true)
  public List<StatisticsSchemeDto> getAllStatisticsSchemes() {
    List<StatisticsScheme> statisticSchemes =
        statisticsSchemeRepository.findAll(Sort.by(Sort.Direction.DESC, BaseEntity_.ID));

    Map<UUID, List<AttributeCodeToNameMapping>> codeToNameMappings =
        getCodeToNameMappingsByDataSourceId(getGetAvailableDataSources(statisticSchemes));

    return statisticSchemes.stream()
        .map(
            statisticScheme -> StatisticsSchemeMapper.mapToApi(statisticScheme, codeToNameMappings))
        .toList();
  }

  @Transactional(readOnly = true)
  public StatisticsSchemeDto getStatisticsScheme(UUID schemeId) {
    StatisticsScheme statisticsScheme = getScheme(schemeId);
    return StatisticsSchemeMapper.mapToApi(
        statisticsScheme,
        getCodeToNameMappingsByDataSourceId(
            getGetAvailableDataSources(Collections.singletonList(statisticsScheme))));
  }

  @Transactional
  public void deleteStatisticsScheme(UUID schemeId) {
    statisticsSchemeRepository.delete(getScheme(schemeId));
  }

  private List<AvailableDataSource> getGetAvailableDataSources(
      List<StatisticsScheme> statisticSchemes) {
    Set<String> relevantBusinessModules =
        statisticSchemes.stream()
            .flatMap(scheme -> scheme.getDataSources().stream())
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

  private StatisticsScheme getScheme(UUID schemeId) {
    return statisticsSchemeRepository
        .findByExternalId(schemeId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Statistics scheme with id %s not found".formatted(schemeId)));
  }

  public void setLastUsageToNow(UUID schemeId) {
    statisticsSchemeRepository
        .findByExternalId(schemeId)
        .ifPresent(statisticsScheme -> statisticsScheme.setLastUsageAt(Instant.now(clock)));
  }
}
