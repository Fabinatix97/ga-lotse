/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.VaccinationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.Vaccination;

public final class VaccinationMapper {
  private VaccinationMapper() {}

  public static VaccinationDto toInterfaceType(Vaccination entity) {
    if (entity == null) {
      return null;
    }

    return new VaccinationDto(entity.getHepA(), entity.getHepB(), entity.getHpv());
  }

  public static Vaccination toDatabaseType(VaccinationDto dto) {
    if (dto == null) {
      return null;
    }

    Vaccination vaccinations = new Vaccination();
    vaccinations.setHepA(dto.hepA());
    vaccinations.setHepB(dto.hepB());
    vaccinations.setHpv(dto.hpv());
    return vaccinations;
  }
}
