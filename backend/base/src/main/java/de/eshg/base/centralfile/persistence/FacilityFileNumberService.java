/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import de.eshg.base.street.HouseNumber;
import de.eshg.base.street.StreetDirectory.AdministrativeData;
import de.eshg.base.street.StreetDirectoryService;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FacilityFileNumberService {

  private static final Logger log = LoggerFactory.getLogger(FacilityFileNumberService.class);

  private final StreetDirectoryService streetDirectoryService;

  public FacilityFileNumberService(StreetDirectoryService streetDirectoryService) {
    this.streetDirectoryService = streetDirectoryService;
  }

  public String calculateFacilityFileNumberDefault() {
    return null;
  }

  public String calculateFacilityFileNumberForInspectionFrankfurt(
      String streetName, String houseNumber, String postalCode) {
    try {
      if (StringUtils.isBlank(streetName)) {
        return null;
      }
      if (StringUtils.isBlank(houseNumber)) {
        return null;
      }
      if (StringUtils.isBlank(postalCode)) {
        return null;
      }

      Set<AdministrativeData> administrativeData =
          streetDirectoryService.getAdministrativeDataBy(
              streetName, HouseNumber.parseHouseNumber(houseNumber), postalCode);

      Set<String> streetNumbers =
          administrativeData.stream()
              .map(AdministrativeData::streetNumber)
              .collect(Collectors.toSet());

      if (streetNumbers.size() == 1) {
        String firstCharacterOfStreetName = streetName.substring(0, 1);

        String streetNumberAsString = streetNumbers.stream().findFirst().orElseThrow();
        int streetNumber = Integer.parseInt(streetNumberAsString);

        StringBuilder paddedStreetNumberStringBuilder =
            new StringBuilder(String.valueOf(streetNumber));
        while (paddedStreetNumberStringBuilder.length() < 4) {
          paddedStreetNumberStringBuilder.insert(0, "0");
        }
        String paddedStreetNumber = paddedStreetNumberStringBuilder.toString();

        return firstCharacterOfStreetName + "-" + paddedStreetNumber + "-" + houseNumber;
      } else {
        return null;
      }
    } catch (Exception e) {
      log.error("Exception was thrown when trying to calculate file number, returning null", e);
      return null;
    }
  }
}
