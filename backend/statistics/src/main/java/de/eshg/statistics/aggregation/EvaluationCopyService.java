/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.statistics.api.evaluation.CloneEvaluationRequest;
import de.eshg.statistics.mapper.AnalysisMapper;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.Analysis;
import de.eshg.statistics.persistence.entity.AnonymizationConfiguration;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.CellEntry;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import de.eshg.statistics.persistence.entity.Diagram;
import de.eshg.statistics.persistence.entity.Evaluation;
import de.eshg.statistics.persistence.entity.MinMaxNullUnknownValues;
import de.eshg.statistics.persistence.entity.TableColumn;
import de.eshg.statistics.persistence.entity.TableColumnValueType;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.entity.ValueToMeaning;
import de.eshg.statistics.persistence.entity.chart.BarChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ChoroplethMapConfiguration;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import de.eshg.statistics.persistence.entity.chart.HistogramChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.LineChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.PieChartConfiguration;
import de.eshg.statistics.persistence.entity.chart.ScatterChartConfiguration;
import de.eshg.statistics.persistence.entity.diagramdata.BarChartData;
import de.eshg.statistics.persistence.entity.diagramdata.BarGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.ChoroplethMapData;
import de.eshg.statistics.persistence.entity.diagramdata.DataPoint;
import de.eshg.statistics.persistence.entity.diagramdata.DataPointGroup;
import de.eshg.statistics.persistence.entity.diagramdata.DiagramData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramChartData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToCount;
import de.eshg.statistics.persistence.entity.diagramdata.KeyToValue;
import de.eshg.statistics.persistence.entity.diagramdata.LineOrScatterChartData;
import de.eshg.statistics.persistence.entity.diagramdata.PieChartData;
import de.eshg.statistics.persistence.entity.diagramdata.TrendLine;
import de.eshg.statistics.persistence.entity.entry.BooleanEntry;
import de.eshg.statistics.persistence.entity.entry.DecimalEntry;
import de.eshg.statistics.persistence.entity.entry.IntegerEntry;
import de.eshg.statistics.persistence.entity.entry.TextEntry;
import de.eshg.statistics.persistence.entity.entry.UuidEntry;
import de.eshg.statistics.persistence.entity.filter.BooleanFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DateFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.DecimalValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerRangeFilterParameter;
import de.eshg.statistics.persistence.entity.filter.IntegerValueFilterParameter;
import de.eshg.statistics.persistence.entity.filter.NullFilterParameter;
import de.eshg.statistics.persistence.entity.filter.TextFilterParameter;
import de.eshg.statistics.persistence.entity.filter.ValueOptionFilterParameter;
import de.eshg.statistics.persistence.repository.EvaluationRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvaluationCopyService {
  public static final String UNEXPECTED_VALUE = "Unexpected value: %s";
  private final EvaluationRepository evaluationRepository;
  private final EvaluationService evaluationService;

  public EvaluationCopyService(
      EvaluationRepository evaluationRepository, EvaluationService evaluationService) {
    this.evaluationRepository = evaluationRepository;
    this.evaluationService = evaluationService;
  }

  @Transactional
  public UUID addCopy(CloneEvaluationRequest cloneEvaluationRequest) {
    Evaluation original =
        evaluationService.getEvaluationInternal(cloneEvaluationRequest.originalEvaluationId());
    EvaluationService.validateEvaluationCompleted(original);
    original.setState(AggregationResultState.COPY_ONGOING);

    Evaluation copy = new Evaluation();
    copy.setState(AggregationResultState.CREATING);
    copy.setPendingState(AggregationResultPendingState.COPY_ONGOING);
    copy.setTimeRangeStart(original.getTimeRangeStart());
    copy.setTimeRangeEnd(original.getTimeRangeEnd());
    copy.setDataSensitivity(original.getDataSensitivity());
    copy.setName(cloneEvaluationRequest.clonedEvaluationName());
    copy.setNumberOfTableRows(original.getNumberOfTableRows());
    copy.addTableColumns(copyTableColumnsWithoutCellEntries(original.getTableColumns()));
    copy.addAnalyses(copyAnalyses(original.getAnalyses()));

    return evaluationRepository.save(copy).getExternalId();
  }

  private List<TableColumn> copyTableColumnsWithoutCellEntries(List<TableColumn> tableColumns) {
    return tableColumns.stream()
        .map(
            original -> {
              TableColumn copy =
                  copyTableColumnWithoutCellEntriesAndMinMaxValuesAndAnonymization(original, true);
              Optional.ofNullable(original.getMinMaxNullUnknownValues())
                  .map(this::copyMinMaxNullUnknownValues)
                  .ifPresent(copy::setMinMaxNullUnknownValues);
              if (original.getAnonymizationConfiguration() != null) {
                AnonymizationConfiguration anonymizationConfiguration =
                    new AnonymizationConfiguration();
                copy.setAnonymizationConfiguration(anonymizationConfiguration);
                copyAnonymizationConfiguration(
                    anonymizationConfiguration, original.getAnonymizationConfiguration());
              }
              return copy;
            })
        .toList();
  }

  public static TableColumn copyTableColumnWithoutCellEntriesAndMinMaxValuesAndAnonymization(
      TableColumn original, boolean keepIntervalValueType) {
    TableColumn copy = new TableColumn();
    copy.setBusinessModuleName(original.getBusinessModuleName());
    copy.setBusinessModuleAttributeCode(original.getBusinessModuleAttributeCode());
    copy.setBusinessModuleAttributeName(original.getBusinessModuleAttributeName());
    copy.setBaseModuleAttributeCode(original.getBaseModuleAttributeCode());
    copy.setBaseModuleAttributeName(original.getBaseModuleAttributeName());
    copy.setValueType(getCorrectValueType(original.getValueType(), keepIntervalValueType));
    copy.setUnit(original.getUnit());
    copy.setDataSourceName(original.getDataSourceName());
    copy.setDataSourceId(original.getDataSourceId());
    copy.setMandatory(original.isMandatory());
    copy.setSearchKey(original.getSearchKey());

    copy.addValueToMeanings(copyValueToMeanings(original.getValueToMeanings()));
    return copy;
  }

  public static TableColumnValueType getCorrectValueType(
      TableColumnValueType valueType, boolean keepIntervalValueType) {
    if (keepIntervalValueType) {
      return valueType;
    } else {
      return switch (valueType) {
        case DECIMAL_INTERVAL -> TableColumnValueType.DECIMAL;
        case INTEGER_INTERVAL -> TableColumnValueType.INTEGER;
        default -> valueType;
      };
    }
  }

  private static List<ValueToMeaning> copyValueToMeanings(List<ValueToMeaning> valueToMeanings) {
    return valueToMeanings.stream()
        .map(
            original -> {
              ValueToMeaning copy = new ValueToMeaning();
              copy.setValue(original.getValue());
              copy.setMeaning(original.getMeaning());
              copy.setUnknownValue(original.isUnknownValue());
              return copy;
            })
        .toList();
  }

  private MinMaxNullUnknownValues copyMinMaxNullUnknownValues(MinMaxNullUnknownValues original) {
    MinMaxNullUnknownValues copy = new MinMaxNullUnknownValues();
    copy.setMinDecimal(original.getMinDecimal());
    copy.setMaxDecimal(original.getMaxDecimal());
    copy.setMinInteger(original.getMinInteger());
    copy.setMaxInteger(original.getMaxInteger());
    copy.setNumberOfNullEntries(original.getNumberOfNullEntries());
    copy.setNumberOfUnknownEntries(original.getNumberOfUnknownEntries());
    copy.setUnknownValue(original.getUnknownValue());
    return copy;
  }

  static void copyAnonymizationConfiguration(
      AnonymizationConfiguration currentConfiguration,
      AnonymizationConfiguration newConfiguration) {
    currentConfiguration.setDataPrivacyCategory(newConfiguration.getDataPrivacyCategory());
    currentConfiguration.setLDiversity(newConfiguration.getLDiversity());
    currentConfiguration.setTCloseness(newConfiguration.getTCloseness());
    currentConfiguration.setIntervalCount(newConfiguration.getIntervalCount());
    currentConfiguration.setMinDecimalInclusive(newConfiguration.getMinDecimalInclusive());
    currentConfiguration.setMaxDecimalInclusive(newConfiguration.getMaxDecimalInclusive());
    currentConfiguration.setDecimalBorders(newConfiguration.getDecimalBorders());
    currentConfiguration.setMinIntegerInclusive(newConfiguration.getMinIntegerInclusive());
    currentConfiguration.setMaxIntegerInclusive(newConfiguration.getMaxIntegerInclusive());
    currentConfiguration.setIntegerBorders(newConfiguration.getIntegerBorders());
    currentConfiguration.setTClosenessHierarchyEntries(
        newConfiguration.getTClosenessHierarchyEntries());
  }

  private List<Analysis> copyAnalyses(List<Analysis> analyses) {
    return analyses.stream()
        .map(
            originalAnalysis -> {
              Analysis copy = new Analysis();
              copy.setName(originalAnalysis.getName());
              ChartConfiguration originalChartConfiguration =
                  AnalysisMapper.getChartConfiguration(originalAnalysis);
              ChartConfiguration chartConfigurationCopy =
                  copyChartConfiguration(originalChartConfiguration, true);
              copy.setChartConfiguration(chartConfigurationCopy);
              copy.addDiagrams(
                  copyDiagramsWithEmptyData(
                      originalAnalysis.getDiagrams(), chartConfigurationCopy));
              return copy;
            })
        .toList();
  }

  public static List<Diagram> copyDiagramsWithEmptyData(
      List<Diagram> diagrams, ChartConfiguration chartConfiguration) {
    return diagrams.stream()
        .map(
            originalDiagram -> {
              Diagram copy = new Diagram();
              copy.setTitle(originalDiagram.getTitle());
              copy.setDescription(originalDiagram.getDescription());
              copy.addFilters(copyFilterParameters(originalDiagram.getFilters()));
              copy.setDiagramData(AnalysisService.getEmptyDiagramData(chartConfiguration));
              copy.setDiagramDataEmpty(true);
              copy.setOriginalDiagramId(originalDiagram.getId());
              return copy;
            })
        .toList();
  }

  private static List<AbstractFilterParameter> copyFilterParameters(
      List<AbstractFilterParameter> filterParameters) {
    return filterParameters.stream().map(EvaluationCopyService::copyFilterParameter).toList();
  }

  private static AbstractFilterParameter copyFilterParameter(AbstractFilterParameter original) {
    return switch (original) {
      case BooleanFilterParameter booleanFilterParameter ->
          copyBooleanFilterParameter(booleanFilterParameter);
      case DateFilterParameter dateFilterParameter -> copyDateFilterParameter(dateFilterParameter);
      case DecimalRangeFilterParameter decimalRangeFilterParameter ->
          copyDecimalRangeFilterParameter(decimalRangeFilterParameter);
      case DecimalValueFilterParameter decimalValueFilterParameter ->
          copyDecimalValueFilterParameter(decimalValueFilterParameter);
      case IntegerRangeFilterParameter integerRangeFilterParameter ->
          copyIntegerRangeFilterParameter(integerRangeFilterParameter);
      case IntegerValueFilterParameter integerValueFilterParameter ->
          copyIntegerValueFilterParameter(integerValueFilterParameter);
      case NullFilterParameter nullFilterParameter -> copyNullFilterParameter(nullFilterParameter);
      case TextFilterParameter textFilterParameter -> copyTextFilterParameter(textFilterParameter);
      case ValueOptionFilterParameter valueOptionFilterParameter ->
          copyValueOptionFilterParameter(valueOptionFilterParameter);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(original));
    };
  }

  private static BooleanFilterParameter copyBooleanFilterParameter(
      BooleanFilterParameter original) {
    BooleanFilterParameter copy = new BooleanFilterParameter();
    copy.setSearchForTrue(original.isSearchForTrue());
    copy.setSearchForFalse(original.isSearchForFalse());
    copy.setSearchForNull(original.isSearchForNull());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static DateFilterParameter copyDateFilterParameter(DateFilterParameter original) {
    DateFilterParameter copy = new DateFilterParameter();
    copy.setValue(original.getValue());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static DecimalRangeFilterParameter copyDecimalRangeFilterParameter(
      DecimalRangeFilterParameter original) {
    DecimalRangeFilterParameter copy = new DecimalRangeFilterParameter();
    copy.setMinValueInclusive(original.getMinValueInclusive());
    copy.setMaxValueInclusive(original.getMaxValueInclusive());
    copy.setWithNullValues(original.isWithNullValues());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static DecimalValueFilterParameter copyDecimalValueFilterParameter(
      DecimalValueFilterParameter original) {
    DecimalValueFilterParameter copy = new DecimalValueFilterParameter();
    copy.setValue(original.getValue());
    copy.setNumericComparison(original.getNumericComparison());
    copy.setWithNullValues(original.isWithNullValues());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static IntegerRangeFilterParameter copyIntegerRangeFilterParameter(
      IntegerRangeFilterParameter original) {
    IntegerRangeFilterParameter copy = new IntegerRangeFilterParameter();
    copy.setMinValueInclusive(original.getMinValueInclusive());
    copy.setMaxValueInclusive(original.getMaxValueInclusive());
    copy.setWithNullValues(original.isWithNullValues());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static IntegerValueFilterParameter copyIntegerValueFilterParameter(
      IntegerValueFilterParameter original) {
    IntegerValueFilterParameter copy = new IntegerValueFilterParameter();
    copy.setValue(original.getValue());
    copy.setNumericComparison(original.getNumericComparison());
    copy.setWithNullValues(original.isWithNullValues());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static NullFilterParameter copyNullFilterParameter(NullFilterParameter original) {
    NullFilterParameter copy = new NullFilterParameter();
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static TextFilterParameter copyTextFilterParameter(TextFilterParameter original) {
    TextFilterParameter copy = new TextFilterParameter();
    copy.setValue(original.getValue());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static ValueOptionFilterParameter copyValueOptionFilterParameter(
      ValueOptionFilterParameter original) {
    ValueOptionFilterParameter copy = new ValueOptionFilterParameter();
    copy.addSearchValues(original.getSearchValues());
    copy.setSearchForNull(original.isSearchForNull());
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private TrendLine copyTrendLine(TrendLine original) {
    TrendLine copy = new TrendLine();
    copy.setLineSlope(original.getLineSlope());
    copy.setLineOffset(original.getLineOffset());
    return copy;
  }

  private static AttributeSelection copyAttributeSelection(AttributeSelection original) {
    AttributeSelection copy = new AttributeSelection();
    copy.setBusinessModuleName(original.getBusinessModuleName());
    copy.setDataSourceId(original.getDataSourceId());
    copy.setBusinessModuleAttributeCode(original.getBusinessModuleAttributeCode());
    copy.setBaseModuleAttributeCode(original.getBaseModuleAttributeCode());
    copy.setSearchKey(original.getSearchKey());
    return copy;
  }

  public static ChartConfiguration copyChartConfiguration(
      ChartConfiguration original, boolean copyHistogramBins) {
    return switch (original) {
      case BarChartConfiguration barChartConfiguration ->
          copyBarChartConfiguration(barChartConfiguration);
      case ChoroplethMapConfiguration choroplethMapConfiguration ->
          copyChoroplethMapConfiguration(choroplethMapConfiguration);
      case HistogramChartConfiguration histogramChartConfiguration ->
          copyHistogramChartConfiguration(histogramChartConfiguration, copyHistogramBins);
      case LineChartConfiguration lineChartConfiguration ->
          copyLineChartConfiguration(lineChartConfiguration);
      case PieChartConfiguration pieChartConfiguration ->
          copyPieChartConfiguration(pieChartConfiguration);
      case ScatterChartConfiguration scatterChartConfiguration ->
          copyScatterChartConfiguration(scatterChartConfiguration);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(original));
    };
  }

  private static BarChartConfiguration copyBarChartConfiguration(BarChartConfiguration original) {
    BarChartConfiguration copy = new BarChartConfiguration();
    copy.setPrimaryAttributeSelection(
        copyAttributeSelection(original.getPrimaryAttributeSelection()));
    Optional.ofNullable(original.getSecondaryAttributeSelection())
        .map(EvaluationCopyService::copyAttributeSelection)
        .ifPresent(copy::setSecondaryAttributeSelection);
    copy.setScaling(original.getScaling());
    copy.setGrouping(original.getGrouping());
    copy.setOrientation(original.getOrientation());
    return copy;
  }

  private static ChoroplethMapConfiguration copyChoroplethMapConfiguration(
      ChoroplethMapConfiguration original) {
    ChoroplethMapConfiguration copy = new ChoroplethMapConfiguration();
    copy.setPrimaryAttributeSelection(
        copyAttributeSelection(original.getPrimaryAttributeSelection()));
    Optional.ofNullable(original.getSecondaryAttributeSelection())
        .map(EvaluationCopyService::copyAttributeSelection)
        .ifPresent(copy::setSecondaryAttributeSelection);
    copy.setCalculation(original.getCalculation());
    copy.setGeoJson(original.getGeoJson());
    copy.setColorScheme(original.getColorScheme());
    return copy;
  }

  private static HistogramChartConfiguration copyHistogramChartConfiguration(
      HistogramChartConfiguration original, boolean copyHistogramBins) {
    HistogramChartConfiguration copy = new HistogramChartConfiguration();
    copy.setPrimaryAttributeSelection(
        copyAttributeSelection(original.getPrimaryAttributeSelection()));
    Optional.ofNullable(original.getSecondaryAttributeSelection())
        .map(EvaluationCopyService::copyAttributeSelection)
        .ifPresent(copy::setSecondaryAttributeSelection);
    copy.setScaling(original.getScaling());
    copy.setGrouping(original.getGrouping());
    copy.setBinningMode(original.getBinningMode());
    copy.setNumberOfBins(original.getNumberOfBins());
    copy.setMinBin(original.getMinBin());
    copy.setMaxBin(original.getMaxBin());
    if (copyHistogramBins) {
      copy.addBins(copyHistogramBins(original.getBins()));
    }
    return copy;
  }

  private static List<HistogramBin> copyHistogramBins(List<HistogramBin> histogramBins) {
    return histogramBins.stream()
        .map(
            original -> {
              HistogramBin copy = new HistogramBin();
              copy.setLowerBound(original.getLowerBound());
              copy.setUpperBound(original.getUpperBound());
              return copy;
            })
        .toList();
  }

  private static LineChartConfiguration copyLineChartConfiguration(
      LineChartConfiguration original) {
    LineChartConfiguration copy = new LineChartConfiguration();
    copy.setXAttributeSelection(copyAttributeSelection(original.getXAttributeSelection()));
    copy.setYAttributeSelection(copyAttributeSelection(original.getYAttributeSelection()));
    Optional.ofNullable(original.getSecondaryAttributeSelection())
        .map(EvaluationCopyService::copyAttributeSelection)
        .ifPresent(copy::setSecondaryAttributeSelection);
    copy.setRange(original.getRange());
    return copy;
  }

  private static PieChartConfiguration copyPieChartConfiguration(PieChartConfiguration original) {
    PieChartConfiguration copy = new PieChartConfiguration();
    copy.setAttributeSelection(copyAttributeSelection(original.getAttributeSelection()));
    return copy;
  }

  private static ScatterChartConfiguration copyScatterChartConfiguration(
      ScatterChartConfiguration original) {
    ScatterChartConfiguration copy = new ScatterChartConfiguration();
    copy.setXAttributeSelection(copyAttributeSelection(original.getXAttributeSelection()));
    copy.setYAttributeSelection(copyAttributeSelection(original.getYAttributeSelection()));
    Optional.ofNullable(original.getSecondaryAttributeSelection())
        .map(EvaluationCopyService::copyAttributeSelection)
        .ifPresent(copy::setSecondaryAttributeSelection);
    copy.setRange(original.getRange());
    copy.setTrendLine(original.showTrendLine());
    return copy;
  }

  @Transactional
  public void workOnCopy(UUID originalId, UUID copyId) {
    Evaluation original = evaluationService.getEvaluationInternal(originalId);
    Evaluation copy = evaluationService.getEvaluationInternal(copyId);

    if (!original.getState().equals(AggregationResultState.COPY_ONGOING)) {
      return;
    }

    try {
      Optional<Diagram> diagramNeedsDataCopiedOptional =
          AnalysisService.findDiagram(copy, Diagram::isDiagramDataEmpty).stream().findFirst();
      if (diagramNeedsDataCopiedOptional.isPresent()) {
        copyDiagramData(diagramNeedsDataCopiedOptional.get(), original);
        return;
      }
      copyTableRows(copy, original);
    } catch (Exception exception) {
      copy.setState(AggregationResultState.FAILED);
      copy.setPendingState(null);
      original.setState(AggregationResultState.COMPLETED);
    }
  }

  private void copyDiagramData(Diagram diagramCopy, Evaluation original) {
    Optional<Diagram> diagramOriginalOptional =
        AnalysisService.findDiagram(
                original, diagram -> diagram.getId().equals(diagramCopy.getOriginalDiagramId()))
            .stream()
            .findFirst();
    if (diagramOriginalOptional.isPresent()) {
      copyDiagramData(diagramCopy.getDiagramData(), diagramOriginalOptional.get().getDiagramData());
    } else {
      throw new BadRequestException(
          "Diagram %s not found".formatted(diagramCopy.getOriginalDiagramId()));
    }
  }

  private void copyDiagramData(DiagramData copy, DiagramData original) {
    switch (copy) {
      case BarChartData barChartData ->
          barChartData.addBarGroupDatas(
              copyBarGroupDatas(((BarChartData) original).getBarGroupDatas()));
      case ChoroplethMapData choroplethMapData ->
          choroplethMapData.addKeyToValues(
              copyKeyToValues(((ChoroplethMapData) original).getKeyToValues()));
      case HistogramChartData histogramChartData -> {
        HistogramChartConfiguration chartConfiguration =
            (HistogramChartConfiguration)
                AnalysisMapper.getChartConfiguration(histogramChartData.getDiagram().getAnalysis());
        HistogramChartData originalHistogramChartData = (HistogramChartData) original;
        for (int i = 0; i < originalHistogramChartData.getHistogramGroupDatas().size(); i++) {
          histogramChartData.addHistogramGroupData(
              copyHistogramGroupData(
                  originalHistogramChartData.getHistogramGroupDatas().get(i),
                  chartConfiguration.getBins().get(i)));
        }
      }
      case LineOrScatterChartData lineOrScatterChartData ->
          lineOrScatterChartData.addDataPointGroups(
              copyDataPointGroups(((LineOrScatterChartData) original).getDataPointGroups()));
      case PieChartData pieChartData ->
          pieChartData.addKeyToCounts(copyKeyToCounts(((PieChartData) original).getKeyToCounts()));
      default -> throw new IllegalStateException(UNEXPECTED_VALUE + copy);
    }

    copy.setEvaluatedDataAmount(original.getEvaluatedDataAmount());
    copy.getDiagram().setDiagramDataEmpty(false);
  }

  private List<BarGroupData> copyBarGroupDatas(List<BarGroupData> barGroupDatas) {
    return barGroupDatas.stream()
        .map(
            original -> {
              BarGroupData copy = new BarGroupData();
              copy.setKey(original.getKey());
              copy.addKeyToCounts(copyKeyToCounts(original.getKeyToCounts()));
              return copy;
            })
        .toList();
  }

  private List<KeyToValue> copyKeyToValues(List<KeyToValue> keyToValues) {
    return keyToValues.stream()
        .map(
            original -> {
              KeyToValue copy = new KeyToValue();
              copy.setKey(original.getKey());
              copy.setValue(original.getValue());
              return copy;
            })
        .toList();
  }

  private List<DataPointGroup> copyDataPointGroups(List<DataPointGroup> dataPointGroups) {
    return dataPointGroups.stream()
        .map(
            original -> {
              DataPointGroup copy = new DataPointGroup();
              copy.setKey(original.getKey());
              copy.addDataPoints(copyDataPoints(original.getDataPoints()));
              Optional.ofNullable(original.getTrendLine())
                  .map(this::copyTrendLine)
                  .ifPresent(copy::setTrendLine);
              return copy;
            })
        .toList();
  }

  private List<DataPoint> copyDataPoints(List<DataPoint> dataPoints) {
    return dataPoints.stream()
        .map(
            original -> {
              DataPoint copy = new DataPoint();
              copy.setXCoordinate(original.getXCoordinate());
              copy.setYCoordinate(original.getYCoordinate());
              return copy;
            })
        .toList();
  }

  private HistogramGroupData copyHistogramGroupData(
      HistogramGroupData histogramGroupData, HistogramBin histogramBin) {
    HistogramGroupData copy = new HistogramGroupData();
    copy.setHistogramBin(histogramBin);
    copy.setCount(histogramGroupData.getCount());
    copy.addKeyToCounts(copyKeyToCounts(histogramGroupData.getKeyToCounts()));
    return copy;
  }

  private List<KeyToCount> copyKeyToCounts(List<KeyToCount> keyToCounts) {
    return keyToCounts.stream()
        .map(
            original -> {
              KeyToCount copy = new KeyToCount();
              copy.setKey(original.getKey());
              copy.setCount(original.getCount());
              return copy;
            })
        .toList();
  }

  void copyTableRows(Evaluation copy, Evaluation original) {
    Long tableRowsCount = evaluationService.countTableRows(copy);
    int page = (int) (tableRowsCount / evaluationService.getTableRowPageSize());
    Page<TableRow> tableRows = evaluationService.getTableRowPage(original, page);

    copy.addTableRows(
        tableRows.get().map(tableRow -> copyTableRow(tableRow, copy.getTableColumns())).toList());

    if (tableRowsCount + tableRows.getSize() >= copy.getNumberOfTableRows()) {
      original.setState(AggregationResultState.COMPLETED);
      copy.setState(AggregationResultState.COMPLETED);
      copy.setPendingState(null);
    }
  }

  private TableRow copyTableRow(TableRow tableRow, List<TableColumn> tableColumns) {
    TableRow tableRowCopy = new TableRow();
    int size = tableRow.getCellEntries().size();
    for (int i = 0; i < size; i++) {
      CellEntry cellEntryCopy = copyCellEntry(tableRow.getCellEntries().get(i));
      tableRowCopy.addCellEntry(cellEntryCopy);
      tableColumns.get(i).addCellEntry(cellEntryCopy);
    }
    return tableRowCopy;
  }

  private CellEntry copyCellEntry(CellEntry original) {
    return switch (original) {
      case BooleanEntry booleanEntry -> copyBooleanEntry(booleanEntry);
      case DecimalEntry decimalEntry -> copyDecimalEntry(decimalEntry);
      case IntegerEntry integerEntry -> copyIntegerEntry(integerEntry);
      case TextEntry textEntry -> copyTextEntry(textEntry);
      case UuidEntry uuidEntry -> copyUuidEntry(uuidEntry);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE.formatted(original));
    };
  }

  private BooleanEntry copyBooleanEntry(BooleanEntry original) {
    BooleanEntry copy = new BooleanEntry();
    copy.setBoolValue(original.getBoolValue());
    return copy;
  }

  private DecimalEntry copyDecimalEntry(DecimalEntry original) {
    DecimalEntry copy = new DecimalEntry();
    copy.setBigDecimalValue(original.getBigDecimalValue());
    copy.setDecimalLowerBound(original.getDecimalLowerBound());
    copy.setDecimalUpperBound(original.getDecimalUpperBound());
    return copy;
  }

  private IntegerEntry copyIntegerEntry(IntegerEntry original) {
    IntegerEntry copy = new IntegerEntry();
    copy.setIntegerValue(original.getIntegerValue());
    copy.setIntegerLowerBound(original.getIntegerLowerBound());
    copy.setIntegerUpperBound(original.getIntegerUpperBound());
    return copy;
  }

  private TextEntry copyTextEntry(TextEntry original) {
    TextEntry copy = new TextEntry();
    copy.setTextValue(original.getTextValue());
    return copy;
  }

  private UuidEntry copyUuidEntry(UuidEntry original) {
    UuidEntry copy = new UuidEntry();
    copy.setUuidValue(original.getUuidValue());
    return copy;
  }
}
