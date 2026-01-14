/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.SexWorkRiskContactDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkRiskContact;

public final class SexWorkRiskContactMapper {
  private SexWorkRiskContactMapper() {}

  public static SexWorkRiskContactDto toInterfaceType(SexWorkRiskContact entity) {
    if (entity == null) {
      return null;
    }

    return new SexWorkRiskContactDto(
        entity.getStartInSexWorkDate(),
        SexWorkLocationMapper.toInterfaceType(entity.getSexWorkLocations()));
  }

  public static SexWorkRiskContact toDatabaseType(SexWorkRiskContactDto dto) {
    if (dto == null) {
      return null;
    }

    SexWorkRiskContact sexWorkRiskContact = new SexWorkRiskContact();
    sexWorkRiskContact.setStartInSexWorkDate(dto.startInSexWorkDate());
    sexWorkRiskContact.setSexWorkLocations(
        SexWorkLocationMapper.toDatabaseType(dto.sexWorkLocations()));
    return sexWorkRiskContact;
  }
}
