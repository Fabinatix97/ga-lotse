/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.report.ReportSeries;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ReportSeriesRepository
    extends JpaRepository<ReportSeries, Long>, JpaSpecificationExecutor<ReportSeries> {

  Optional<ReportSeries> findByExternalId(UUID externalId);
}
