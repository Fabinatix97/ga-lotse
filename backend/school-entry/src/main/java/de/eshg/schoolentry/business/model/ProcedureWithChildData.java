/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;

public record ProcedureWithChildData(SchoolEntryProcedure procedure, ChildData child) {}
