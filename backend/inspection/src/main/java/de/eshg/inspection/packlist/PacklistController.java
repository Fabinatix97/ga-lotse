/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist;

import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.packlist.api.GetPacklistsResponse;
import de.eshg.inspection.packlist.api.PacklistDto;
import de.eshg.inspection.packlist.api.UpdatePacklistElementRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = PacklistController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Packlist")
public class PacklistController {
  public static final String BASE_URL = BaseUrls.Inspection.PACKLIST_CONTROLLER;

  private final InspectionService inspectionService;

  public PacklistController(InspectionService inspectionService) {
    this.inspectionService = inspectionService;
  }

  @GetMapping(path = "/{inspectionExternalId}")
  @Operation(summary = "Load the packlists for the inspection with the given inspectionExternalId")
  @Transactional(readOnly = true)
  @NotNull
  public GetPacklistsResponse getPacklists(
      @PathVariable("inspectionExternalId") UUID inspectionExternalId) {
    return inspectionService.getPacklists(inspectionExternalId);
  }

  @PatchMapping(path = "/{inspectionExternalId}/packlist/{packlistId}/{packlistElementId}")
  @Operation(summary = "Check or uncheck packlist element")
  @Transactional
  @NotNull
  public PacklistDto checkPacklistElement(
      @PathVariable("inspectionExternalId") UUID inspectionExternalId,
      @PathVariable("packlistId") UUID packlistId,
      @PathVariable("packlistElementId") UUID packlistElementId,
      @Valid @RequestBody UpdatePacklistElementRequest request) {
    return inspectionService.checkPacklistElement(
        inspectionExternalId, packlistId, packlistElementId, request);
  }
}
