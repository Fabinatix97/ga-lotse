/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.ExaminationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.Examination;

public final class ExaminationMapper {
  private ExaminationMapper() {}

  public static ExaminationDto toInterfaceType(Examination entity) {
    if (entity == null) {
      return null;
    }

    return new ExaminationDto(
        entity.getHepA(),
        entity.getHepB(),
        entity.getHepC(),
        entity.getHiv(),
        entity.getSyphilis(),
        entity.getGonorrhea(),
        entity.getChlamydia());
  }

  public static Examination toDatabaseType(ExaminationDto dto) {
    if (dto == null) {
      return null;
    }

    Examination examination = new Examination();
    examination.setHepA(dto.hepA());
    examination.setHepB(dto.hepB());
    examination.setHepC(dto.hepC());
    examination.setHiv(dto.hiv());
    examination.setSyphilis(dto.syphilis());
    examination.setGonorrhea(dto.gonorrhea());
    examination.setChlamydia(dto.chlamydia());
    return examination;
  }
}
