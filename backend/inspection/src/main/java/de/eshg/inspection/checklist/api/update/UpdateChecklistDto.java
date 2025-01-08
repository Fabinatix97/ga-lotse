/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.update;

import de.eshg.inspection.checklist.api.update.element.UpdateChecklistElementDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Schema(name = "UpdateChecklist")
public record UpdateChecklistDto(@NotEmpty @Valid List<UpdateChecklistElementDto> elements) {}
