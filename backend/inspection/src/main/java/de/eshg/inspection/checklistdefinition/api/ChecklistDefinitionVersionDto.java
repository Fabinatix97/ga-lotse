/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.checklist.api.context.ChecklistContextDto;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ChecklistDefinitionVersion")
public record ChecklistDefinitionVersionDto(
    @NotNull @Valid ChecklistContextDto context,
    @Valid UserDto modifiedBy,
    @Valid ObjectTypeRefDto objectType,
    Boolean isCoreChecklist,
    Boolean hasDraft) {}
