/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.PreventionDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.Prevention;

public final class PreventionMapper {
  private PreventionMapper() {}

  public static PreventionDto toInterfaceType(Prevention entity) {
    if (entity == null) {
      return null;
    }

    return new PreventionDto(
        VaccinationMapper.toInterfaceType(entity.getVaccinations()),
        SafeSexPracticeMapper.toInterfaceType(entity.getSafeSexPractice()),
        ProtectionMethodMapper.toInterfaceType(entity.getProtectionMethods()),
        entity.getInfoAboutPrepDesired());
  }

  public static Prevention toDatabaseType(PreventionDto dto) {
    if (dto == null) {
      return null;
    }

    Prevention riskFactor = new Prevention();
    riskFactor.setVaccinations(VaccinationMapper.toDatabaseType(dto.vaccinations()));
    riskFactor.setSafeSexPractice(SafeSexPracticeMapper.toDatabaseType(dto.safeSexPractice()));
    riskFactor.setProtectionMethods(
        ProtectionMethodMapper.toDatabaseType(dto.protectionMethodsUsed()));
    riskFactor.setInfoAboutPrepDesired(dto.infoAboutPrepDesired());
    return riskFactor;
  }
}
