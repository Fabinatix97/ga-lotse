/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import java.util.List;

public record EmployeePagedOmsProcedures(
    List<EmployeeOmsProcedureOverviewDto> proceduresPage, long totalNumberOfProcedures) {}
