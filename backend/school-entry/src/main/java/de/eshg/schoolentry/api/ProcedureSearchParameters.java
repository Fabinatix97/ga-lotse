/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import java.time.LocalDate;

public record ProcedureSearchParameters(
    String searchFirstName, String searchLastName, LocalDate searchDateOfBirth) {}
