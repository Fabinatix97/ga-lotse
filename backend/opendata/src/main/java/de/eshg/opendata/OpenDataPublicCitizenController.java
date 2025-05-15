/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.config.i18n.MultiLangDocumentHelper;
import de.eshg.opendata.api.GetOpenDocumentsPaginationOptions;
import de.eshg.opendata.api.GetOpenDocumentsRequest;
import de.eshg.opendata.api.GetOpenDocumentsResponse;
import de.eshg.opendata.api.VersionDto;
import de.eshg.opendata.config.OpenDataConfigService;
import de.eshg.rest.service.security.config.BaseUrls.OpenData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(OpenData.PUBLIC_CITIZEN_CONTROLLER)
@Tag(name = "OpenDataPublicCitizen")
public class OpenDataPublicCitizenController {

  private final OpenDataService openDataService;
  private final OpenDataValidations openDataValidations;
  private final OpenDataFiltering openDataFiltering;
  private final OpenDataConfigService openDataConfigService;

  public OpenDataPublicCitizenController(
      OpenDataService openDataService,
      OpenDataValidations openDataValidations,
      OpenDataFiltering openDataFiltering,
      OpenDataConfigService openDataConfigService) {
    this.openDataService = openDataService;
    this.openDataValidations = openDataValidations;
    this.openDataFiltering = openDataFiltering;
    this.openDataConfigService = openDataConfigService;
  }

  @GetMapping
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
      @InlineParameterObject @ParameterObject @Valid GetOpenDocumentsRequest request,
      @InlineParameterObject @ParameterObject @Valid
          GetOpenDocumentsPaginationOptions paginationOptions) {
    openDataValidations.validateOpenDataEnabled();
    return openDataFiltering.getOpenDocumentsFromCitizenPortal(request, paginationOptions);
  }

  @GetMapping("/{versionId}")
  @Transactional(readOnly = true)
  @Operation(
      summary = "Get specific version of an open document",
      description =
          """
          Gets one specific version of an open document by its id
          """)
  public VersionDto getVersion(@PathVariable("versionId") UUID versionId) {
    openDataValidations.validateOpenDataEnabled();
    return openDataService.getSpecificVersion(versionId);
  }

  @GetMapping("/{versionId}/download")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  @Transactional(readOnly = true)
  @Operation(summary = "Download a specific version of a document")
  public ResponseEntity<byte[]> downloadDocument(@PathVariable("versionId") UUID versionId) {
    openDataValidations.validateOpenDataEnabled();
    return openDataService.downloadDocument(versionId);
  }

  @GetMapping("terms-of-use")
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  @Operation(summary = "Returns the terms of use")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getTermsOfUse() {
    return MultiLangDocumentHelper.getAsPdfResponseByCurrentLanguageWithFallback(
        openDataConfigService.getConfig().getTermsOfUse(),
        OpenDataConfigService.TERMS_OF_USE_USER_FILENAME);
  }
}
