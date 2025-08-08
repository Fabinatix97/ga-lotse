/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street;

import java.util.Set;

public interface StreetDirectory {
  Set<AdministrativeData> getAdministrativeDataBy(
      String streetName, HouseNumber houseNumber, String postalCode);

  Set<AdministrativeData> getAdministrativeDataByStreetName(String streetName);

  Set<AdministrativeData> getAdministrativeDataByStreetNameAndHouseNumber(
      String streetName, String houseNumber);

  Set<AdministrativeData> getAdministrativeDataByStreetNumber(String streetNumber);

  Set<String> getFullStreetNamesForPrefix(String streetName);

  record AdministrativeData(
      String streetNumber,
      String streetName,
      String localDistrict,
      String districtName,
      String cityDistrict,
      String postalCode) {}

  interface EntryFields {

    String streetNumber();

    String streetName();

    String evenOddSequence();

    String houseNumberFrom();

    String houseNumberFromAddition();

    String houseNumberTo();

    String houseNumberToAddition();

    String localDistrict();

    String districtName();

    String cityDistrict();

    String postalCode();
  }
}
