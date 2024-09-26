/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.mapper.StatisticMapper.mapSortDirection;
import static de.eshg.statistics.mapper.StatisticMapper.mapSortKey;

import de.eshg.base.SortDirection;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.StatisticsSchemeService;
import de.eshg.statistics.api.AbstractAddStatisticRequest;
import de.eshg.statistics.api.AddStatisticWithDataSourcesRequest;
import de.eshg.statistics.api.AddStatisticWithSchemeRequest;
import de.eshg.statistics.api.AddStatisticsSchemeRequest;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.DataSourceDto;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.GetDetailPageInformationResponse;
import de.eshg.statistics.api.GetStatisticRequest;
import de.eshg.statistics.api.GetStatisticResponse;
import de.eshg.statistics.api.GetStatisticsResponse;
import de.eshg.statistics.api.StatisticSortKey;
import de.eshg.statistics.api.StatisticsSchemeDto;
import de.eshg.statistics.api.completeness.CompletenessOfAttribute;
import de.eshg.statistics.api.completeness.CompletenessOfBaseAttribute;
import de.eshg.statistics.api.completeness.CompletenessOfBusinessAttribute;
import de.eshg.statistics.api.completeness.GetCompletenessDataResponse;
import de.eshg.statistics.api.report.GetReportSeriesEntriesOfStatisticResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.repository.StatisticRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatisticService {
  private final StatisticRepository statisticRepository;
  private final UserApi userApiClient;
  private final TableRowRepository tableRowRepository;
  private final StatisticsSchemeService statisticsSchemeService;
  private final DataSourceValidator dataSourceValidator;
  private final DataAggregationService dataAggregationService;

  private static final Logger log = LoggerFactory.getLogger(StatisticService.class);

  public StatisticService(
      StatisticRepository statisticRepository,
      UserApi userApiClient,
      TableRowRepository tableRowRepository,
      StatisticsSchemeService statisticsSchemeService,
      DataSourceValidator dataSourceValidator,
      DataAggregationService dataAggregationService) {
    super();
    this.statisticRepository = statisticRepository;
    this.userApiClient = userApiClient;
    this.tableRowRepository = tableRowRepository;
    this.statisticsSchemeService = statisticsSchemeService;
    this.dataSourceValidator = dataSourceValidator;
    this.dataAggregationService = dataAggregationService;
  }

  @Transactional
  public UUID addStatistic(AbstractAddStatisticRequest addStatisticRequest) {
    AggregationResultUtil.validateTimeRange(
        addStatisticRequest.timeRangeStart(), addStatisticRequest.timeRangeEnd());

    return switch (addStatisticRequest) {
      case AddStatisticWithDataSourcesRequest addStatisticWithDataSourcesRequest ->
          addStatistic(addStatisticWithDataSourcesRequest);
      case AddStatisticWithSchemeRequest addStatisticWithSchemeRequest -> {
        StatisticsSchemeDto statisticScheme =
            statisticsSchemeService.getStatisticsScheme(addStatisticWithSchemeRequest.schemeId());
        DataSourceDto dataSourceDto =
            StatisticMapper.mapToDataSourceCode(statisticScheme.dataSources().getFirst());
        dataSourceValidator.validateDataSources(List.of(dataSourceDto));
        yield addStatistic(
            dataSourceDto,
            addStatisticWithSchemeRequest.name(),
            addStatisticWithSchemeRequest.timeRangeStart(),
            addStatisticWithSchemeRequest.timeRangeEnd(),
            addStatisticWithSchemeRequest.schemeId());
      }
    };
  }

  private UUID addStatistic(AddStatisticWithDataSourcesRequest request) {
    UUID schemeId = null;
    dataSourceValidator.validateDataSources(request.dataSources());

    if (request.schemeName() != null) {
      schemeId =
          statisticsSchemeService
              .addStatisticsScheme(
                  new AddStatisticsSchemeRequest(request.schemeName(), request.dataSources()))
              .id();
    }

    return addStatistic(
        request.dataSources().getFirst(),
        request.name(),
        request.timeRangeStart(),
        request.timeRangeEnd(),
        schemeId);
  }

  private UUID addStatistic(
      DataSourceDto dataSource,
      String name,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      UUID schemeId) {
    return addStatistic(
        schemeId,
        dataAggregationService.createStatistic(dataSource, name, timeRangeStart, timeRangeEnd));
  }

  private UUID addStatistic(UUID schemeId, Statistic statistic) {
    if (schemeId != null) {
      statisticsSchemeService.setLastUsageToNow(schemeId);
    }

    return statisticRepository.save(statistic).getExternalId();
  }

  @Transactional(readOnly = true)
  public AggregationResultState getAggregationResultState(UUID statisticId) {
    return getStatistic(statisticId).getState();
  }

  @Transactional
  public void workOnPendingStatistic(UUID statisticId) {
    Statistic statistic = getStatistic(statisticId);
    if (!statistic.getState().equals(AggregationResultState.PENDING)) {
      return;
    }

    switch (statistic.getPendingState()) {
      case DATA_AGGREGATION -> {
        try {
          dataAggregationService.collectTableRows(statistic);
        } catch (Exception exception) {
          log.error("Error while collecting table rows", exception);
          statistic.setState(AggregationResultState.FAILED);
        }
      }
      case MIN_MAX_DETERMINATION -> {
        dataAggregationService.determineMinMaxNullUnknownValues(statistic);
        statistic.setState(AggregationResultState.COMPLETED);
        statistic.setPendingState(null);
      }
      case EVALUATION_CONDUCTION -> {
        statistic.setState(AggregationResultState.COMPLETED);
        statistic.setPendingState(null);
      }
      default -> {
        // ignore
      }
    }
  }

  @Transactional(readOnly = true)
  public GetStatisticsResponse getStatistics(
      StatisticSortKey sortKey, SortDirection sortDirection, Integer page, Integer pageSize) {
    Page<Statistic> statisticPage =
        statisticRepository.findAll(
            PageRequest.of(
                page,
                pageSize,
                Sort.by(mapSortDirection(sortDirection), mapSortKey(sortKey), BaseEntity_.ID)));

    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(statisticPage.get());
    return StatisticMapper.mapStatisticPageToResponse(statisticPage, resolvedUsers);
  }

  private Map<UUID, UserDto> getResolvedUsers(
      Stream<? extends AbstractAggregationResult> statisticStream) {
    Set<UUID> userIds =
        statisticStream
            .map(AbstractAggregationResult::getCreatedByUserId)
            .collect(Collectors.toSet());
    return getResolvedUsers(userIds);
  }

  Map<UUID, UserDto> getResolvedUsers(Set<UUID> userIds) {
    if (userIds.isEmpty()) {
      return Collections.emptyMap();
    } else {
      GetUsersResponse getUsersResponse =
          userApiClient.getUsersBulk(new GetUsersRequest(userIds, true));
      return getUsersResponse.users().stream()
          .collect(Collectors.toMap(UserDto::userId, userDto -> userDto));
    }
  }

  @Transactional(readOnly = true)
  public GetStatisticResponse getStatistic(
      UUID statisticId, GetStatisticRequest getStatisticRequest) {
    Statistic statistic = getStatistic(statisticId);
    validateStatisticCompleted(statistic);
    TableColumn sortTableColumn =
        validateSortColumn(getStatisticRequest.sortAttribute(), statistic);
    AggregationResultUtil.validateColumnFilters(getStatisticRequest.filters(), statistic);

    Specification<TableRow> minimalSpecification =
        AggregationResultSpecifications.tableRowOfAggregationSortByColumn(
            sortTableColumn, getStatisticRequest.sortDirection());
    Specification<TableRow> specification;
    if (getStatisticRequest.filters() == null) {
      specification = minimalSpecification;
    } else {
      specification =
          Specification.allOf(
              Stream.concat(
                      Stream.of(minimalSpecification),
                      getStatisticRequest.filters().stream()
                          .map(
                              filter ->
                                  AggregationResultSpecifications.createFilterSpecification(
                                      filter, statistic)))
                  .toList());
    }
    Page<TableRow> tableRowPage =
        tableRowRepository.findAll(
            specification,
            PageRequest.of(getStatisticRequest.page(), getStatisticRequest.pageSize()));

    return StatisticMapper.mapToApi(
        statistic, tableRowPage.get().toList(), tableRowPage.getTotalElements());
  }

  public Statistic getStatistic(UUID statisticId) {
    return statisticRepository
        .findByExternalId(statisticId)
        .orElseThrow(
            () -> new NotFoundException("Statistic with id '%s' not found".formatted(statisticId)));
  }

  public void validateStatisticCompleted(Statistic statistic) {
    if (!statistic.getState().equals(AggregationResultState.COMPLETED)) {
      throw new BadRequestException(
          "Statistic %s is not in state COMPLETED".formatted(statistic.getExternalId()));
    }
  }

  private static TableColumn validateSortColumn(
      AttributeSelectionDto sortAttribute, Statistic statistic) {
    TableColumn sortTableColumn = AggregationResultUtil.getTableColumn(sortAttribute, statistic);
    if (sortTableColumn == null) {
      sortTableColumn =
          statistic.getTableColumns().stream()
              .filter(tableColumn -> !tableColumn.getValueType().equals(ValueType.CENTRAL_FILE_ID))
              .findFirst()
              .orElseThrow(() -> new NotFoundException("No column found for sorting"));
    }
    return sortTableColumn;
  }

  @Transactional(readOnly = true)
  public GetDetailPageInformationResponse getDetailPageInformation(UUID statisticId) {
    Statistic statistic = getStatistic(statisticId);
    validateStatisticCompleted(statistic);
    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(Stream.of(statistic));
    List<EvaluationDto> evaluations = EvaluationMapper.getEvaluations(statistic.getEvaluations());

    return new GetDetailPageInformationResponse(
        StatisticMapper.mapToStatisticInfo(statistic),
        StatisticMapper.mapToApi(statistic.getTableColumns()),
        statistic.getNumberOfTableRows(),
        resolvedUsers.get(statistic.getCreatedByUserId()),
        evaluations);
  }

  @Transactional
  public void deleteStatistic(UUID statisticId) {
    Statistic statistic = getStatistic(statisticId);
    validateBelongsToCurrentUserOrIsAdmin(statistic);
    validateCopyProcessIsNotOngoing(statistic);
    statisticRepository.delete(statistic);
  }

  private void validateBelongsToCurrentUserOrIsAdmin(Statistic statistic) {
    UUID userId = CurrentUserHelper.getCurrentUserId();
    if (!userId.equals(statistic.getCreatedByUserId())
        && CurrentUserHelper.currentUserHasNoRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN)) {
      throw new BadRequestException(
          "Statistic with id '%s' does not belong to current user"
              .formatted(statistic.getExternalId()));
    }
  }

  private void validateCopyProcessIsNotOngoing(Statistic statistic) {
    if (AggregationResultState.COPY_ONGOING.equals(statistic.getState())) {
      throw new BadRequestException(
          "Copy process for statistic with id '%s' is ongoing."
              .formatted(statistic.getExternalId()));
    }
  }

  @Transactional(readOnly = true)
  public GetCompletenessDataResponse getCompletenessInformation(UUID statisticId) {
    Statistic statistic = getStatistic(statisticId);
    validateStatisticCompleted(statistic);

    List<CompletenessOfAttribute> completenessOfAttributes =
        statistic.getTableColumns().stream()
            .filter(
                tableColumn ->
                    !tableColumn.getValueType().equals(ValueType.CENTRAL_FILE_ID)
                        && !tableColumn.getValueType().equals(ValueType.PROCEDURE_ID))
            .map(
                tableColumn ->
                    getCompletenessOfAttribute(tableColumn, statistic.getNumberOfTableRows()))
            .toList();

    return new GetCompletenessDataResponse(
        StatisticMapper.mapToStatisticInfo(statistic), completenessOfAttributes);
  }

  private CompletenessOfAttribute getCompletenessOfAttribute(
      TableColumn tableColumn, long totalNumberOfRows) {
    MinMaxNullUnknownValues minMaxNullUnknownValues = tableColumn.getMinMaxNullUnknownValues();

    BigDecimal nullPercentage =
        getPercentage(minMaxNullUnknownValues.getNumberOfNullEntries(), totalNumberOfRows);
    BigDecimal unknownPercentage =
        minMaxNullUnknownValues.getNumberOfUnknownEntries() == null
            ? null
            : getPercentage(minMaxNullUnknownValues.getNumberOfUnknownEntries(), totalNumberOfRows);
    BigDecimal sumPercentage =
        unknownPercentage == null ? nullPercentage : nullPercentage.add(unknownPercentage);

    if (tableColumn.getBaseModuleAttributeCode() == null) {
      return new CompletenessOfBusinessAttribute(
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getBusinessModuleAttributeCode(),
          tableColumn.getBusinessModuleAttributeName(),
          tableColumn.isMandatory(),
          tableColumn.getMinMaxNullUnknownValues().getUnknownValue(),
          unknownPercentage,
          nullPercentage,
          sumPercentage);
    } else {
      return new CompletenessOfBaseAttribute(
          tableColumn.getBusinessModuleName(),
          tableColumn.getDataSourceId(),
          tableColumn.getBusinessModuleAttributeCode(),
          tableColumn.getBusinessModuleAttributeName(),
          tableColumn.getBaseModuleAttributeCode(),
          tableColumn.getBaseModuleAttributeName(),
          tableColumn.isMandatory(),
          tableColumn.getMinMaxNullUnknownValues().getUnknownValue(),
          unknownPercentage,
          nullPercentage,
          sumPercentage);
    }
  }

  private static BigDecimal getPercentage(long numberOfEntries, long totalNumberOfRows) {
    if (totalNumberOfRows == 0) {
      return BigDecimal.valueOf(0);
    }
    return BigDecimal.valueOf(numberOfEntries)
        .divide(BigDecimal.valueOf(totalNumberOfRows), 6, RoundingMode.HALF_UP)
        .multiply(BigDecimal.valueOf(100));
  }

  @Transactional(readOnly = true)
  public GetReportSeriesEntriesOfStatisticResponse getReportSeriesEntriesOfStatistic(
      UUID statisticId) {
    Statistic statistic = getStatistic(statisticId);

    List<ReportSeriesDto> reportSeriesDtos =
        statistic.getReportSeriesList().stream().map(ReportMapper::mapToApi).toList();
    Set<UUID> userIds =
        reportSeriesDtos.stream().map(ReportSeriesDto::userId).collect(Collectors.toSet());
    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(userIds);
    return new GetReportSeriesEntriesOfStatisticResponse(
        statistic.getExternalId(), statistic.getName(), reportSeriesDtos, resolvedUsers);
  }

  static boolean hasNoDiagrams(Statistic statistic) {
    return statistic.getEvaluations().isEmpty()
        || statistic.getEvaluations().stream()
            .allMatch(evaluation -> evaluation.getDiagrams().isEmpty());
  }

  @Transactional
  public void setState(UUID statisticId, AggregationResultState state) {
    Statistic statistic = getStatistic(statisticId);
    statistic.setState(state);
  }
}
