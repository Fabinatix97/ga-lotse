/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update;

import de.eshg.inspection.checklist.api.ChecklistDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UpdateChecklistResponse(@Valid @NotNull ChecklistDto checklist) {}
