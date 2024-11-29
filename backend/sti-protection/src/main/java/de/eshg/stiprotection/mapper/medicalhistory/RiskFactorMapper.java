/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.RiskFactorDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.RiskFactor;

public final class RiskFactorMapper {
  private RiskFactorMapper() {}

  public static RiskFactorDto toInterfaceType(RiskFactor entity) {
    if (entity == null) {
      return null;
    }

    return new RiskFactorDto(
        entity.getRiskActivityDateVaginalIntercourse(),
        entity.getRiskActivityDateOralIntercourse(),
        entity.getRiskActivityDateAnalIntercourse(),
        entity.getOtherRiskActivities(),
        entity.getRiskActivityDateVaginalIntercourseDate(),
        entity.getRiskActivityDateOralIntercourseDate(),
        entity.getRiskActivityDateAnalIntercourseDate(),
        entity.getOtherRiskActivitiesData());
  }

  public static RiskFactor toDatabaseType(RiskFactorDto dto) {
    if (dto == null) {
      return null;
    }

    RiskFactor riskFactor = new RiskFactor();
    riskFactor.setRiskActivityDateVaginalIntercourse(dto.riskActivityDateVaginalIntercourse());
    riskFactor.setRiskActivityDateOralIntercourse(dto.riskActivityDateOralIntercourse());
    riskFactor.setRiskActivityDateAnalIntercourse(dto.riskActivityDateAnalIntercourse());
    riskFactor.setOtherRiskActivities(dto.otherRiskActivities());
    riskFactor.setRiskActivityDateVaginalIntercourseDate(
        dto.riskActivityDateVaginalIntercourseDate());
    riskFactor.setRiskActivityDateOralIntercourseDate(dto.riskActivityDateOralIntercourseDate());
    riskFactor.setRiskActivityDateAnalIntercourseDate(dto.riskActivityDateAnalIntercourseDate());
    riskFactor.setOtherRiskActivitiesData(dto.otherRiskActivitiesData());
    return riskFactor;
  }
}
