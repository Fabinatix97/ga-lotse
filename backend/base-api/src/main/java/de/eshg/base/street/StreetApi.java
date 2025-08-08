/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.eshg.lib.common.CountryCode;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(url = StreetApi.BASE_URL)
public interface StreetApi {
  String BASE_URL = BaseUrls.Base.STREET_API;
  String AUTOCOMPLETE = BaseUrls.Base.STREET_AUTOCOMPLETE_URL;
  String POSTAL_CODE_AND_CITY = Base.POSTAL_CODE_AND_CITY_URL;
  String HOUSE_NUMBER_REGEXP = "^(\\d+)([ a-zA-Z]*)$|";

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

  @GetExchange(AUTOCOMPLETE)
  @ApiResponse(responseCode = "200")
  @Operation(summary = "Returns all street names for the given prefix")
  AutocompleteStreetResponse autocompleteStreet(
      @Parameter(
              description = "The case-insensitive street name prefix to autocomplete",
              example = "Breite ga")
          @RequestParam(name = "streetNamePrefix")
          String streetNamePrefix);

  @GetExchange(POSTAL_CODE_AND_CITY)
  @ApiResponse(responseCode = "200")
  @Operation(
      summary = "Returns postal code and city for a given street name, if it is unambiguous",
      description =
          "Returns postal code and city information for a street based on the provided street name prefix. "
              + "An exact match will take precedence and be returned, even if there are other matches "
              + "that differ only in case or are the result of street names not being prefix-free. "
              + "A house number can optionally be supplied for streets that span multiple postal codes.")
  PostalCodeAndCityResponse getPostalCodeAndCityForStreet(
      @Parameter(
              description = "The case-insensitive street name prefix of the street",
              example = "Breite ga")
          @RequestParam(name = "streetNamePrefix")
          String streetNamePrefix,
      @Nullable
          @RequestParam(name = "houseNumber", required = false)
          @Pattern(regexp = HOUSE_NUMBER_REGEXP)
          String houseNumber);
}
