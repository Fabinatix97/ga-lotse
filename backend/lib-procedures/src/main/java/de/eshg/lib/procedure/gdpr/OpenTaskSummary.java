/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.gdpr;

import java.time.LocalDate;

public record OpenTaskSummary(int count, LocalDate earliestDueDate) {}
