/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.VaccinationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.Vaccination;
import java.util.List;

public final class VaccinationMapper {
  private VaccinationMapper() {}

  public static List<VaccinationDto> toInterfaceType(List<Vaccination> vaccinations) {
    return vaccinations.stream().map(VaccinationMapper::toInterfaceType).toList();
  }

  private static VaccinationDto toInterfaceType(Vaccination e) {
    return new VaccinationDto(
        DiseaseTypeMapper.toInterfaceType(e.getDiseaseType()), e.getVaccinationDate());
  }

  public static Vaccination toDatabaseType(VaccinationDto dto) {
    Vaccination vaccination = new Vaccination();
    vaccination.setDiseaseType(DiseaseTypeMapper.toDatabaseType(dto.diseaseType()));
    vaccination.setVaccinationDate(dto.vaccinationDate());
    return vaccination;
  }
}
