/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.PreviousIllnessDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.PreviousIllness;

public final class PreviousIllnessMapper {
  private PreviousIllnessMapper() {}

  public static PreviousIllnessDto toInterfaceType(PreviousIllness entity) {
    if (entity == null) {
      return null;
    }

    return new PreviousIllnessDto(
        entity.getHepA(),
        entity.getHepB(),
        entity.getHepC(),
        entity.getHiv(),
        entity.getSyphilis(),
        entity.getGonorrhea(),
        entity.getChlamydia(),
        entity.getOther(),
        entity.getOtherData());
  }

  public static PreviousIllness toDatabaseType(PreviousIllnessDto dto) {
    if (dto == null) {
      return null;
    }

    PreviousIllness previousIllnesses = new PreviousIllness();
    previousIllnesses.setHepA(dto.hepA());
    previousIllnesses.setHepB(dto.hepB());
    previousIllnesses.setHepC(dto.hepC());
    previousIllnesses.setHiv(dto.hiv());
    previousIllnesses.setSyphilis(dto.syphilis());
    previousIllnesses.setGonorrhea(dto.gonorrhea());
    previousIllnesses.setChlamydia(dto.chlamydia());
    previousIllnesses.setOther(dto.other());
    previousIllnesses.setOtherData(dto.otherData());
    return previousIllnesses;
  }
}
