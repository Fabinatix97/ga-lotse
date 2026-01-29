/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.eshg.lib.common.CountryCode;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Set;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Street")
public class StreetController implements StreetApi {
  private final StreetService streetService;

  public StreetController(StreetService streetService) {
    this.streetService = streetService;
  }

  @Override
  public SearchStreetResponse searchStreet(
      String streetName, String houseNumber, String postalCode, CountryCode country) {
    return new SearchStreetResponse(
        streetService.getDistricts(
            streetName, StreetMapper.mapToHouseNumber(houseNumber), postalCode, country));
  }

  @Override
  public AutocompleteStreetResponse autocompleteStreet(String streetNamePrefix) {
    Set<String> streets = streetService.getStreetsByPrefix(streetNamePrefix);
    return new AutocompleteStreetResponse(streets.stream().limit(100).toList(), streets.size());
  }

  @Override
  public PostalCodeAndCityResponse getPostalCodeAndCityForStreet(
      String streetNamePrefix, String houseNumber) {
    return streetService.getPostalCodeAndCityForStreet(streetNamePrefix, houseNumber);
  }

  static class StreetMapper {

    private StreetMapper() {
      throw new IllegalStateException("Utility class");
    }

    static HouseNumber mapToHouseNumber(String houseNumber) {
      try {
        return HouseNumber.parseHouseNumber(houseNumber);
      } catch (IllegalArgumentException e) {
        throw new BadRequestException("Invalid house number format: %s".formatted(houseNumber));
      }
    }
  }
}
