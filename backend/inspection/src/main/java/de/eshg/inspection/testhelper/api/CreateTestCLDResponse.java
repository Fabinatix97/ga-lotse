/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper.api;

import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateTestCLDResponse(@NotNull @Valid List<ChecklistDefinitionDto> clds) {}
