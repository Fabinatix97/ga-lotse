/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Set;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "PublicStreet")
public class PublicStreetController implements PublicStreetApi {
  private final StreetService streetService;

  public PublicStreetController(StreetService streetService) {
    this.streetService = streetService;
  }

  @Override
  @Operation(operationId = "publicAutocompleteStreet")
  public AutocompleteStreetResponse autocompleteStreet(String streetNamePrefix) {
    Set<String> streets = streetService.getStreetsByPrefix(streetNamePrefix);
    return new AutocompleteStreetResponse(streets.stream().limit(100).toList(), streets.size());
  }

  @Override
  @Operation(operationId = "publicGetPostalCodeAndCityForStreet")
  public PostalCodeAndCityResponse getPostalCodeAndCityForStreet(
      String streetNamePrefix, String houseNumber) {
    return streetService.getPostalCodeAndCityForStreet(streetNamePrefix, houseNumber);
  }
}
