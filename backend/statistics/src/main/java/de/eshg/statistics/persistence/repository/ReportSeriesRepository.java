/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.report.ReportSeries;
import de.eshg.statistics.persistence.entity.report.ReportType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportSeriesRepository extends JpaRepository<ReportSeries, Long> {

  Optional<ReportSeries> findByExternalId(UUID externalId);

  @Query(
      "SELECT DISTINCT rs FROM ReportSeries rs JOIN rs.reports report WHERE report.state = 'COMPLETED'")
  Page<ReportSeries> findAllWithAtLeastOneCompletedReport(Pageable pageRequest);

  @Query(
      "SELECT DISTINCT rs FROM ReportSeries rs JOIN rs.reports report WHERE report.state = 'COMPLETED' AND rs.reportType = :type")
  Page<ReportSeries> findAllWithAtLeastOneCompletedReportAndType(
      @Param("type") ReportType type, Pageable pageable);
}
