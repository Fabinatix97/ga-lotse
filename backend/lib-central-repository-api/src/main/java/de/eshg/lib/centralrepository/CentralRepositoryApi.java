/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.centralrepository;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.centralrepository.api.MetadataListResponseDto;
import de.eshg.lib.centralrepository.api.MetadataRequestDto;
import de.eshg.lib.centralrepository.api.MetadataResponseDto;
import de.eshg.lib.centralrepository.api.VersionFilterType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(value = CentralRepositoryApi.BASE_URL)
public interface CentralRepositoryApi {
  String BASE_URL = "/versioned";

  @GetExchange("{moduleName}/{objectName}/{id}/{version}/content")
  @Operation(summary = "Get content for a specific version of an object")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns the content of the specified version, which has the supplied names and id")
  ResponseEntity<Resource> getContentOfOneVersion(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id,
      @PathVariable("version") Integer version);

  @GetExchange("{moduleName}/{objectName}/{id}/{version}/metadata")
  @Operation(summary = "Get metadata for a specific version of an object")
  @ApiResponse(
      responseCode = "200",
      description =
          "Returns the metadata of the specified version, which has the supplied names and id")
  MetadataResponseDto getMetadataOfOneVersion(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id,
      @PathVariable("version") Integer version);

  @GetExchange("{moduleName}/{objectName}/{id}/metadata")
  @Operation(summary = "Get metadata for multiple versions of an object")
  @ApiResponse(
      responseCode = "200",
      description =
          """
          Returns the metadata of all or the newest version, given they have the supplied names and id.

          **Filters**:
          * If versions is not supplied, this will return all versions. It can be set to NEWEST.
          * If deleted is not specified, this will return only versions, which are not deleted.
          * If deleted is set to true, this will return only versions, which are deleted.
          """)
  MetadataListResponseDto getMetadataOfVersionsWithId(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id,
      @RequestParam(name = "versions", defaultValue = "ALL") VersionFilterType versions,
      @RequestParam(name = "deleted", defaultValue = "false") boolean deleted);

  @GetExchange("{moduleName}/{objectName}/metadata")
  @Operation(summary = "Get metadata for multiple versions of objects with supplied names")
  @ApiResponse(
      responseCode = "200",
      description =
          """
          Returns the metadata of all or the newest version, given they have the supplied names.
          The objectName can be * to include all objects whatever their objectName.

          **Filters**:
          * If versions is not supplied, this will return all versions. It can be set to NEWEST.
          * If deleted is not specified, this will return only versions, which are not deleted.
          * If deleted is set to true, this will return only versions, which are deleted.
          * If tags or category are not supplied, this will return results with any tag or category.
          * If tags is an empty string, this will return all results with an empty tags field.
          """)
  MetadataListResponseDto getMetadataOfVersionsWithModuleAndObjectName(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @RequestParam(name = "versions", defaultValue = "ALL") VersionFilterType versions,
      @RequestParam(name = "deleted", defaultValue = "false") Boolean deleted,
      @RequestParam(name = "tags", required = false) String tags,
      @RequestParam(name = "category", required = false) String category);

  @PostExchange(value = "{moduleName}/{objectName}")
  @Operation(summary = "Create entry and get the metadata for the created entry")
  @ApiResponse(
      responseCode = "200",
      description = "Returns the metadata for the created entry containing the new id and version")
  MetadataResponseDto createEntry(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @InlineParameterObject @ParameterObject @Valid MetadataRequestDto metadata,
      @RequestHeader(HttpHeaders.CONTENT_TYPE) @NotNull String contentType,
      @RequestHeader(HttpHeaders.CONTENT_LENGTH) long contentLength,
      @RequestBody @Valid InputStreamResource content);

  @PostExchange(value = "{moduleName}/{objectName}/{id}/{basedOnVersion}")
  @Operation(summary = "Create new version and get the metadata for it")
  @ApiResponse(responseCode = "200", description = "Returns the metadata for the new version")
  MetadataResponseDto createNewVersionForEntry(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id,
      @PathVariable("basedOnVersion") Integer expectedVersion,
      @InlineParameterObject @ParameterObject @Valid MetadataRequestDto metadata,
      @RequestHeader(HttpHeaders.CONTENT_TYPE) @NotNull String contentType,
      @RequestHeader(HttpHeaders.CONTENT_LENGTH) long contentLength,
      @RequestBody @Valid InputStreamResource content);

  @PostExchange("{moduleName}/{objectName}/{id}/{basedOnVersion}/metadata")
  @Operation(
      summary =
          "Create new version with only metadata being modified and get the new metadata for it")
  @ApiResponse(responseCode = "200", description = "Returns the metadata for the new version")
  MetadataResponseDto createNewVersionOnlyChangeMetadataForEntry(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id,
      @PathVariable("basedOnVersion") Integer expectedVersion,
      @Valid @RequestBody MetadataRequestDto metadata);

  @DeleteExchange("{moduleName}/{objectName}/{id}")
  @Operation(summary = "Set the specified entry and thus all its versions as deleted")
  @ApiResponse(responseCode = "200", description = "If the entry was successfully set as deleted")
  void setEntryAsDeleted(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id);

  @DeleteExchange("{moduleName}/{objectName}/{id}/{version}")
  @Operation(summary = "Set the specified version of the specified entry as deleted")
  @ApiResponse(
      responseCode = "200",
      description = "If the version of the entry was successfully set as deleted")
  void setOneVersionOfAnEntryAsDeleted(
      @PathVariable("moduleName") String moduleName,
      @PathVariable("objectName") String objectName,
      @PathVariable("id") Long id,
      @PathVariable("version") Integer version);
}
