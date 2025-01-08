/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.repository;

import de.eshg.statistics.persistence.entity.AggregationResultState;
import de.eshg.statistics.persistence.entity.report.Report;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

  Optional<Report> findByExternalId(UUID externalId);

  Optional<Report> findFirstByExecutionDateLessThanEqualAndStateOrderByIdAsc(
      LocalDate date, AggregationResultState state);
}
