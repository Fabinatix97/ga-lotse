/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition;

import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.packlistdefinition.api.AddPacklistDefinitionRevisionRequest;
import de.eshg.inspection.packlistdefinition.api.CreateNewPacklistDefinitionRequest;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionRevisionDto;
import de.eshg.inspection.packlistdefinition.api.PacklistDefinitionsResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = PacklistDefinitionController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "PacklistDefinition")
public class PacklistDefinitionController {

  public static final String BASE_URL = BaseUrls.Inspection.PACKLIST_DEFINITION_CONTROLLER;

  private final PacklistDefinitionService packlistDefinitionService;

  private final InspectionFeatureToggle inspectionFeatureToggle;

  public PacklistDefinitionController(
      PacklistDefinitionService packlistDefinitionService,
      InspectionFeatureToggle inspectionFeatureToggle) {
    this.packlistDefinitionService = packlistDefinitionService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
  }

  @GetMapping
  @Operation(summary = "Get an overview of all packlist definitions, without revision details")
  @Transactional(readOnly = true)
  @NotNull
  public PacklistDefinitionsResponse getPacklistDefinitions() {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.PACKLISTS);
    return this.packlistDefinitionService.getPacklistDefinitions();
  }

  @GetMapping(path = "/{id}/revisions")
  @Operation(summary = "Get all revisions of a packlist definition, ie. the history of changes")
  @Transactional(readOnly = true)
  @NotNull
  public PacklistDefinitionDto getPacklistDefinitionRevisions(@PathVariable("id") UUID id) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.PACKLISTS);
    return this.packlistDefinitionService.getPacklistDefinitionRevisions(id);
  }

  @GetMapping(path = "/revisions/{revisionId}")
  @Operation(summary = "Get a certain revision of a packlist definition")
  @Transactional(readOnly = true)
  @NotNull
  public PacklistDefinitionRevisionDto getPacklistDefinitionRevision(
      @PathVariable("revisionId") UUID revisionId) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.PACKLISTS);
    return packlistDefinitionService.getPacklistDefinitionRevision(revisionId);
  }

  @PostMapping
  @Operation(
      summary = "Add a new packlist definition",
      description =
          "This also creates a first <i>revision</i> of the definition. "
              + "Revisions are numbered with integers, starting at 1.")
  @Transactional()
  @NotNull
  public PacklistDefinitionDto createNewPacklistDefinition(
      @Valid @RequestBody CreateNewPacklistDefinitionRequest request) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.PACKLISTS);
    return packlistDefinitionService.createNewPacklistDefinition(request);
  }

  @PostMapping(path = "/{id}")
  @Operation(summary = "Add a new revision to a packlist definition")
  @Transactional()
  @NotNull
  public PacklistDefinitionRevisionDto addPacklistDefinitionRevision(
      @PathVariable("id") UUID id,
      @Valid @RequestBody AddPacklistDefinitionRevisionRequest request) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.PACKLISTS);
    return packlistDefinitionService.addPacklistDefinitionRevision(id, request);
  }
}
