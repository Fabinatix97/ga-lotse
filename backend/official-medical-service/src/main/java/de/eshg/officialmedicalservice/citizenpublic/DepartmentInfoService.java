/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic;

import de.eshg.base.department.DepartmentApi;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.department.LocationDto;
import org.springframework.stereotype.Service;

@Service
public class DepartmentInfoService {

  private final DepartmentApi departmentApi;
  private final DepartmentInfoProperties departmentInfoProperties;
  private GetDepartmentInfoResponse cachedDepartmentInfo;

  public DepartmentInfoService(
      DepartmentApi departmentApi, DepartmentInfoProperties departmentInfoProperties) {
    this.departmentApi = departmentApi;
    this.departmentInfoProperties = departmentInfoProperties;
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    GetDepartmentInfoResponse baseDepartmentInfo = getDepartmentInfoFromBase();

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

  private GetDepartmentInfoResponse getDepartmentInfoFromBase() {
    if (cachedDepartmentInfo == null) {
      cachedDepartmentInfo = departmentApi.getDepartmentInfo();
    }
    return cachedDepartmentInfo;
  }
}
