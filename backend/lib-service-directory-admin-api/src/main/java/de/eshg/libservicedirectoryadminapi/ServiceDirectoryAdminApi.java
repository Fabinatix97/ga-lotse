/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi;

import de.eshg.libservicedirectoryadminapi.api.GetEntitiesResponse;
import de.eshg.libservicedirectoryadminapi.api.actor.ActorDto;
import de.eshg.libservicedirectoryadminapi.api.actor.PartialActorDto;
import de.eshg.libservicedirectoryadminapi.api.audit.GetRevisionsResponse;
import de.eshg.libservicedirectoryadminapi.api.audit.GetUsernamesResponse;
import de.eshg.libservicedirectoryadminapi.api.impex.ExportResponse;
import de.eshg.libservicedirectoryadminapi.api.impex.ImportRequest;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.orgunit.PartialOrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.rule.PartialRuleDto;
import de.eshg.libservicedirectoryadminapi.api.rule.RuleDto;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

@HttpExchange(ServiceDirectoryAdminApi.API_PREFIX)
public interface ServiceDirectoryAdminApi {
  String API_PREFIX = "/adminapi";

  String ACTORS_PREFIX = "/actors";

  String ORG_UNITS_PREFIX = "/orgUnits";

  String ENTITIES_PREFIX = "/entities";

  String RULES_PREFIX = "/rules";

  String STAGED_PATH = "/staged";

  String EXPORT_PATH = "/export";
  String IMPORT_PATH = "/import";

  @Operation(summary = "Create an actor")
  @PostExchange(value = ACTORS_PREFIX, accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Creates an actor")
  PartialActorDto createActor(@Valid @RequestBody PartialActorDto partialActorDto);

  @Operation(summary = "Update an actor")
  @PutExchange(value = ACTORS_PREFIX, accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Updates an actor")
  PartialActorDto updateActor(@Valid @RequestBody PartialActorDto partialActorDto);

  @Operation(summary = "Delete an actor by its id")
  @DeleteExchange(value = ACTORS_PREFIX + "/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Deletes an actor by its id")
  void deleteActorById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Deactivate an actor")
  @PutExchange(value = ACTORS_PREFIX + "/deactivate/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Deactivates an actor")
  ActorDto deactivateActorById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Activate an actor")
  @PutExchange(value = ACTORS_PREFIX + "/activate/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Activates an actor")
  ActorDto activateActorById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Get all orgUnits, actors and rules")
  @GetExchange(value = ENTITIES_PREFIX)
  @ApiResponse(responseCode = "200", description = "Returns all entities")
  GetEntitiesResponse getAllEntities();

  @Operation(summary = "Create an orgUnit")
  @PostExchange(value = ORG_UNITS_PREFIX, accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Creates an orgUnit")
  PartialOrgUnitDto createOrgUnit(@Valid @RequestBody PartialOrgUnitDto partialOrgUnitDto);

  @Operation(summary = "Update an orgUnit")
  @PutExchange(value = ORG_UNITS_PREFIX, accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Updates an orgUnit")
  PartialOrgUnitDto updateOrgUnit(@Valid @RequestBody PartialOrgUnitDto partialOrgUnitDto);

  @Operation(summary = "Delete an orgUnit")
  @DeleteExchange(value = ORG_UNITS_PREFIX + "/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Deletes an orgUnit")
  void deleteOrgUnitById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Deactivate an orgUnit")
  @PutExchange(value = ORG_UNITS_PREFIX + "/deactivate/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Deactivates an orgUnit")
  OrgUnitDto deactivateOrgUnitById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Activate an orgUnit")
  @PutExchange(value = ORG_UNITS_PREFIX + "/activate/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Activates an orgUnit")
  OrgUnitDto activateOrgUnitById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Create an rule")
  @PostExchange(value = RULES_PREFIX, accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Creates an rule")
  PartialRuleDto createRule(@Valid @RequestBody PartialRuleDto partialRuleDto);

  @Operation(summary = "Update an rule")
  @PutExchange(value = RULES_PREFIX, accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Updates an rule")
  PartialRuleDto updateRule(@Valid @RequestBody PartialRuleDto partialRuleDto);

  @Operation(summary = "Delete an rule")
  @DeleteExchange(value = RULES_PREFIX + "/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Deletes an rule")
  void deleteRuleById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Deactivate an rule")
  @PutExchange(value = RULES_PREFIX + "/deactivate/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Deactivates an rule")
  RuleDto deactivateRuleById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Activate an rule")
  @PutExchange(value = RULES_PREFIX + "/activate/{id}", accept = "application/json")
  @ApiResponse(responseCode = "200", description = "Activates an rule")
  RuleDto activateRuleById(@PathVariable(name = "id") UUID id);

  @Operation(summary = "Commits staged changes by user")
  @PostExchange(value = STAGED_PATH)
  @ApiResponse(responseCode = "200", description = "Commits staged changes by user")
  CommitResponseDto commitStaged(
      @RequestParam(name = "user", required = false) String user,
      @RequestParam(name = "ids", required = false) List<UUID> ids,
      @RequestParam(defaultValue = "false") boolean dryRun);

  @Operation(summary = "Reset staged changes by user")
  @DeleteExchange(value = STAGED_PATH)
  @ApiResponse(responseCode = "200", description = "Delete staged changes by user or by IDs")
  void deleteStaged(
      @RequestParam(name = "user", required = false) String user,
      @RequestParam(name = "ids", required = false) List<UUID> ids);

  @Operation(summary = "Export current service-directory data without staged data")
  @GetExchange(value = EXPORT_PATH, accept = "application/json")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns a JSON with all relevant (configuration) data of the service-directory")
  ExportResponse getExport(@RequestParam(defaultValue = "false") boolean withCertificates);

  @Operation(summary = "Import from exported data into an empty database")
  @PostExchange(value = IMPORT_PATH, accept = "application/json")
  @ApiResponse(
      responseCode = "200",
      description = "Import from exported data into an empty database")
  void postImport(@Valid @RequestBody ImportRequest toBeImported);

  @Operation(summary = "Get revisions")
  @GetExchange("/revisions")
  GetRevisionsResponse getRevisions(
      @RequestParam("fromInclusive") Instant fromInclusive,
      @RequestParam("toExclusive") Instant toExclusive,
      @RequestParam(value = "username", required = false) String username);

  @Operation(summary = "Get users that made changes")
  @GetExchange("/usernames")
  GetUsernamesResponse getUsernames();
}
