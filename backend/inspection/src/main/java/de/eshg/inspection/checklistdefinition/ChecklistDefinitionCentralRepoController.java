/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklistdefinition;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoResponse;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionCentralRepoUpdateRequest;
import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionFromCentralRepoUpdateRequest;
import de.eshg.inspection.checklistdefinition.api.DeleteChecklistDefinitionCentralRepoRequest;
import de.eshg.inspection.checklistdefinition.api.GetChecklistDefinitionCentralRepoRequest;
import de.eshg.inspection.checklistdefinition.api.GetChecklistDefinitionCentralRepoResponse;
import de.eshg.inspection.checklistdefinition.api.GetNewestChecklistDefinitionsCentralRepoResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
    path = ChecklistDefinitionCentralRepoController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "ChecklistDefinitionCentralRepo")
public class ChecklistDefinitionCentralRepoController {

  public static final String BASE_URL =
      BaseUrls.Inspection.CHECKLIST_CONTROLLER_BASE_URL_CENTRAL_REPOSITORY;

  public static final String CLD_REPOSITORY_ID = "repositoryID";
  public static final String CLD_REPOSITORY_VERSION = "repositoryVersion";
  public static final String CLD_IS_CORE_CHECKLIST = "isCoreChecklist";

  private final ChecklistDefinitionCentralRepoService checklistDefinitionCentralRepoService;

  public ChecklistDefinitionCentralRepoController(
      ChecklistDefinitionCentralRepoService checklistDefinitionCentralRepoService) {
    this.checklistDefinitionCentralRepoService = checklistDefinitionCentralRepoService;
  }

  @PostMapping(path = "/{cldId}/{cldVersion}")
  @Operation(summary = "Creates the given checklist definition version in the central repository")
  @Transactional
  @NotNull
  public ChecklistDefinitionCentralRepoResponse addChecklistDefinitionToCentralRepo(
      @PathVariable("cldId") UUID id,
      @PathVariable("cldVersion") int cldVersion,
      @Valid @RequestBody ChecklistDefinitionCentralRepoRequest request) {
    return checklistDefinitionCentralRepoService.addChecklistDefinition(id, cldVersion, request);
  }

  @PutMapping(path = "/{cldId}/{cldVersion}")
  @Operation(
      summary =
          "Adds the given checklist definition version onto the existing checklist "
              + "definition in the central repository")
  @Transactional
  @NotNull
  public ChecklistDefinitionCentralRepoResponse updateChecklistDefinitionToCentralRepo(
      @PathVariable("cldId") UUID id,
      @PathVariable("cldVersion") int cldVersion,
      @Valid @RequestBody ChecklistDefinitionCentralRepoUpdateRequest request) {
    return checklistDefinitionCentralRepoService.updateChecklistDefinition(id, cldVersion, request);
  }

  @GetMapping
  @Operation(
      summary = "Get metadata of the newest checklist definitions from the central repository")
  @Transactional(readOnly = true)
  @NotNull
  public GetNewestChecklistDefinitionsCentralRepoResponse
      getNewestChecklistDefinitionsFromCentralRepo() {
    return checklistDefinitionCentralRepoService.getNewestChecklistDefinitions();
  }

  @PostMapping(path = "/sync")
  @Operation(
      summary =
          "Adds the given checklist definition from the central repository "
              + "to the local checklist definitions")
  @Transactional
  @NotNull
  public ChecklistDefinitionCentralRepoResponse updateChecklistDefinitionsFromCentralRepo(
      @Valid @RequestBody ChecklistDefinitionFromCentralRepoUpdateRequest request) {
    return checklistDefinitionCentralRepoService.updateChecklistDefinitionsFromCentralRepo(request);
  }

  @GetMapping(path = "/content")
  @Operation(summary = "Get the given central repository checklist definition")
  @Transactional(readOnly = true)
  @NotNull
  public GetChecklistDefinitionCentralRepoResponse getChecklistDefinitionFromCentralRepo(
      @InlineParameterObject @ParameterObject @Valid
          GetChecklistDefinitionCentralRepoRequest request) {
    return checklistDefinitionCentralRepoService.getChecklistDefinition(request);
  }

  @DeleteMapping
  @Operation(summary = "Delete the checklist definition from the central repository")
  @Transactional
  public void deleteChecklistDefinitionFromCentralRepo(
      @InlineParameterObject @ParameterObject @Valid
          DeleteChecklistDefinitionCentralRepoRequest request) {
    checklistDefinitionCentralRepoService.deleteChecklistDefinition(request);
  }
}
