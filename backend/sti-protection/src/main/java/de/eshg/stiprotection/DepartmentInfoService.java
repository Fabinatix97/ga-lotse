/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.department.LocationDto;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.stiprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.stiprotection.persistence.config.DepartmentInfoConfig;
import de.eshg.stiprotection.persistence.config.DepartmentInfoProperties;
import de.eshg.stiprotection.persistence.config.OpeningHoursProperties;
import de.eshg.stiprotection.persistence.db.Concern;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class DepartmentInfoService {

  private final DepartmentClient departmentClient;
  private final DepartmentInfoConfig departmentInfoConfig;

  public DepartmentInfoService(
      DepartmentClient departmentClient, DepartmentInfoConfig departmentInfoConfig) {
    this.departmentClient = departmentClient;
    this.departmentInfoConfig = departmentInfoConfig;
  }

  public GetDepartmentInfoResponse getDepartmentInfo(Concern concern) {
    GetDepartmentInfoResponse baseDepartmentInfo = departmentClient.getDepartmentInfo();
    if (concern == null) {
      return baseDepartmentInfo;
    }
    String key =
        mapConcernToKey(concern, departmentInfoConfig.getDepartmentInfo(), "DepartmentInfo");
    Map<String, DepartmentInfoProperties> departments = departmentInfoConfig.getDepartmentInfo();
    DepartmentInfoProperties departmentInfo = departments.get(key);
    return mergeWithDepartmentFallback(departmentInfo, baseDepartmentInfo);
  }

  private String mapConcernToKey(Concern concern, Map<String, ?> map, String mapName) {
    if (CollectionUtils.isEmpty(map)) {
      throw new IllegalStateException("%s map is empty.".formatted(mapName));
    }
    String key = concern.name().toLowerCase();
    if (!map.containsKey(key)) {
      throw new IllegalStateException("%s map does not contain key %s.".formatted(mapName, key));
    }
    return key;
  }

  private GetDepartmentInfoResponse mergeWithDepartmentFallback(
      DepartmentInfoProperties departmentInfo, GetDepartmentInfoResponse fallback) {

    Double latitude =
        Optional.ofNullable(departmentInfo.latitude())
            .orElseGet(() -> fallback.location().latitude());
    Double longitude =
        Optional.ofNullable(departmentInfo.longitude())
            .orElseGet(() -> fallback.location().longitude());

    return new GetDepartmentInfoResponse(
        Optional.ofNullable(departmentInfo.name()).orElseGet(fallback::name),
        Optional.ofNullable(departmentInfo.abbreviation()).orElseGet(fallback::abbreviation),
        Optional.ofNullable(departmentInfo.street()).orElseGet(fallback::street),
        Optional.ofNullable(departmentInfo.houseNumber()).orElseGet(fallback::houseNumber),
        Optional.ofNullable(departmentInfo.postalCode()).orElseGet(fallback::postalCode),
        Optional.ofNullable(departmentInfo.city()).orElseGet(fallback::city),
        Optional.ofNullable(departmentInfo.country()).orElseGet(fallback::country),
        Optional.ofNullable(departmentInfo.phoneNumber()).orElseGet(fallback::phoneNumber),
        Optional.ofNullable(departmentInfo.homepage()).orElseGet(fallback::homepage),
        Optional.ofNullable(departmentInfo.email()).orElseGet(fallback::email),
        new LocationDto(latitude, longitude));
  }

  public GetOpeningHoursResponse getOpeningHours(Concern concern) {
    String key = mapConcernToKey(concern, departmentInfoConfig.getOpeningHours(), "OpeningHours");
    Map<String, OpeningHoursProperties> departments = departmentInfoConfig.getOpeningHours();
    OpeningHoursProperties openingHours = departments.get(key);
    return new GetOpeningHoursResponse(openingHours.de(), openingHours.en());
  }
}
