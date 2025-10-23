/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import static de.eshg.statistics.GeoShapeController.BASE_URL;

import de.eshg.api.commons.SortDirection;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.statistics.api.geoshape.AbstractGeoShapeChangeRequest;
import de.eshg.statistics.api.geoshape.GeoShapeDto;
import de.eshg.statistics.api.geoshape.GeoShapeMetaInfo;
import de.eshg.statistics.api.geoshape.GeoShapeSortKey;
import de.eshg.statistics.api.geoshape.GetGeoShapesResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.io.IOException;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = BASE_URL)
@Tag(name = "GeoShape")
public class GeoShapeController {
  public static final String BASE_URL = BaseUrls.Statistics.GEO_SHAPE_CONTROLLER;

  private final GeoShapeService geoShapeService;

  public GeoShapeController(GeoShapeService geoShapeService) {
    this.geoShapeService = geoShapeService;
  }

  @ApiResponse(responseCode = "200", description = "The id of the geo shape")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Upload and save a geo json file")
  public UUID addGeoShape(
      @RequestPart("title") String title, @RequestPart("file") MultipartFile file)
      throws IOException {
    return geoShapeService.addGeoShape(title, file);
  }

  @GetMapping
  @ApiResponse(responseCode = "200", description = "All geo shapes")
  @Operation(summary = "Get meta data of all geo shapes")
  public GetGeoShapesResponse getGeoShapes(
      @RequestParam(name = "sortKey", required = false, defaultValue = "CREATED_AT")
          GeoShapeSortKey sortKey,
      @RequestParam(name = "sortDirection", required = false, defaultValue = "DESC")
          SortDirection sortDirection,
      @Min(0) @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
      @Min(1) @Max(200) @RequestParam(name = "pageSize", required = false, defaultValue = "25")
          Integer pageSize,
      @RequestParam(name = "onlyActive", required = false, defaultValue = "false")
          boolean onlyActive) {
    return geoShapeService.getGeoShapes(sortKey, sortDirection, page, pageSize, onlyActive);
  }

  @ApiResponse(responseCode = "200", description = "The geo shape of the requested id")
  @GetMapping(value = "/{geoShapeId}")
  @Operation(summary = "Get the geo shape for the id")
  public GeoShapeDto getGeoShape(@PathVariable("geoShapeId") UUID geoShapeId) {
    return geoShapeService.getGeoShape(geoShapeId);
  }

  @ApiResponse(responseCode = "200", description = "The changed geo shape of the requested id")
  @PatchMapping(value = "/{geoShapeId}")
  @Operation(summary = "Change the geo shape with the id")
  public GeoShapeMetaInfo updateGeoShape(
      @PathVariable("geoShapeId") UUID geoShapeId,
      @Valid @RequestBody AbstractGeoShapeChangeRequest geoShapeChangeRequest) {
    return geoShapeService.changeGeoShape(geoShapeId, geoShapeChangeRequest);
  }

  @ApiResponse(responseCode = "200", description = "Returned when the geo shape is deleted")
  @DeleteMapping(value = "/{geoShapeId}")
  @Operation(summary = "Delete a geo shape")
  public void deleteGeoShape(@PathVariable("geoShapeId") UUID geoShapeId) {
    geoShapeService.deleteGeoShape(geoShapeId);
  }
}
