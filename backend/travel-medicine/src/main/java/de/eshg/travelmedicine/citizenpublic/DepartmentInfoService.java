/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.citizenpublic;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.department.LocationDto;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import org.springframework.stereotype.Service;

@Service
public class DepartmentInfoService {

  private final DepartmentClient departmentClient;
  private final DepartmentInfoProperties departmentInfoProperties;

  public DepartmentInfoService(
      DepartmentClient departmentClient, DepartmentInfoProperties departmentInfoProperties) {
    this.departmentClient = departmentClient;
    this.departmentInfoProperties = departmentInfoProperties;
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    GetDepartmentInfoResponse baseDepartmentInfo = departmentClient.getDepartmentInfo();

    Double latitude =
        departmentInfoProperties.latitude() == null
            ? baseDepartmentInfo.location().latitude()
            : departmentInfoProperties.latitude();
    Double longitude =
        departmentInfoProperties.longitude() == null
            ? baseDepartmentInfo.location().longitude()
            : departmentInfoProperties.longitude();

    return new GetDepartmentInfoResponse(
        departmentInfoProperties.name() == null
            ? baseDepartmentInfo.name()
            : departmentInfoProperties.name(),
        departmentInfoProperties.abbreviation() == null
            ? baseDepartmentInfo.abbreviation()
            : departmentInfoProperties.abbreviation(),
        departmentInfoProperties.street() == null
            ? baseDepartmentInfo.street()
            : departmentInfoProperties.street(),
        departmentInfoProperties.houseNumber() == null
            ? baseDepartmentInfo.houseNumber()
            : departmentInfoProperties.houseNumber(),
        departmentInfoProperties.postalCode() == null
            ? baseDepartmentInfo.postalCode()
            : departmentInfoProperties.postalCode(),
        departmentInfoProperties.city() == null
            ? baseDepartmentInfo.city()
            : departmentInfoProperties.city(),
        departmentInfoProperties.country() == null
            ? baseDepartmentInfo.country()
            : departmentInfoProperties.country(),
        departmentInfoProperties.phoneNumber() == null
            ? baseDepartmentInfo.phoneNumber()
            : departmentInfoProperties.phoneNumber(),
        departmentInfoProperties.homepage() == null
            ? baseDepartmentInfo.homepage()
            : departmentInfoProperties.homepage(),
        departmentInfoProperties.email() == null
            ? baseDepartmentInfo.email()
            : departmentInfoProperties.email(),
        new LocationDto(latitude, longitude));
  }

  public DepartmentLogo getDepartmentLogo() {
    return departmentClient.getDepartmentLogo();
  }
}
