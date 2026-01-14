/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config.mapper;

import de.eshg.inspection.config.api.FacilityFileNumberMethodDto;
import de.eshg.inspection.config.api.GetInspectionPropertiesConfigurationResponse;
import de.eshg.inspection.config.api.PutInspectionPropertiesConfigurationRequest;
import de.eshg.inspection.config.persistence.FacilityFileNumberMethod;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfiguration;
import de.eshg.inspection.config.persistence.InspectionPropertiesConfigurationProvider;
import org.springframework.stereotype.Component;

@Component
public class InspectionPropertiesConfigMapper {

  public GetInspectionPropertiesConfigurationResponse toInterfaceType(
      InspectionPropertiesConfiguration config) {
    FacilityFileNumberMethodDto methodDto = toInterfaceType(config.getFacilityFileNumberMethod());
    boolean initialized = config.isInitialized();
    return new GetInspectionPropertiesConfigurationResponse(methodDto, initialized);
  }

  public InspectionPropertiesConfigurationProvider toDomainType(
      PutInspectionPropertiesConfigurationRequest request) {
    return () -> toDomainType(request.facilityFileNumberMethod());
  }

  public FacilityFileNumberMethodDto toInterfaceType(
      FacilityFileNumberMethod facilityFileNumberMethod) {
    return mapEnum(FacilityFileNumberMethodDto.class, facilityFileNumberMethod);
  }

  public FacilityFileNumberMethod toDomainType(
      FacilityFileNumberMethodDto facilityFileNumberMethodDto) {
    return mapEnum(FacilityFileNumberMethod.class, facilityFileNumberMethodDto);
  }

  private static <E1 extends Enum<E1>, E2 extends Enum<E2>> E2 mapEnum(Class<E2> enumClass, E1 e1) {
    return (e1 == null ? null : E2.valueOf(enumClass, e1.name()));
  }
}
