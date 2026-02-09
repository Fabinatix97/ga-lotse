/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import java.time.LocalDate;

public record ProcedureFilterParameters(LocalDate appointmentDay) {}
