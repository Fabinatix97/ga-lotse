/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import static de.eshg.base.util.MappingUtil.singleElementOrEmpty;
import static de.eshg.base.util.MappingUtil.singleElementOrNull;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.CountryCode;
import jakarta.annotation.Nullable;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class StreetService {

  private final StreetDirectory streetDirectory;
  private final MunicipalityDirectory municipalityDirectory;

  public StreetService(
      StreetDirectory streetDirectory, MunicipalityDirectory municipalityDirectory) {
    this.streetDirectory = streetDirectory;
    this.municipalityDirectory = municipalityDirectory;
  }

  public Set<DistrictDto> getDistricts(
      String streetName, HouseNumber houseNumber, String postalCode, CountryCode country) {
    if (country != CountryCode.DE || StringUtils.isBlank(postalCode)) {
      return Set.of();
    }
    String municipalityKey =
        singleElementOrEmpty(municipalityDirectory.getAdministrativeDataBy(postalCode))
            .map(MunicipalityDirectory.AdministrativeData::municipalityKey)
            .orElse(null);

    return (municipalityKey != null)
        ? streetDirectory.getAdministrativeDataBy(streetName, houseNumber, postalCode).stream()
            .map(
                administrativeData ->
                    new DistrictDto(
                        administrativeData.cityDistrict(),
                        administrativeData.districtName(),
                        municipalityKey))
            .collect(StreamUtil.toLinkedHashSet())
        : Set.of();
  }

  public PostalCodeAndCityResponse getPostalCodeAndCityForStreet(
      String streetName, @Nullable String houseNumber) {
    Set<StreetDirectory.AdministrativeData> administrativeData =
        houseNumber == null
            ? streetDirectory.getAdministrativeDataByStreetName(streetName)
            : streetDirectory.getAdministrativeDataByStreetNameAndHouseNumber(
                streetName, houseNumber);
    Set<String> postalCodes =
        administrativeData.stream()
            .map(StreetDirectory.AdministrativeData::postalCode)
            .collect(Collectors.toSet());

    if (postalCodes.size() == 1) {
      return mapToPostalCodeAndCityResponse(postalCodes.stream().findAny().orElseThrow());
    }

    Set<String> exactMatchPostalCodes =
        administrativeData.stream()
            .filter(ad -> ad.streetName().equals(streetName))
            .map(StreetDirectory.AdministrativeData::postalCode)
            .collect(Collectors.toSet());

    if (exactMatchPostalCodes.size() == 1) {
      return mapToPostalCodeAndCityResponse(exactMatchPostalCodes.stream().findAny().orElseThrow());
    }

    return new PostalCodeAndCityResponse(null, null);
  }

  private PostalCodeAndCityResponse mapToPostalCodeAndCityResponse(String postalCode) {
    return new PostalCodeAndCityResponse(
        postalCode,
        singleElementOrNull(
            municipalityDirectory.getAdministrativeDataBy(postalCode).stream()
                .map(MunicipalityDirectory.AdministrativeData::municipality)
                .collect(Collectors.toSet())));
  }

  public Set<String> getStreetsByPrefix(String streetName) {
    return streetDirectory.getFullStreetNamesForPrefix(streetName);
  }
}
