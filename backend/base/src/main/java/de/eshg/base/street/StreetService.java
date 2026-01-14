/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.CountryCode;
import jakarta.annotation.Nullable;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
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

  public Set<AdministrativeData> getData(
      String streetName, HouseNumber houseNumber, String postalCode, CountryCode country) {
    if (country != CountryCode.DE) {
      return Set.of();
    }

    Set<StreetDirectory.AdministrativeData> streetDirectoryData =
        streetDirectory.getAdministrativeDataBy(streetName, houseNumber, postalCode);

    MunicipalityDirectory.AdministrativeData municipalityDirectoryData =
        municipalityDirectory.getAdministrativeDataBy(postalCode);

    return streetDirectoryData.stream()
        .map(newAdministrativeData(municipalityDirectoryData))
        .collect(StreamUtil.toLinkedHashSet());
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
    MunicipalityDirectory.AdministrativeData municipalityData =
        municipalityDirectory.getAdministrativeDataBy(postalCode);
    return new PostalCodeAndCityResponse(postalCode, municipalityData.municipality());
  }

  private static Function<StreetDirectory.AdministrativeData, AdministrativeData>
      newAdministrativeData(MunicipalityDirectory.AdministrativeData municipalityDirectoryData) {
    return data ->
        new AdministrativeData(
            data.streetNumber(),
            data.districtName(),
            data.cityDistrict(),
            municipalityDirectoryData.municipalityKey());
  }

  public Set<String> getStreetsByPrefix(String streetName) {
    return streetDirectory.getFullStreetNamesForPrefix(streetName);
  }
}
