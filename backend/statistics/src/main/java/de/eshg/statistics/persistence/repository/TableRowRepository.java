/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.AbstractAggregationResult;
import de.eshg.statistics.persistence.entity.TableRow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TableRowRepository
    extends JpaRepository<TableRow, Long>, JpaSpecificationExecutor<TableRow> {
  Long countTableRowByAggregationResult(AbstractAggregationResult aggregationResult);

  Page<TableRow> findAllByAggregationResult(
      AbstractAggregationResult aggregationResult, Pageable pageable);
}
