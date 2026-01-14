/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.vaccination;

import jakarta.validation.Valid;

public record VaccinationCheckResponse(@Valid MeaslesVaccinationDto status) {}
