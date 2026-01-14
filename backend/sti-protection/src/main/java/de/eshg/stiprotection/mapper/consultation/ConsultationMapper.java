/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.consultation;

import de.eshg.stiprotection.api.consultation.ConsultationDto;
import de.eshg.stiprotection.persistence.db.consultation.Consultation;

public class ConsultationMapper {
  private ConsultationMapper() {}

  public static ConsultationDto toInterfaceType(Consultation entity) {
    if (entity == null) {
      return new ConsultationDto(null, null);
    }

    return new ConsultationDto(
        GeneralSectionMapper.toInterfaceType(entity.getGeneral()),
        PregnancySectionMapper.toInterfaceType(entity.getPregnancy()));
  }

  public static Consultation update(ConsultationDto dto, Consultation entity) {
    if (dto == null) {
      return null;
    }

    entity.setGeneral(GeneralSectionMapper.toDatabaseType(dto.general()));
    entity.setPregnancy(PregnancySectionMapper.toDatabaseType(dto.pregnancy()));

    return entity;
  }
}
