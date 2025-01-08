/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition;

import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionDto;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionVersionRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionsResponse;
import de.eshg.inspection.checklistdefinition.api.CreateNewChecklistDefinitionRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
    path = ChecklistDefinitionController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "ChecklistDefinition")
public class ChecklistDefinitionController {

  public static final String BASE_URL = BaseUrls.Inspection.CHECKLIST_DEFINITION_CONTROLLER;

  private final ChecklistDefinitionService checklistDefinitionService;

  public ChecklistDefinitionController(ChecklistDefinitionService checklistDefinitionService) {
    this.checklistDefinitionService = checklistDefinitionService;
  }

  @GetMapping
  @Operation(summary = "Get an overview of all checklist definitions, without version details")
  @Transactional(readOnly = true)
  @NotNull
  public ChecklistDefinitionsResponse getChecklistDefinitions() {
    return this.checklistDefinitionService.getChecklistDefinitions();
  }

  @GetMapping(path = "/{id}/versions")
  @Operation(summary = "Get all versions of a checklist definition, ie. the history of changes")
  @Transactional(readOnly = true)
  @NotNull
  public ChecklistDefinitionDto getChecklistDefinitionVersions(@PathVariable("id") UUID id) {
    return this.checklistDefinitionService.getChecklistDefinitionVersions(id);
  }

  @GetMapping(path = "/versions/{versionId}")
  @Operation(summary = "Get a certain version of a checklist definition")
  @Transactional(readOnly = true)
  @NotNull
  public ChecklistDefinitionVersionDto getChecklistDefinitionVersion(
      @PathVariable("versionId") UUID versionId) {
    return checklistDefinitionService.getChecklistDefinitionVersion(versionId);
  }

  @PostMapping
  @Operation(
      summary = "Add a new checklist definition",
      description =
          "This also creates a first <i>version</i> of the definition. "
              + "Versions are numbered with integers, starting at 1.")
  @Transactional()
  @NotNull
  public ChecklistDefinitionDto createNewChecklistDefinition(
      @Valid @RequestBody CreateNewChecklistDefinitionRequest request) {
    return checklistDefinitionService.createNewChecklistDefinition(request);
  }

  @PostMapping(path = "/{id}")
  @Operation(summary = "Add a new version to a checklist definition")
  @Transactional()
  @NotNull
  public ChecklistDefinitionVersionDto addChecklistDefinitionVersion(
      @PathVariable("id") UUID id, @Valid @RequestBody ChecklistDefinitionVersionRequest request) {
    return checklistDefinitionService.addChecklistDefinitionVersion(id, request);
  }

  @PutMapping(path = "/versions/{id}")
  @Operation(summary = "Edits an existing checklist definition version in draft mode")
  @Transactional()
  @NotNull
  public ChecklistDefinitionVersionDto editDraftChecklistDefinitionVersion(
      @PathVariable("id") UUID id, @Valid @RequestBody ChecklistDefinitionVersionRequest request) {
    return checklistDefinitionService.editDraftChecklistDefinitionVersion(id, request);
  }
}
