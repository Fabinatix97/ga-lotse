/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence;

import de.eshg.inspection.report.persistence.element.ReportElement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InspectionReportElementRepository extends JpaRepository<ReportElement, Long> {}
