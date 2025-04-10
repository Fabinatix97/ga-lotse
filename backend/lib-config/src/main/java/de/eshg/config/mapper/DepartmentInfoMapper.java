/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.department.LocationDto;
import de.eshg.config.api.DepartmentInfoDto;
import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.initialization.InitialDepartmentInfo;

public class DepartmentInfoMapper {
  private DepartmentInfoMapper() {}

  public static DepartmentInfo mapToDomain(InitialDepartmentInfo initialDepartmentInfo) {
    if (initialDepartmentInfo == null) {
      return null;
    }

    DepartmentInfo departmentInfo = new DepartmentInfo();
    departmentInfo.setName(initialDepartmentInfo.name());
    departmentInfo.setAbbreviation(initialDepartmentInfo.abbreviation());
    departmentInfo.setStreet(initialDepartmentInfo.street());
    departmentInfo.setHouseNumber(initialDepartmentInfo.houseNumber());
    departmentInfo.setPostalCode(initialDepartmentInfo.postalCode());
    departmentInfo.setCity(initialDepartmentInfo.city());
    departmentInfo.setCountry(initialDepartmentInfo.country());
    departmentInfo.setPhoneNumber(initialDepartmentInfo.phoneNumber());
    departmentInfo.setHomepage(initialDepartmentInfo.homepage());
    departmentInfo.setEmail(initialDepartmentInfo.email());
    departmentInfo.setLatitude(initialDepartmentInfo.latitude());
    departmentInfo.setLongitude(initialDepartmentInfo.longitude());
    return departmentInfo;
  }

  public static DepartmentInfoDto mapToDepartmentInfoDto(DepartmentInfo departmentInfo) {
    if (departmentInfo == null) {
      return null;
    }
    return new DepartmentInfoDto(
        departmentInfo.getName(),
        departmentInfo.getAbbreviation(),
        departmentInfo.getStreet(),
        departmentInfo.getHouseNumber(),
        departmentInfo.getPostalCode(),
        departmentInfo.getCity(),
        departmentInfo.getCountry(),
        departmentInfo.getPhoneNumber(),
        departmentInfo.getHomepage(),
        departmentInfo.getEmail(),
        departmentInfo.getLatitude(),
        departmentInfo.getLongitude());
  }

  public static GetDepartmentInfoResponse mapToDepartmentInfoResponse(
      DepartmentInfo departmentInfo) {
    return new GetDepartmentInfoResponse(
        departmentInfo.getName(),
        departmentInfo.getAbbreviation(),
        departmentInfo.getStreet(),
        departmentInfo.getHouseNumber(),
        departmentInfo.getPostalCode(),
        departmentInfo.getCity(),
        departmentInfo.getCountry(),
        departmentInfo.getPhoneNumber(),
        departmentInfo.getHomepage(),
        departmentInfo.getEmail(),
        new LocationDto(departmentInfo.getLatitude(), departmentInfo.getLongitude()));
  }
}
