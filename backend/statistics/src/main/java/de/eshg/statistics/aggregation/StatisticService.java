/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.mapper.StatisticMapper.mapSortDirection;
import static de.eshg.statistics.mapper.StatisticMapper.mapSortKey;
import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.EVALUATION_CONDUCTION;
import static de.eshg.statistics.persistence.entity.AggregationResultPendingState.TABLE_ROWS_REMOVAL;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.EvaluationTemplateService;
import de.eshg.statistics.StatisticUserService;
import de.eshg.statistics.api.AbstractAddStatisticRequest;
import de.eshg.statistics.api.AbstractUpdateStatisticRequest;
import de.eshg.statistics.api.AddStatisticWithDataSourcesRequest;
import de.eshg.statistics.api.AddStatisticWithTemplateRequest;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.EvaluationDto;
import de.eshg.statistics.api.GetDetailPageInformationResponse;
import de.eshg.statistics.api.GetStatisticRequest;
import de.eshg.statistics.api.GetStatisticResponse;
import de.eshg.statistics.api.GetStatisticsRequest;
import de.eshg.statistics.api.GetStatisticsResponse;
import de.eshg.statistics.api.UpdateStatisticNameRequest;
import de.eshg.statistics.api.UpdateStatisticTimeRangeRequest;
import de.eshg.statistics.api.completeness.CompletenessOfAttribute;
import de.eshg.statistics.api.completeness.CompletenessOfBaseAttribute;
import de.eshg.statistics.api.completeness.CompletenessOfBusinessAttribute;
import de.eshg.statistics.api.completeness.GetCompletenessDataResponse;
import de.eshg.statistics.api.datasource.AvailableDataSource;
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateWithDataSourcesRequest;
import de.eshg.statistics.api.evaluationtemplate.EvaluationTemplateDto;
import de.eshg.statistics.api.report.GetReportSeriesEntriesOfStatisticResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.config.OriginalDataAccessConfig;
import de.eshg.statistics.datatransfer.AnalysisTemplateData;
import de.eshg.statistics.datatransfer.DiagramTemplateData;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.mapper.StatisticMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult_;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.Statistic;
import de.eshg.statistics.persistence.entity.Statistic_;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumn_;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.repository.StatisticRepository;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.hibernate.Hibernate;
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
  private static final String STATISTIC_WITH_ID_NOT_FOUND = "Statistic with id '%s' not found";

  private static final Logger log = LoggerFactory.getLogger(StatisticService.class);
  private final StatisticRepository statisticRepository;
  private final StatisticUserService userService;
  private final TableRowRepository tableRowRepository;
  private final EvaluationTemplateService evaluationTemplateService;
  private final DataSourceValidator dataSourceValidator;
  private final DataAggregationService dataAggregationService;
  private final OriginalDataAccessConfig originalDataAccessConfig;

  public StatisticService(
      StatisticRepository statisticRepository,
      StatisticUserService userService,
      TableRowRepository tableRowRepository,
      EvaluationTemplateService evaluationTemplateService,
      DataSourceValidator dataSourceValidator,
      DataAggregationService dataAggregationService,
      OriginalDataAccessConfig originalDataAccessConfig) {
    this.statisticRepository = statisticRepository;
    this.userService = userService;
    this.tableRowRepository = tableRowRepository;
    this.evaluationTemplateService = evaluationTemplateService;
    this.dataSourceValidator = dataSourceValidator;
    this.dataAggregationService = dataAggregationService;
    this.originalDataAccessConfig = originalDataAccessConfig;
  }

  @Transactional(readOnly = true)
  public void checkPermissionForStatistic(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    if (accessNotAllowed(statistic)) {
      throw new NotFoundException(STATISTIC_WITH_ID_NOT_FOUND.formatted(statisticId));
    }
  }

  public boolean accessNotAllowed(AbstractAggregationResult aggregationResultProxy) {
    AbstractAggregationResult aggregationResult =
        Hibernate.unproxy(aggregationResultProxy, AbstractAggregationResult.class);
    if (aggregationResult instanceof Statistic statistic && !statistic.isAnonymized()) {
      Set<String> businessModules =
          statistic.getTableColumns().stream()
              .map(TableColumn::getBusinessModuleName)
              .collect(Collectors.toSet());
      return businessModules.stream()
          .anyMatch(
              businessModule ->
                  !originalDataAccessConfig.originalDataAllowedForCurrentUser(businessModule));
    } else {
      return false;
    }
  }

  @Transactional
  public UUID addStatistic(AbstractAddStatisticRequest addStatisticRequest) {
    AggregationResultUtil.validateTimeRange(
        addStatisticRequest.timeRangeStart(), addStatisticRequest.timeRangeEnd());

    return switch (addStatisticRequest) {
      case AddStatisticWithDataSourcesRequest addStatisticWithDataSourcesRequest ->
          addStatistic(addStatisticWithDataSourcesRequest);
      case AddStatisticWithTemplateRequest addStatisticWithTemplateRequest -> {
        EvaluationTemplateDto evaluationTemplate =
            evaluationTemplateService.getEvaluationTemplate(
                addStatisticWithTemplateRequest.templateId());
        DataSourceDto dataSourceDto =
            StatisticMapper.mapToDataSourceCode(evaluationTemplate.dataSources().getFirst());
        dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(
            List.of(dataSourceDto));
        yield addStatistic(
            dataSourceDto,
            addStatisticWithTemplateRequest.name(),
            addStatisticWithTemplateRequest.timeRangeStart(),
            addStatisticWithTemplateRequest.timeRangeEnd(),
            addStatisticWithTemplateRequest.anonymized(),
            addStatisticWithTemplateRequest.templateId());
      }
    };
  }

  private UUID addStatistic(AddStatisticWithDataSourcesRequest request) {
    UUID templateId = null;
    List<AvailableDataSource> relevantAvailableDataSources =
        dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(
            request.dataSources());

    if (request.templateName() != null) {
      templateId =
          evaluationTemplateService
              .addEvaluationTemplate(
                  new AddEvaluationTemplateWithDataSourcesRequest(
                      request.templateName(), request.dataSources()),
                  relevantAvailableDataSources)
              .id();
    }

    return addStatistic(
        request.dataSources().getFirst(),
        request.name(),
        request.timeRangeStart(),
        request.timeRangeEnd(),
        request.anonymized(),
        templateId);
  }

  private UUID addStatistic(
      DataSourceDto dataSource,
      String name,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      boolean anonymized,
      UUID templateId) {
    if (!anonymized
        && !originalDataAccessConfig.originalDataAllowedForCurrentUser(
            dataSource.businessModuleName())) {
      throw new BadRequestException(
          "Only anonymized statistics allowed for data source '%s'".formatted(dataSource.id()));
    }
    EvaluationTemplate evaluationTemplate = null;
    if (templateId != null) {
      evaluationTemplate = evaluationTemplateService.getEvaluationTemplateInternal(templateId);
    }
    Statistic statistic =
        dataAggregationService.createStatistic(
            dataSource, name, timeRangeStart, timeRangeEnd, anonymized);
    if (evaluationTemplate != null) {
      evaluationTemplate
          .getAnalysisTemplates()
          .forEach(
              analysisTemplate ->
                  EvaluationService.addEvaluationAndDiagramsWithoutData(
                      statistic, analysisTemplate));
    }
    return addStatistic(templateId, statistic);
  }

  private UUID addStatistic(UUID templateId, Statistic statistic) {
    if (templateId != null) {
      evaluationTemplateService.setLastUsageToNow(templateId);
    }

    return statisticRepository.save(statistic).getExternalId();
  }

  @Transactional
  public void updateStatistic(
      UUID statisticId, AbstractUpdateStatisticRequest updateStatisticRequest) {
    Statistic statistic = getStatisticInternal(statisticId);
    validateBelongsToCurrentUserOrIsAdmin(statistic);
    validateStatisticCompleted(statistic);

    switch (updateStatisticRequest) {
      case UpdateStatisticNameRequest updateStatisticNameRequest ->
          updateName(statistic, updateStatisticNameRequest);
      case UpdateStatisticTimeRangeRequest updateStatisticTimeRangeRequest ->
          updateTimeRange(statistic, updateStatisticTimeRangeRequest);
    }
  }

  private void updateName(
      Statistic statistic, UpdateStatisticNameRequest updateStatisticNameRequest) {
    statistic.setName(updateStatisticNameRequest.name());
  }

  private void updateTimeRange(
      Statistic statistic, UpdateStatisticTimeRangeRequest updateStatisticTimeRangeRequest) {
    AggregationResultUtil.validateTimeRange(
        updateStatisticTimeRangeRequest.timeRange().start(),
        updateStatisticTimeRangeRequest.timeRange().end());

    statistic.setTimeRangeStart(updateStatisticTimeRangeRequest.timeRange().start());
    statistic.setTimeRangeEnd(updateStatisticTimeRangeRequest.timeRange().end());
    statistic.setNumberOfTableRows(0);
    statistic.setState(AggregationResultState.UPDATING);
    statistic.setPendingState(TABLE_ROWS_REMOVAL);
  }

  @Transactional(readOnly = true)
  public AggregationResultState getAggregationResultState(UUID statisticId) {
    return getStatisticInternal(statisticId).getState();
  }

  @Transactional(readOnly = true)
  public AggregationResultPendingState getAggregationResultPendingState(UUID statisticId) {
    return getStatisticInternal(statisticId).getPendingState();
  }

  @Transactional(readOnly = true)
  public GetStatisticsResponse getStatistics(GetStatisticsRequest getStatisticsRequest) {
    Specification<Statistic> specification;
    if (getStatisticsRequest.anonymizationValue() == null) {
      specification =
          Specification.anyOf(
              anonymizedStatistics(),
              notAnonymizedStatistics(
                  originalDataAccessConfig.getBusinessModulesOriginalDataAllowedForCurrentUser()));
    } else {
      if (Boolean.TRUE.equals(getStatisticsRequest.anonymizationValue())) {
        specification = anonymizedStatistics();
      } else {
        specification =
            notAnonymizedStatistics(
                originalDataAccessConfig.getBusinessModulesOriginalDataAllowedForCurrentUser());
      }
    }

    Page<Statistic> statisticPage =
        statisticRepository.findAll(
            specification,
            PageRequest.of(
                getStatisticsRequest.page(),
                getStatisticsRequest.pageSize(),
                Sort.by(
                    mapSortDirection(getStatisticsRequest.sortDirection()),
                    mapSortKey(getStatisticsRequest.sortKey()),
                    BaseEntity_.ID)));

    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(statisticPage.get());
    return StatisticMapper.mapStatisticPageToResponse(statisticPage, resolvedUsers);
  }

  private Specification<Statistic> anonymizedStatistics() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.isTrue(root.get(Statistic_.ANONYMIZED));
  }

  private Specification<Statistic> notAnonymizedStatistics(Set<String> allowedBusinessModuleNames) {
    return (root, query, criteriaBuilder) -> {
      Predicate notAnonymizedPredicate = criteriaBuilder.isFalse(root.get(Statistic_.ANONYMIZED));

      Subquery<TableColumn> subquery = query.subquery(TableColumn.class);
      Root<TableColumn> tableColumnRoot = subquery.from(TableColumn.class);
      subquery.select(tableColumnRoot);

      Expression<Collection<TableColumn>> tableColumnsExpression =
          root.get(AbstractAggregationResult_.TABLE_COLUMNS);
      Predicate tableColumnMemberPredicate =
          criteriaBuilder.isMember(tableColumnRoot, tableColumnsExpression);

      Predicate businessModuleNotAllowedPredicate =
          criteriaBuilder.not(
              tableColumnRoot
                  .get(TableColumn_.BUSINESS_MODULE_NAME)
                  .in(allowedBusinessModuleNames));

      subquery.where(
          criteriaBuilder.and(tableColumnMemberPredicate, businessModuleNotAllowedPredicate));

      return criteriaBuilder.and(
          notAnonymizedPredicate, criteriaBuilder.not(criteriaBuilder.exists(subquery)));
    };
  }

  private Map<UUID, UserDto> getResolvedUsers(
      Stream<? extends AbstractAggregationResult> statisticStream) {
    Set<UUID> userIds =
        statisticStream
            .map(AbstractAggregationResult::getCreatedByUserId)
            .collect(Collectors.toSet());
    return userService.getResolvedUsers(userIds);
  }

  @Transactional(readOnly = true)
  public GetStatisticResponse getStatistic(
      UUID statisticId, GetStatisticRequest getStatisticRequest) {
    Statistic statistic = getStatisticInternal(statisticId);
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

  public Statistic getStatisticInternal(UUID statisticId) {
    return statisticRepository
        .findByExternalId(statisticId)
        .orElseThrow(
            () -> new NotFoundException(STATISTIC_WITH_ID_NOT_FOUND.formatted(statisticId)));
  }

  public static void validateStatisticCompleted(Statistic statistic) {
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
    Statistic statistic = getStatisticInternal(statisticId);
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
  public void prepareStatisticForDeletion(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    validateBelongsToCurrentUserOrIsAdmin(statistic);
    validateCopyProcessIsNotOngoing(statistic);

    statistic.setState(AggregationResultState.DELETING);
    statistic.setPendingState(TABLE_ROWS_REMOVAL);

    deactivateAndDeleteEmptyAutoReportSeries(statistic);
    flagAllReportsForDeletion(statistic);
  }

  private void deactivateAndDeleteEmptyAutoReportSeries(Statistic statistic) {
    List<ReportSeries> reportSeriesEntriesToDelete = new ArrayList<>();
    statistic.getReportSeriesList().stream()
        .filter(reportSeries -> reportSeries.getReportType().equals(ReportType.AUTO))
        .forEach(
            reportSeries -> {
              reportSeries.setActive(false);
              reportSeries.getReports().stream()
                  .filter(report -> report.getState().equals(AggregationResultState.PLANNED))
                  .findFirst()
                  .ifPresent(reportSeries::removeReport);
              if (reportSeries.getReports().isEmpty()) {
                reportSeriesEntriesToDelete.add(reportSeries);
              }
            });
    statistic.removeReportSeriesEntries(reportSeriesEntriesToDelete);
  }

  private void flagAllReportsForDeletion(Statistic statistic) {
    statistic
        .getReportSeriesList()
        .forEach(
            reportSeries ->
                reportSeries
                    .getReports()
                    .forEach(report -> report.setState(AggregationResultState.DELETING)));
  }

  @Transactional
  public void deleteStatistic(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
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
    Statistic statistic = getStatisticInternal(statisticId);
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
    Statistic statistic = getStatisticInternal(statisticId);

    List<ReportSeriesDto> reportSeriesDtos =
        statistic.getReportSeriesList().stream().map(ReportMapper::mapToApi).toList();
    Set<UUID> userIds =
        reportSeriesDtos.stream().map(ReportSeriesDto::userId).collect(Collectors.toSet());
    Map<UUID, UserDto> resolvedUsers = userService.getResolvedUsers(userIds);
    return new GetReportSeriesEntriesOfStatisticResponse(
        statistic.getExternalId(),
        statistic.getName(),
        statistic.isAnonymized(),
        reportSeriesDtos,
        resolvedUsers);
  }

  @Transactional(readOnly = true)
  public Set<UUID> getReportSeriesIdsOfStatistic(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);

    return statistic.getReportSeriesList().stream()
        .map(ReportSeries::getExternalId)
        .collect(Collectors.toSet());
  }

  static boolean hasNoDiagrams(Statistic statistic) {
    return statistic.getEvaluations().isEmpty()
        || statistic.getEvaluations().stream()
            .allMatch(evaluation -> evaluation.getDiagrams().isEmpty());
  }

  @Transactional
  public void setState(UUID statisticId, AggregationResultState state) {
    Statistic statistic = getStatisticInternal(statisticId);
    statistic.setState(state);
  }

  @Transactional(readOnly = true)
  public AggregationResultStateInformation getStateInformation(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    return new AggregationResultStateInformation(statistic.getState(), statistic.getPendingState());
  }

  @Transactional
  public void aggregateData(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    try {
      dataAggregationService.collectTableRows(statistic);
    } catch (Exception exception) {
      log.error("Error while collecting table rows", exception);
      statistic.setState(AggregationResultState.FAILED);
    }
  }

  @Transactional
  public void minMaxDetermination(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    dataAggregationService.determineMinMaxNullUnknownValues(statistic);
    statistic.setPendingState(EVALUATION_CONDUCTION);
  }

  @Transactional
  public void removeTableRows(
      UUID statisticId, AggregationResultPendingState pendingStateAfterRemoval) {
    Statistic statistic = getStatisticInternal(statisticId);

    if (dataAggregationService.countTableRows(statistic) <= 0) {
      statistic.setPendingState(pendingStateAfterRemoval);
    } else {
      dataAggregationService.removeTableRows(statistic);
    }
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateData getEvaluationTemplateData(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    List<DataSourceDto> dataSourceDtos = determineDataSources(statistic.getTableColumns());
    List<AnalysisTemplateData> analysisTemplateDatas =
        determineAnalysisTemplateDatas(statistic.getEvaluations());
    return new EvaluationTemplateData(dataSourceDtos, analysisTemplateDatas);
  }

  private List<DataSourceDto> determineDataSources(List<TableColumn> tableColumns) {
    Map<String, DataSourceDto> keyToDataSourceMap = new LinkedHashMap<>();
    tableColumns.stream()
        .filter(tableColumn -> !tableColumn.getValueType().equals(ValueType.CENTRAL_FILE_ID))
        .forEach(
            tableColumn -> {
              String key =
                  "%s-%s"
                      .formatted(
                          tableColumn.getDataSourceId(), tableColumn.getBusinessModuleName());
              keyToDataSourceMap.computeIfAbsent(
                  key,
                  k ->
                      new DataSourceDto(
                          tableColumn.getBusinessModuleName(),
                          tableColumn.getDataSourceId(),
                          new ArrayList<>()));
              Optional<BusinessDataAttribute> businessDataAttributeOptional =
                  keyToDataSourceMap.get(key).attributeCodes().stream()
                      .filter(
                          attribute ->
                              attribute.code().equals(tableColumn.getBusinessModuleAttributeCode()))
                      .findFirst();
              BusinessDataAttribute attribute;
              if (businessDataAttributeOptional.isEmpty()) {
                attribute =
                    new BusinessDataAttribute(
                        tableColumn.getBusinessModuleAttributeCode(), new ArrayList<>());
                keyToDataSourceMap.get(key).attributeCodes().add(attribute);
              } else {
                attribute = businessDataAttributeOptional.get();
              }
              if (tableColumn.getBaseModuleAttributeCode() != null) {
                attribute.baseAttributeCodes().add(tableColumn.getBaseModuleAttributeCode());
              }
            });
    return keyToDataSourceMap.keySet().stream().map(keyToDataSourceMap::get).toList();
  }

  private List<AnalysisTemplateData> determineAnalysisTemplateDatas(List<Evaluation> evaluations) {
    return evaluations.stream()
        .map(
            evaluation ->
                new AnalysisTemplateData(
                    evaluation.getName(),
                    EvaluationMapper.mapToChartConfigurationDto(
                        Hibernate.unproxy(
                            evaluation.getChartConfiguration(), ChartConfiguration.class),
                        true),
                    determineDiagramTemplateDatas(evaluation.getDiagrams())))
        .toList();
  }

  private List<DiagramTemplateData> determineDiagramTemplateDatas(List<Diagram> diagrams) {
    return diagrams.stream()
        .map(
            diagram ->
                new DiagramTemplateData(
                    diagram.getTitle(),
                    diagram.getDescription(),
                    FilterParameterMapper.mapToApi(diagram.getFilters())))
        .toList();
  }

  @Transactional
  public void setStateToFailed(UUID statisticId) {
    Statistic statistic = getStatisticInternal(statisticId);
    statistic.setState(AggregationResultState.FAILED);
  }
}
