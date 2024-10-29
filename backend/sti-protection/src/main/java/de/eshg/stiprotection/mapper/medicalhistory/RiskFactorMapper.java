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
    return new RiskFactorDto(
        VaccinationMapper.toInterfaceType(entity.getVaccinations()),
        SafeSexPracticeMapper.toInterfaceType(entity.getSafeSexPractice()),
        ProtectionMethodMapper.toInterfaceType(entity.getProtectionMethods()),
        entity.getPrepInfoProvided(),
        entity.getRiskActivityDateVaginalIntercourse(),
        entity.getRiskActivityDateOralIntercourse(),
        entity.getRiskActivityDateAnalIntercourse(),
        entity.getOtherRiskActivities());
  }

  public static RiskFactor toDatabaseType(RiskFactorDto dto) {
    RiskFactor riskFactor = new RiskFactor();
    riskFactor.setVaccinations(VaccinationMapper.toDatabaseType(dto.vaccinations()));
    riskFactor.setSafeSexPractice(SafeSexPracticeMapper.toDatabaseType(dto.safeSexPractice()));
    riskFactor.setProtectionMethods(
        ProtectionMethodMapper.toDatabaseType(dto.protectionMethodsUsed()));
    riskFactor.setPrepInfoProvided(dto.prepInfoProvided());
    riskFactor.setRiskActivityDateVaginalIntercourse(dto.riskActivityDateVaginalIntercourse());
    riskFactor.setRiskActivityDateOralIntercourse(dto.riskActivityDateOralIntercourse());
    riskFactor.setRiskActivityDateAnalIntercourse(dto.riskActivityDateAnalIntercourse());
    riskFactor.setOtherRiskActivities(dto.otherRiskActivities());
    return riskFactor;
  }
}
