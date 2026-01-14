/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import java.util.List;

public record EmployeePagedOmsProcedures(
    List<EmployeeOmsProcedureOverviewDto> proceduresPage, long totalNumberOfProcedures) {}
