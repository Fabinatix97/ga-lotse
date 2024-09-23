/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition.api;

import static de.eshg.inspection.checklistdefinition.ChecklistDefinitionCentralRepoController.CLD_IS_CORE_CHECKLIST;
import static de.eshg.inspection.checklistdefinition.ChecklistDefinitionCentralRepoController.CLD_REPOSITORY_ID;
import static de.eshg.inspection.checklistdefinition.ChecklistDefinitionCentralRepoController.CLD_REPOSITORY_VERSION;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.NotNull;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.BindParam;

@ParameterObject
public record GetChecklistDefinitionCentralRepoRequest(
    @Parameter @BindParam(CLD_REPOSITORY_ID) @NotNull long repositoryID,
    @Parameter @BindParam(CLD_REPOSITORY_VERSION) @NotNull int repositoryVersion,
    @Parameter @BindParam(CLD_IS_CORE_CHECKLIST) @NotNull boolean isCoreChecklist) {}
