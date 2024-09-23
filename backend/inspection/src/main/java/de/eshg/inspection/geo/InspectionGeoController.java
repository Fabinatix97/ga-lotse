/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.geo;

import de.eshg.inspection.geo.api.GetReverseGeoCodeResponse;
import de.eshg.inspection.geo.api.GetReverseGeoCodeResponseLocation;
import de.eshg.inspection.geo.api.NominatimResponseItem;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = InspectionGeoController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "InspectionGeo")
public class InspectionGeoController {

  public static final String BASE_URL = BaseUrls.Inspection.INSPECTION_GEO_CONTROLLER;

  private final NominatimApi nominatimApi;

  public InspectionGeoController(NominatimApi nominatimApi) {
    this.nominatimApi = nominatimApi;
  }

  @GetMapping("/reversegeocode")
  @Operation(summary = "Get geo coordinates of an address")
  public GetReverseGeoCodeResponse getReverseGeoCode(
      @RequestParam("country") String country,
      @RequestParam("city") String city,
      @RequestParam("postalcode") String postalcode,
      @RequestParam("street") String street) {

    List<NominatimResponseItem> nominatimResponseItems =
        nominatimApi.fetch(country, city, postalcode, street);

    return new GetReverseGeoCodeResponse(
        nominatimResponseItems.stream()
            .map(
                nominatimResponseItem ->
                    new GetReverseGeoCodeResponseLocation(
                        nominatimResponseItem.lat(), nominatimResponseItem.lon()))
            .toList());
  }
}
