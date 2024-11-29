/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.domain.model.SequencedBaseEntity_;
import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.AggregationResultPendingState;
import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.TableRow;
import de.eshg.statistics.persistence.repository.TableRowRepository;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractAggregationResultService {
  private static final Logger log = LoggerFactory.getLogger(AbstractAggregationResultService.class);
  private static final long DEFAULT_MAX_DATA_ROW_EXPORTABLE = 10000L;
  private static long maxDataRowExportable = DEFAULT_MAX_DATA_ROW_EXPORTABLE;

  protected final DataAggregationService dataAggregationService;
  protected final TableRowRepository tableRowRepository;
  private final int tableRowPageSize;

  protected AbstractAggregationResultService(
      DataAggregationService dataAggregationService,
      TableRowRepository tableRowRepository,
      int tableRowPageSize) {
    this.dataAggregationService = dataAggregationService;
    this.tableRowRepository = tableRowRepository;
    this.tableRowPageSize = tableRowPageSize;
    if (this.tableRowPageSize <= 0) {
      throw new IllegalArgumentException(
          "'eshg.statistics.tablerows.pagesize' must be greater than 0");
    }
  }

  public static void resetMaxDataRowExportable() {
    maxDataRowExportable = DEFAULT_MAX_DATA_ROW_EXPORTABLE;
  }

  // only for tests
  public static void setMaxDataRowExportable(long dataRowCount) {
    maxDataRowExportable = dataRowCount;
  }

  public static long getMaxDataRowExportable() {
    return maxDataRowExportable;
  }

  public abstract AbstractAggregationResult getAbstractAggregationResultInternal(UUID id);

  public int getTableRowPageSize() {
    return tableRowPageSize;
  }

  @Transactional(readOnly = true)
  public AggregationResultStateInformation getStateInformation(UUID id) {
    AbstractAggregationResult aggregationResult = getAbstractAggregationResultInternal(id);
    return new AggregationResultStateInformation(
        aggregationResult.getState(), aggregationResult.getPendingState());
  }

  @Transactional
  public void setStateToFailed(UUID id) {
    AbstractAggregationResult aggregationResult = getAbstractAggregationResultInternal(id);
    aggregationResult.setState(AggregationResultState.FAILED);
  }

  @Transactional
  public void aggregateData(UUID id) {
    AbstractAggregationResult aggregationResult = getAbstractAggregationResultInternal(id);
    try {
      dataAggregationService.collectTableRows(aggregationResult);
    } catch (Exception exception) {
      log.error("Error while collecting table rows for {}", id, exception);
      aggregationResult.setState(AggregationResultState.FAILED);
    }
  }

  @Transactional
  public void minMaxDetermination(UUID id) {
    AbstractAggregationResult aggregationResult = getAbstractAggregationResultInternal(id);
    dataAggregationService.determineMinMaxNullUnknownValues(aggregationResult);
    aggregationResult.setPendingState(AggregationResultPendingState.ANALYSIS_CONDUCTION);
  }

  protected void removeTableRows(AbstractAggregationResult aggregationResult) {
    tableRowRepository.deleteAll(
        tableRowRepository
            .findAllByAggregationResult(aggregationResult, Pageable.ofSize(tableRowPageSize))
            .getContent());
  }

  public Long countTableRows(AbstractAggregationResult aggregationResult) {
    return tableRowRepository.countTableRowByAggregationResult(aggregationResult);
  }

  public Page<TableRow> getTableRowPage(AbstractAggregationResult aggregationResult, int page) {
    return tableRowRepository.findAllByAggregationResult(
        aggregationResult,
        PageRequest.of(
            page, tableRowPageSize, Sort.by(Sort.Direction.ASC, SequencedBaseEntity_.ID)));
  }
}
