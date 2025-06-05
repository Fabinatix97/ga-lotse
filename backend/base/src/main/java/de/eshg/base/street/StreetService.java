/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.CountryCode;
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

  public PostCodeAndCity getPostCodeAndCityForStreet(String streetName) {
    Set<StreetDirectory.AdministrativeData> administrativeData =
        streetDirectory.getAdministrativeDataByStreetName(streetName);

    Set<PostCodeAndCity> result =
        administrativeData.stream()
            .map(
                ad -> {
                  MunicipalityDirectory.AdministrativeData x =
                      municipalityDirectory.getAdministrativeDataBy(ad.postalCode());
                  return new PostCodeAndCity(ad.postalCode(), x.municipality());
                })
            .collect(Collectors.toSet());

    if (result.size() == 1) {
      return result.stream().findFirst().orElseThrow();
    } else {
      return new PostCodeAndCity(null, null);
    }
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
