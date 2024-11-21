/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import static de.eshg.statistics.mapper.EvaluationMapper.mapSortDirection;
import static de.eshg.statistics.mapper.EvaluationMapper.mapSortKey;

import de.eshg.base.user.api.UserDto;
import de.eshg.domain.model.BaseEntity_;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.statistics.EvaluationTemplateService;
import de.eshg.statistics.StatisticsUserService;
import de.eshg.statistics.api.AnalysisDto;
import de.eshg.statistics.api.AttributeSelectionDto;
import de.eshg.statistics.api.GetDetailPageInformationResponse;
import de.eshg.statistics.api.completeness.CompletenessOfAttribute;
import de.eshg.statistics.api.completeness.CompletenessOfBaseAttribute;
import de.eshg.statistics.api.completeness.CompletenessOfBusinessAttribute;
import de.eshg.statistics.api.completeness.GetCompletenessDataResponse;
import de.eshg.statistics.api.datasource.BusinessDataAttribute;
import de.eshg.statistics.api.datasource.DataSourceDto;
import de.eshg.statistics.api.evaluation.AbstractAddEvaluationRequest;
import de.eshg.statistics.api.evaluation.AbstractUpdateEvaluationRequest;
import de.eshg.statistics.api.evaluation.AddEvaluationWithDataSourcesRequest;
import de.eshg.statistics.api.evaluation.AddEvaluationWithTemplateRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationResponse;
import de.eshg.statistics.api.evaluation.GetEvaluationsRequest;
import de.eshg.statistics.api.evaluation.GetEvaluationsResponse;
import de.eshg.statistics.api.evaluation.UpdateEvaluationNameRequest;
import de.eshg.statistics.api.evaluation.UpdateEvaluationTimeRangeRequest;
import de.eshg.statistics.api.report.GetReportSeriesEntriesOfEvaluationResponse;
import de.eshg.statistics.api.report.ReportSeriesDto;
import de.eshg.statistics.config.OriginalDataAccessConfig;
import de.eshg.statistics.datatransfer.AnalysisTemplateData;
import de.eshg.statistics.datatransfer.DiagramTemplateData;
import de.eshg.statistics.datatransfer.EvaluationTemplateData;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.mapper.EvaluationMapper;
import de.eshg.statistics.mapper.EvaluationTemplateMapper;
import de.eshg.statistics.mapper.FilterParameterMapper;
import de.eshg.statistics.mapper.ReportMapper;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult_;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.Evaluation_;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumn_;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.evaluationtemplate.EvaluationTemplate;
import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import de.eshg.statistics.persistence.repository.EvaluationRepository;
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
public class EvaluationService {
  private static final String EVALUATION_WITH_ID_NOT_FOUND = "Evaluation with id '%s' not found";

  private static final Logger log = LoggerFactory.getLogger(EvaluationService.class);
  private final EvaluationRepository evaluationRepository;
  private final StatisticsUserService userService;
  private final TableRowRepository tableRowRepository;
  private final EvaluationTemplateService evaluationTemplateService;
  private final DataSourceValidator dataSourceValidator;
  private final DataAggregationService dataAggregationService;
  private final OriginalDataAccessConfig originalDataAccessConfig;

  public EvaluationService(
      EvaluationRepository evaluationRepository,
      StatisticsUserService userService,
      TableRowRepository tableRowRepository,
      EvaluationTemplateService evaluationTemplateService,
      DataSourceValidator dataSourceValidator,
      DataAggregationService dataAggregationService,
      OriginalDataAccessConfig originalDataAccessConfig) {
    this.evaluationRepository = evaluationRepository;
    this.userService = userService;
    this.tableRowRepository = tableRowRepository;
    this.evaluationTemplateService = evaluationTemplateService;
    this.dataSourceValidator = dataSourceValidator;
    this.dataAggregationService = dataAggregationService;
    this.originalDataAccessConfig = originalDataAccessConfig;
  }

  @Transactional(readOnly = true)
  public void checkPermissionForEvaluation(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    if (accessNotAllowed(evaluation)) {
      throw new NotFoundException(EVALUATION_WITH_ID_NOT_FOUND.formatted(evaluationId));
    }
  }

  public boolean accessNotAllowed(AbstractAggregationResult aggregationResultProxy) {
    AbstractAggregationResult aggregationResult =
        Hibernate.unproxy(aggregationResultProxy, AbstractAggregationResult.class);
    if (aggregationResult instanceof Evaluation evaluation && !evaluation.isAnonymized()) {
      Set<String> businessModules =
          evaluation.getTableColumns().stream()
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
  public UUID addEvaluation(AbstractAddEvaluationRequest addEvaluationRequest) {
    AggregationResultUtil.validateTimeRange(
        addEvaluationRequest.timeRangeStart(), addEvaluationRequest.timeRangeEnd());

    return switch (addEvaluationRequest) {
      case AddEvaluationWithDataSourcesRequest addEvaluationWithDataSourcesRequest ->
          addEvaluation(
              addEvaluationWithDataSourcesRequest.dataSources().getFirst(),
              addEvaluationWithDataSourcesRequest.name(),
              addEvaluationWithDataSourcesRequest.timeRangeStart(),
              addEvaluationWithDataSourcesRequest.timeRangeEnd(),
              addEvaluationWithDataSourcesRequest.anonymized(),
              null);
      case AddEvaluationWithTemplateRequest addEvaluationWithTemplateRequest ->
          addEvaluation(
              null,
              addEvaluationWithTemplateRequest.name(),
              addEvaluationWithTemplateRequest.timeRangeStart(),
              addEvaluationWithTemplateRequest.timeRangeEnd(),
              addEvaluationWithTemplateRequest.anonymized(),
              addEvaluationWithTemplateRequest.templateId());
    };
  }

  private UUID addEvaluation(
      DataSourceDto dataSource,
      String name,
      Instant timeRangeStart,
      Instant timeRangeEnd,
      boolean anonymized,
      UUID templateId) {
    EvaluationTemplate evaluationTemplate = null;
    if (dataSource == null) {
      evaluationTemplate = evaluationTemplateService.getEvaluationTemplateInternal(templateId);
      dataSource =
          EvaluationTemplateMapper.mapToDataSourceDto(
              evaluationTemplate.getDataSources().getFirst());
    }
    if (!anonymized
        && !originalDataAccessConfig.originalDataAllowedForCurrentUser(
            dataSource.businessModuleName())) {
      throw new BadRequestException(
          "Only anonymized evaluations allowed for data source '%s'".formatted(dataSource.id()));
    }
    dataSourceValidator.validateDataSourcesAndGetRelevantAvailableDataSources(List.of(dataSource));

    Evaluation evaluation =
        dataAggregationService.createEvaluation(
            dataSource, name, timeRangeStart, timeRangeEnd, anonymized);
    if (evaluationTemplate != null) {
      evaluationTemplate
          .getAnalysisTemplates()
          .forEach(
              analysisTemplate ->
                  AnalysisService.addAnalysisAndDiagramsWithoutData(evaluation, analysisTemplate));
    }
    return addEvaluation(templateId, evaluation);
  }

  private UUID addEvaluation(UUID templateId, Evaluation evaluation) {
    if (templateId != null) {
      evaluationTemplateService.setLastUsageToNow(templateId);
    }

    return evaluationRepository.save(evaluation).getExternalId();
  }

  @Transactional
  public void updateEvaluation(
      UUID evaluationId, AbstractUpdateEvaluationRequest updateEvaluationRequest) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    validateBelongsToCurrentUserOrIsAdmin(evaluation);
    validateEvaluationCompleted(evaluation);

    switch (updateEvaluationRequest) {
      case UpdateEvaluationNameRequest updateEvaluationNameRequest ->
          updateName(evaluation, updateEvaluationNameRequest);
      case UpdateEvaluationTimeRangeRequest updateEvaluationTimeRangeRequest ->
          updateTimeRange(evaluation, updateEvaluationTimeRangeRequest);
    }
  }

  private void updateName(
      Evaluation evaluation, UpdateEvaluationNameRequest updateEvaluationNameRequest) {
    evaluation.setName(updateEvaluationNameRequest.name());
  }

  private void updateTimeRange(
      Evaluation evaluation, UpdateEvaluationTimeRangeRequest updateEvaluationTimeRangeRequest) {
    AggregationResultUtil.validateTimeRange(
        updateEvaluationTimeRangeRequest.timeRange().start(),
        updateEvaluationTimeRangeRequest.timeRange().end());

    evaluation.setTimeRangeStart(updateEvaluationTimeRangeRequest.timeRange().start());
    evaluation.setTimeRangeEnd(updateEvaluationTimeRangeRequest.timeRange().end());
    evaluation.setNumberOfTableRows(0);
    evaluation.setState(AggregationResultState.UPDATING);
    evaluation.setPendingState(AggregationResultPendingState.TABLE_ROWS_REMOVAL);
  }

  @Transactional(readOnly = true)
  public AggregationResultState getAggregationResultState(UUID evaluationId) {
    return getEvaluationInternal(evaluationId).getState();
  }

  @Transactional(readOnly = true)
  public AggregationResultPendingState getAggregationResultPendingState(UUID evaluationId) {
    return getEvaluationInternal(evaluationId).getPendingState();
  }

  @Transactional(readOnly = true)
  public GetEvaluationsResponse getEvaluations(GetEvaluationsRequest getEvaluationsRequest) {
    Specification<Evaluation> specification;
    if (getEvaluationsRequest.anonymizationValue() == null) {
      specification =
          Specification.anyOf(
              anonymizedEvaluations(),
              notAnonymizedEvaluations(
                  originalDataAccessConfig.getBusinessModulesOriginalDataAllowedForCurrentUser()));
    } else {
      if (Boolean.TRUE.equals(getEvaluationsRequest.anonymizationValue())) {
        specification = anonymizedEvaluations();
      } else {
        specification =
            notAnonymizedEvaluations(
                originalDataAccessConfig.getBusinessModulesOriginalDataAllowedForCurrentUser());
      }
    }

    Page<Evaluation> evaluationPage =
        evaluationRepository.findAll(
            specification,
            PageRequest.of(
                getEvaluationsRequest.page(),
                getEvaluationsRequest.pageSize(),
                Sort.by(
                    mapSortDirection(getEvaluationsRequest.sortDirection()),
                    mapSortKey(getEvaluationsRequest.sortKey()),
                    BaseEntity_.ID)));

    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(evaluationPage.get());
    return EvaluationMapper.mapEvaluationPageToResponse(evaluationPage, resolvedUsers);
  }

  private Specification<Evaluation> anonymizedEvaluations() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.isTrue(root.get(Evaluation_.ANONYMIZED));
  }

  private Specification<Evaluation> notAnonymizedEvaluations(
      Set<String> allowedBusinessModuleNames) {
    return (root, query, criteriaBuilder) -> {
      Predicate notAnonymizedPredicate = criteriaBuilder.isFalse(root.get(Evaluation_.ANONYMIZED));

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
      Stream<? extends AbstractAggregationResult> evaluationStream) {
    Set<UUID> userIds =
        evaluationStream
            .map(AbstractAggregationResult::getCreatedByUserId)
            .collect(Collectors.toSet());
    return userService.getResolvedUsers(userIds);
  }

  @Transactional(readOnly = true)
  public GetEvaluationResponse getEvaluation(
      UUID evaluationId, GetEvaluationRequest getEvaluationRequest) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    validateEvaluationCompleted(evaluation);
    TableColumn sortTableColumn =
        validateSortColumn(getEvaluationRequest.sortAttribute(), evaluation);
    AggregationResultUtil.validateColumnFilters(getEvaluationRequest.filters(), evaluation);

    Specification<TableRow> minimalSpecification =
        AggregationResultSpecifications.tableRowOfAggregationSortByColumn(
            sortTableColumn, getEvaluationRequest.sortDirection());
    Specification<TableRow> specification;
    if (getEvaluationRequest.filters() == null) {
      specification = minimalSpecification;
    } else {
      specification =
          Specification.allOf(
              Stream.concat(
                      Stream.of(minimalSpecification),
                      getEvaluationRequest.filters().stream()
                          .map(
                              filter ->
                                  AggregationResultSpecifications.createFilterSpecification(
                                      filter, evaluation)))
                  .toList());
    }
    Page<TableRow> tableRowPage =
        tableRowRepository.findAll(
            specification,
            PageRequest.of(getEvaluationRequest.page(), getEvaluationRequest.pageSize()));

    return EvaluationMapper.mapToApi(
        evaluation, tableRowPage.get().toList(), tableRowPage.getTotalElements());
  }

  public Evaluation getEvaluationInternal(UUID evaluationId) {
    return evaluationRepository
        .findByExternalId(evaluationId)
        .orElseThrow(
            () -> new NotFoundException(EVALUATION_WITH_ID_NOT_FOUND.formatted(evaluationId)));
  }

  public static void validateEvaluationCompleted(Evaluation evaluation) {
    if (!evaluation.getState().equals(AggregationResultState.COMPLETED)) {
      throw new BadRequestException(
          "Evaluation %s is not in state COMPLETED".formatted(evaluation.getExternalId()));
    }
  }

  private static TableColumn validateSortColumn(
      AttributeSelectionDto sortAttribute, Evaluation evaluation) {
    TableColumn sortTableColumn = AggregationResultUtil.getTableColumn(sortAttribute, evaluation);
    if (sortTableColumn == null) {
      sortTableColumn = evaluation.getTableColumns().getFirst();
    }
    return sortTableColumn;
  }

  @Transactional(readOnly = true)
  public GetDetailPageInformationResponse getDetailPageInformation(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    validateEvaluationCompleted(evaluation);
    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(Stream.of(evaluation));
    List<AnalysisDto> analyses = AnalysisMapper.getAnalyses(evaluation.getAnalyses());

    return new GetDetailPageInformationResponse(
        EvaluationMapper.mapToEvaluationInfo(evaluation),
        EvaluationMapper.mapToApi(evaluation.getTableColumns()),
        evaluation.getNumberOfTableRows(),
        resolvedUsers.get(evaluation.getCreatedByUserId()),
        analyses);
  }

  @Transactional
  public void prepareEvaluationForDeletion(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    validateBelongsToCurrentUserOrIsAdmin(evaluation);
    validateCopyProcessIsNotOngoing(evaluation);

    evaluation.setState(AggregationResultState.DELETING);
    evaluation.setPendingState(AggregationResultPendingState.TABLE_ROWS_REMOVAL);

    deactivateAndDeleteEmptyAutoReportSeries(evaluation);
    flagAllReportsForDeletion(evaluation);
  }

  private void deactivateAndDeleteEmptyAutoReportSeries(Evaluation evaluation) {
    List<ReportSeries> reportSeriesEntriesToDelete = new ArrayList<>();
    evaluation.getReportSeriesList().stream()
        .filter(reportSeries -> reportSeries.getReportType().equals(ReportType.AUTO))
        .forEach(
            reportSeries -> {
              reportSeries.deactivate();
              reportSeries.getReports().stream()
                  .filter(report -> report.getState().equals(AggregationResultState.PLANNED))
                  .findFirst()
                  .ifPresent(reportSeries::removeReport);
              if (reportSeries.getReports().isEmpty()) {
                reportSeriesEntriesToDelete.add(reportSeries);
              }
            });
    evaluation.removeReportSeriesEntries(reportSeriesEntriesToDelete);
  }

  private void flagAllReportsForDeletion(Evaluation evaluation) {
    evaluation
        .getReportSeriesList()
        .forEach(
            reportSeries ->
                reportSeries
                    .getReports()
                    .forEach(report -> report.setState(AggregationResultState.DELETING)));
  }

  @Transactional
  public void deleteEvaluation(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    evaluationRepository.delete(evaluation);
  }

  private void validateBelongsToCurrentUserOrIsAdmin(Evaluation evaluation) {
    UUID userId = CurrentUserHelper.getCurrentUserId();
    if (!userId.equals(evaluation.getCreatedByUserId())
        && CurrentUserHelper.currentUserHasNoRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN)) {
      throw new BadRequestException(
          "Evaluation with id '%s' does not belong to current user"
              .formatted(evaluation.getExternalId()));
    }
  }

  private void validateCopyProcessIsNotOngoing(Evaluation evaluation) {
    if (AggregationResultState.COPY_ONGOING.equals(evaluation.getState())) {
      throw new BadRequestException(
          "Copy process for evaluation with id '%s' is ongoing."
              .formatted(evaluation.getExternalId()));
    }
  }

  @Transactional(readOnly = true)
  public GetCompletenessDataResponse getCompletenessInformation(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    validateEvaluationCompleted(evaluation);

    List<CompletenessOfAttribute> completenessOfAttributes =
        evaluation.getTableColumns().stream()
            .filter(tableColumn -> !tableColumn.getValueType().equals(ValueType.PROCEDURE_ID))
            .map(
                tableColumn ->
                    getCompletenessOfAttribute(tableColumn, evaluation.getNumberOfTableRows()))
            .toList();

    return new GetCompletenessDataResponse(
        EvaluationMapper.mapToEvaluationInfo(evaluation), completenessOfAttributes);
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
  public GetReportSeriesEntriesOfEvaluationResponse getReportSeriesEntriesOfEvaluation(
      UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);

    List<ReportSeriesDto> reportSeriesDtos =
        evaluation.getReportSeriesList().stream().map(ReportMapper::mapToApi).toList();
    Set<UUID> userIds =
        reportSeriesDtos.stream().map(ReportSeriesDto::userId).collect(Collectors.toSet());
    Map<UUID, UserDto> resolvedUsers = userService.getResolvedUsers(userIds);
    return new GetReportSeriesEntriesOfEvaluationResponse(
        evaluation.getExternalId(),
        evaluation.getName(),
        evaluation.isAnonymized(),
        reportSeriesDtos,
        resolvedUsers);
  }

  @Transactional(readOnly = true)
  public Set<UUID> getReportSeriesIdsOfEvaluation(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);

    return evaluation.getReportSeriesList().stream()
        .map(ReportSeries::getExternalId)
        .collect(Collectors.toSet());
  }

  static boolean hasNoDiagrams(Evaluation evaluation) {
    return evaluation.getAnalyses().isEmpty()
        || evaluation.getAnalyses().stream().allMatch(analysis -> analysis.getDiagrams().isEmpty());
  }

  @Transactional
  public void setState(UUID evaluationId, AggregationResultState state) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    evaluation.setState(state);
  }

  @Transactional(readOnly = true)
  public AggregationResultStateInformation getStateInformation(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    return new AggregationResultStateInformation(
        evaluation.getState(), evaluation.getPendingState());
  }

  @Transactional
  public void aggregateData(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    try {
      dataAggregationService.collectTableRows(evaluation);
    } catch (Exception exception) {
      log.error("Error while collecting table rows", exception);
      evaluation.setState(AggregationResultState.FAILED);
    }
  }

  @Transactional
  public void minMaxDetermination(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    dataAggregationService.determineMinMaxNullUnknownValues(evaluation);
    evaluation.setPendingState(AggregationResultPendingState.ANALYSIS_CONDUCTION);
  }

  @Transactional
  public void removeTableRows(
      UUID evaluationId, AggregationResultPendingState pendingStateAfterRemoval) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);

    if (dataAggregationService.countTableRows(evaluation) <= 0) {
      evaluation.setPendingState(pendingStateAfterRemoval);
    } else {
      dataAggregationService.removeTableRows(evaluation);
    }
  }

  @Transactional(readOnly = true)
  public EvaluationTemplateData getEvaluationTemplateData(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    List<DataSourceDto> dataSourceDtos = determineDataSources(evaluation.getTableColumns());
    List<AnalysisTemplateData> analysisTemplateDatas =
        determineAnalysisTemplateDatas(evaluation.getAnalyses());
    return new EvaluationTemplateData(dataSourceDtos, analysisTemplateDatas);
  }

  private List<DataSourceDto> determineDataSources(List<TableColumn> tableColumns) {
    Map<String, DataSourceDto> keyToDataSourceMap = new LinkedHashMap<>();
    tableColumns.forEach(
        tableColumn -> {
          String key =
              "%s-%s".formatted(tableColumn.getDataSourceId(), tableColumn.getBusinessModuleName());
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

  private List<AnalysisTemplateData> determineAnalysisTemplateDatas(List<Analysis> analyses) {
    return analyses.stream()
        .map(
            analysis ->
                new AnalysisTemplateData(
                    analysis.getName(),
                    AnalysisMapper.mapToChartConfigurationDto(
                        Hibernate.unproxy(
                            analysis.getChartConfiguration(), ChartConfiguration.class),
                        true),
                    determineDiagramTemplateDatas(analysis.getDiagrams())))
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
  public void setStateToFailed(UUID evaluationId) {
    Evaluation evaluation = getEvaluationInternal(evaluationId);
    evaluation.setState(AggregationResultState.FAILED);
  }
}
