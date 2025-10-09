/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.eshg.lib.common.CountryCode;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = StreetApi.BASE_URL)
public interface StreetApi extends PublicStreetApi {
  String BASE_URL = BaseUrls.Base.STREET_API;

  @GetExchange
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Search street data by streetName, houseNumber, postalCode and country.")
  SearchStreetResponse searchStreet(
      @Schema(
              description =
                  "The name of the street of the address for which the search shall be done",
              example = "Beispielweg")
          @RequestParam(name = "streetName")
          String streetName,
      @Schema(
              description = "The house number of the address for which the search shall be done",
              example = "1A")
          @RequestParam(name = "houseNumber", required = false)
          @Pattern(regexp = HOUSE_NUMBER_REGEXP)
          String houseNumber,
      @Parameter(
              description = "The postal code of the address for which the search shall be done",
              example = "123456")
          @RequestParam(name = "postalCode")
          String postalCode,
      @Parameter(
              description =
                  "The country code in ISO 3166-1 alpha-2 format of the address for which the search shall be done")
          @RequestParam(name = "country")
          CountryCode country);
}
