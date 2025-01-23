/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.api;

import java.time.LocalDate;

public record ProcedureSearchParameters(
    String searchFirstName, String searchLastName, LocalDate searchDateOfBirth) {}
