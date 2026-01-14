/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import de.eshg.base.street.HouseNumber;
import de.eshg.base.street.StreetDirectory.AdministrativeData;
import de.eshg.base.street.StreetDirectoryService;
import java.util.HashSet;
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

  public String calculateFacilityFileNumberNoFileNumbers() {
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

        return firstCharacterOfStreetName
            + "-"
            + paddedStreetNumber
            + "-"
            + houseNumber.toLowerCase();
      } else {
        return null;
      }
    } catch (Exception e) {
      log.error("Exception was thrown when trying to calculate file number, returning null", e);
      return null;
    }
  }

  public StreetNameHouseNumberAndPostalCode getAddressFromFileNumberForInspectionFrankfurt(
      String fileNumber) {
    if (fileNumber == null) {
      return null;
    }

    String[] splitString = fileNumber.split("-");
    if (splitString.length < 3) {
      return null;
    }
    try {
      String firstLetterOfStreetName = splitString[0];
      String streetNumber = String.valueOf(Integer.parseInt(splitString[1]));
      String houseNumber = splitString[2];

      // We get the administrative data for the street number (which may include other post codes
      // that are not for our house number, but should only have one street name.
      Set<AdministrativeData> administrativeDataSet =
          streetDirectoryService.getAdministrativeDataByStreetNumber(streetNumber);

      Set<String> streetNames =
          administrativeDataSet.stream()
              .map(AdministrativeData::streetName)
              .collect(Collectors.toSet());

      Set<String> postCodes =
          administrativeDataSet.stream()
              .map(AdministrativeData::postalCode)
              .collect(Collectors.toSet());

      // There should always be only one street name, but if there isn't, something must have gone
      // wrong and we don't proceed.
      if (streetNames.size() == 1) {
        String streetName = streetNames.stream().findFirst().orElseThrow();

        if (streetName.isEmpty() || !streetName.substring(0, 1).equals(firstLetterOfStreetName)) {
          return null;
        }

        // We look up each post code. Only one these lookups should actually return something, as
        // all other post codes are invalid for this house number.
        Set<AdministrativeData> validAdministrativeData = new HashSet<>();
        for (String postCode : postCodes) {
          validAdministrativeData.addAll(
              streetDirectoryService.getAdministrativeDataBy(
                  streetName, HouseNumber.parseHouseNumber(houseNumber), postCode));
        }

        Set<String> validPostCodes =
            validAdministrativeData.stream()
                .map(AdministrativeData::postalCode)
                .collect(Collectors.toSet());

        if (validPostCodes.size() == 1) {
          return new StreetNameHouseNumberAndPostalCode(
              streetName, houseNumber, validPostCodes.stream().findFirst().orElseThrow());
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (Exception e) {
      log.error(
          "Exception was thrown when trying to calculate address from file number, returning null",
          e);
      return null;
    }
  }

  public record StreetNameHouseNumberAndPostalCode(
      String streetName, String houseNumber, String postalCode) {}
}
