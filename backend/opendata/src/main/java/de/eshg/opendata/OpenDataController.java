/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.opendata.api.GetOpenDocumentsRequest;
import de.eshg.opendata.api.GetOpenDocumentsResponse;
import de.eshg.opendata.api.PostOpenDocumentRequest;
import de.eshg.opendata.api.ResourceDto;
import de.eshg.opendata.api.UpdateVersionMetaDataRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(BaseUrls.OpenData.OPEN_DATA_CONTROLLER)
@Tag(name = "OpenData")
public class OpenDataController {

  private final OpenDataService openDataService;

  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public OpenDataController(
      OpenDataService openDataService, BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.openDataService = openDataService;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  @GetMapping()
  @Transactional(readOnly = true)
  @Operation(
      summary = "Gets open documents",
      description =
          """
          Gets all open documents aka all resources including their versions.
          It is possible to filter by `fileType`, `sources` and the year of
          `statisticsStartDate` and `statisticsEndDate`
          """)
  public GetOpenDocumentsResponse getOpenDocuments(
      @InlineParameterObject @ParameterObject @Valid GetOpenDocumentsRequest request) {
    validateOpenDataEnabled();
    return new GetOpenDocumentsResponse(openDataService.getOpenDocuments(request));
  }

  @GetMapping("/search")
  @Transactional(readOnly = true)
  @Operation(
      summary = "Searches for `searchString` in open documents",
      description =
          "Returns versions with matching `fileName` or `description` grouped by their resource")
  public GetOpenDocumentsResponse searchOpenDocuments(@RequestParam String searchString) {
    validateOpenDataEnabled();
    return new GetOpenDocumentsResponse(openDataService.searchOpenDocuments(searchString));
  }

  @GetMapping("/{versionId}/download")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  @Transactional(readOnly = true)
  @Operation(summary = "Downloads document of a version")
  public ResponseEntity<byte[]> downloadDocument(@PathVariable("versionId") UUID versionId) {
    validateOpenDataEnabled();
    return openDataService.downloadDocument(versionId);
  }

  @PutMapping("/{versionId}")
  @Transactional
  @Operation(
      summary = "Updates meta data of a version",
      description = "Updates `versionName`, `fileName`, `description`, `licence` and/or `sources`")
  public void updateVersionMetadata(
      @PathVariable("versionId") UUID versionId,
      @RequestBody @Valid UpdateVersionMetaDataRequest updateRequest) {
    validateOpenDataEnabled();
    openDataService.updateVersionMetadata(versionId, updateRequest);
  }

  @DeleteMapping("/{versionId}")
  @Transactional
  @Operation(
      summary = "Deletes a version",
      description = "Deletes correlating resource as well if there are no other versions left")
  public void deleteVersion(@PathVariable("versionId") UUID versionId) {
    validateOpenDataEnabled();
    openDataService.deleteVersion(versionId);
  }

  @PostMapping(consumes = MULTIPART_FORM_DATA_VALUE)
  @Transactional
  @Operation(
      summary = "Creates a new version",
      description =
          """
          Creates a resource as well if there is no existing resource with the
          given `resourceName`. If resourceName is null, a UUID based one is generated
          """)
  public ResourceDto createOpenDocument(
      @RequestPart(name = "postOpenDocumentRequest") @Valid PostOpenDocumentRequest postRequest,
      @RequestPart(name = "file") MultipartFile file) {
    validateOpenDataEnabled();
    return openDataService.createOpenDocument(postRequest, file);
  }

  private void validateOpenDataEnabled() {
    if (!baseFeatureTogglesApi
        .getFeatureToggles()
        .enabledNewFeatures()
        .contains(BaseFeature.OPEN_DATA)) {
      throw new BadRequestException(
          "New feature %s is not enabled".formatted(BaseFeature.OPEN_DATA));
    }
  }
}
