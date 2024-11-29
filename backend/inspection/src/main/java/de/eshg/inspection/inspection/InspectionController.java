/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import static de.eshg.rest.service.error.ErrorCode.INSUFFICIENT_USER_RIGHTS;

import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.inspection.api.*;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = InspectionController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Inspection")
public class InspectionController {

  public static final String BASE_URL = BaseUrls.Inspection.INSPECTION_CONTROLLER;

  private final InspectionService inspectionService;
  private final ReviewService reviewService;

  private final InspectionFeatureToggle inspectionFeatureToggle;
  private final AuditLogger auditLogger;

  public InspectionController(
      InspectionService inspectionService,
      ReviewService reviewService,
      InspectionFeatureToggle inspectionFeatureToggle,
      AuditLogger auditLogger) {
    this.inspectionService = inspectionService;
    this.reviewService = reviewService;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.auditLogger = auditLogger;
  }

  @PostMapping(path = "/{id}")
  @Operation(summary = "Starts a new inspection")
  @Transactional
  public InspectionDto startInspection(
      @PathVariable("id") UUID procedureId, @Valid @RequestBody StartInspectionRequest request) {
    validateAssignmentRole(request.assigneeId());
    return inspectionService.startInspection(procedureId, request);
  }

  @GetMapping(path = "/{id}")
  @Operation(summary = "Get details of an inspection")
  @Transactional(readOnly = true)
  public InspectionDto getInspection(@PathVariable("id") UUID externalId) {
    return inspectionService.loadInspectionDTO(externalId);
  }

  @PatchMapping(path = "/{id}")
  @Operation(summary = "Update attributes of an inspection")
  @Transactional
  public InspectionDto updateInspection(
      @PathVariable("id") UUID externalId, @Valid @RequestBody UpdateInspectionRequest request) {
    validateAssignmentRole(request.assigneeId());
    return inspectionService.updateInspection(externalId, request);
  }

  @PostMapping(path = "/{id}/finalize", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Finalize an inspection")
  @Transactional
  public InspectionDto finalizeInspection(
      @PathVariable("id") UUID externalId,
      @RequestPart("finalizeInspectionRequest") @Valid
          FinalizeInspectionRequest finalizeInspectionRequest,
      @RequestPart(name = "signature", required = false) MultipartFile signature) {
    return inspectionService.finalizeInspection(externalId, finalizeInspectionRequest, signature);
  }

  @PostMapping(path = "/{id}/approve")
  @Operation(summary = "Approve an inspection (after finalization)")
  @Transactional
  public InspectionDto approveInspection(@PathVariable("id") UUID externalId) {
    return inspectionService.approveInspection(externalId);
  }

  @GetMapping(path = "/report/{reportId}")
  @Operation(summary = "Download an inspection report")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> downloadReport(@PathVariable("reportId") UUID reportId) {
    return inspectionService.downloadReport(reportId);
  }

  @PutMapping(path = "/{id}/inventory")
  @Operation(
      summary = "Update an inspection: add, update or remove inventory",
      description = "To delete an inventory entry, set it's count to 0.")
  @Transactional
  public InspectionDto modifyInventory(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateInspectionModifyInventoryRequest request) {
    return inspectionService.modifyInventory(externalId, request);
  }

  @PostMapping(path = "/{id}/resource")
  @Operation(
      summary = "Update an inspection: add resource",
      description = "Adds a resource to an inspection. You can not update a resource.")
  @Transactional
  public InspectionDto addResource(
      @PathVariable("id") UUID externalId,
      @Valid @RequestBody UpdateInspectionAddResourceRequest request) {
    return inspectionService.addResource(externalId, request);
  }

  @DeleteMapping(path = "/{id}/resource/{resourceId}")
  @Operation(
      summary = "Update an inspection: remove resource",
      description = "Deletes a resource from an inspection. You can not update a resource.")
  @Transactional
  public InspectionDto deleteResource(
      @PathVariable("id") UUID externalId, @PathVariable("resourceId") UUID resourceId) {
    return inspectionService.deleteResource(externalId, resourceId);
  }

  @GetMapping(path = "/{id}/cldversions")
  @Operation(
      summary = "Get available checklist definition versions to choose from for this inspection")
  @Transactional(readOnly = true)
  public InspectionAvailableCLDVersionsResponse getAvailableCLDs(
      @PathVariable("id") UUID externalId) {
    return inspectionService.getAvailableCLDs(externalId);
  }

  @PostMapping(path = "/{id}/sync-file-state")
  @Operation(
      summary =
          """
Update a differing facility file state by taking over the data from the
associated reference facility
""")
  @Transactional
  public InspectionDto syncInspectionFacilityFileState(
      @Parameter(description = "The id of the inspection") @PathVariable("id") UUID id,
      @RequestBody @Valid InspectionSyncFileStateRequest request) {
    return inspectionService.syncInspectionFacilityFileState(id, request);
  }

  @PostMapping(path = "/{id}/update-file-state-and-reference")
  @Operation(
      summary =
          """
Perform a consistent update of the existent facility file state and its
associated reference facility
""")
  @Transactional
  public InspectionDto updateInspectionFacilityFileStateAndReference(
      @Parameter(description = "The id of the inspection") @PathVariable("id") UUID id,
      @RequestBody @Valid PutFacilityRequest request) {
    return inspectionService.updateFacilityFileStateAndReference(id, request);
  }

  @GetMapping(path = "/{id}/pldrevisions")
  @Operation(
      summary = "Get available packlist definition revisions to choose from for this inspection")
  @Transactional(readOnly = true)
  public InspectionAvailablePLDRevisionsResponse getAvailablePLDs(
      @PathVariable("id") UUID externalId) {
    return inspectionService.getAvailablePLDs(externalId);
  }

  @PostMapping(path = "/{id}/resolve-inspection-duplicate")
  @Operation(
      summary =
          "Resolves an inspection duplicate for an inspection by choosing whether to keep or discard an inspection")
  @Transactional
  public void resolveInspectionDuplicate(
      @Parameter(description = "The id of the inspection") @PathVariable("id") UUID id,
      @RequestBody @Valid ResolveInspectionDuplicateRequest request) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    reviewService.resolveInspectionDuplicate(id, request.keepInspection());
  }

  @PostMapping(path = "/{id}/resolve-facility-duplicate")
  @Operation(summary = "Resolves a facility duplicate for an inspection by choosing a facility")
  public void resolveFacilityDuplicate(
      @Parameter(description = "The id of the inspection") @PathVariable("id") UUID id,
      @RequestBody @Valid ResolveFacilityDuplicateRequest request) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    reviewService.resolveFacilityDuplicate(id, request.chosenReferenceId());
  }

  @GetMapping(path = "/{id}/inspection-duplicates")
  @Operation(summary = "Get inspection duplicates of an inspection")
  @Transactional(readOnly = true)
  public InspectionDuplicateReviewDto getInspectionDuplicates(@PathVariable("id") UUID externalId) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    return reviewService.reviewInspectionDuplicates(externalId);
  }

  @GetMapping(path = "/{id}/facility-duplicates")
  @Operation(summary = "Get facility duplicates of an inspection")
  @Transactional(readOnly = true)
  public FacilityDuplicateReviewDto getFacilityDuplicates(@PathVariable("id") UUID externalId) {
    inspectionFeatureToggle.assertNewFeatureIsEnabled(InspectionFeature.IMPORT);
    return reviewService.reviewFacilityDuplicates(externalId);
  }

  @PostMapping(path = "/{id}/viewed")
  @Operation(summary = "Mark inspection as viewed in audit-log")
  public void inspectionViewed(
      @Parameter(description = "The id of the inspection") @PathVariable("id") UUID id) {
    auditLogger.log(
        "Vorgangsbearbeitung",
        "Abfrage Vorgangs-Details",
        Map.of(
            "ID des Vorgangs",
            id.toString(),
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserId().toString()));
  }

  private static void validateAssignmentRole(UUID assigneeId) {
    if (assigneeId != null
        && !assigneeId.equals(CurrentUserHelper.getCurrentUserId())
        && !CurrentUserHelper.currentUserHasRole(
            EmployeePermissionRole.INSPECTION_PROCEDURE_ASSIGN)) {
      throw new BadRequestException(
          INSUFFICIENT_USER_RIGHTS, "No rights to assign inspections to other users");
    }
  }
}
