/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureReferenceForStatisticsRepository
    extends JpaRepository<ProcedureReferenceForStatistics, Long> {}
