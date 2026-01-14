/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update;

import jakarta.validation.Valid;

public record UpdateChecklistRequest(@Valid UpdateChecklistDto checklist) {}
