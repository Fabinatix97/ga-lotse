/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.eshg.lib.common.CountryCode;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Set;
import java.util.stream.Collectors;
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
    return StreetMapper.mapToSearchStreetResponse(
        streetService.getData(
            streetName, StreetMapper.mapToHouseNumber(houseNumber), postalCode, country));
  }

  @Override
  public AutocompleteStreetResponse autocompleteStreet(String streetNamePrefix) {
    Set<String> streets = streetService.getStreetsByPrefix(streetNamePrefix);
    return new AutocompleteStreetResponse(streets.stream().limit(100).toList(), streets.size());
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

    public static SearchStreetResponse mapToSearchStreetResponse(
        Set<AdministrativeData> cityDistricts) {
      return new SearchStreetResponse(
          cityDistricts.stream().map(StreetMapper::mapToDistrictDto).collect(Collectors.toSet()));
    }

    public static DistrictDto mapToDistrictDto(AdministrativeData cityDistrict) {
      return new DistrictDto(
          cityDistrict.cityDistrict(), cityDistrict.districtName(), cityDistrict.municipalityKey());
    }
  }
}
