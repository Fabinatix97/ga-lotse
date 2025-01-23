/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.persistence;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureReferenceForStatisticsRepository
    extends JpaRepository<ProcedureReferenceForStatistics, Long> {

  List<ProcedureReferenceForStatistics> findAllByExternalIdIn(List<UUID> procedureReferences);

  long deleteProcedureReferenceForStatisticsByCreatedAtLessThan(Instant instant);
}
