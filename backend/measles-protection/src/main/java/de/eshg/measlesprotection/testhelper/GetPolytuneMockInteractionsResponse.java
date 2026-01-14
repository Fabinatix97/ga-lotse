/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.testhelper;

import jakarta.validation.Valid;
import java.util.List;

public record GetPolytuneMockInteractionsResponse(
    @Valid List<PolytuneMockInteraction> interactions) {}
