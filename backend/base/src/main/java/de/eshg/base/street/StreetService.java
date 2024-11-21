/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.CountryCode;
import java.util.Set;
import java.util.function.Function;
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

  private static Function<StreetDirectory.AdministrativeData, AdministrativeData>
      newAdministrativeData(MunicipalityDirectory.AdministrativeData municipalityDirectoryData) {
    return data ->
        new AdministrativeData(
            data.localDistrict(),
            data.districtName(),
            data.cityDistrict(),
            data.cityDistrictPrefecture(),
            data.arbitratorsDistrict(),
            data.socialTownHallName(),
            data.policeStation(),
            data.postalCode(),
            municipalityDirectoryData.municipalityKey());
  }

  public Set<String> getStreetsByPrefix(String streetName) {
    return streetDirectory.getFullStreetNamesForPrefix(streetName);
  }
}
