/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.RiskContactDto;
import de.eshg.stiprotection.mapper.GenderMapper;
import de.eshg.stiprotection.persistence.db.medicalhistory.RiskContact;

public final class RiskContactMapper {
  private RiskContactMapper() {}

  public static RiskContactDto toInterfaceType(RiskContact entity) {
    if (entity == null) {
      return null;
    }

    return new RiskContactDto(
        SexualOrientationMapper.toInterfaceType(entity.getSexualOrientation()),
        entity.getNumberOfSexualPartnersLast12Months(),
        GenderMapper.toInterfaceType(entity.getSexualContacts()),
        PartnerRiskFactorMapper.toInterfaceType(entity.getPartnerRiskFactors()));
  }

  public static RiskContact toDatabaseType(RiskContactDto dto) {
    if (dto == null) {
      return null;
    }

    RiskContact riskContact = new RiskContact();
    riskContact.setSexualOrientation(
        SexualOrientationMapper.toDatabaseType(dto.sexualOrientation()));
    riskContact.setNumberOfSexualPartnersLast12Months(dto.numberOfSexualPartnersLast12Months());
    riskContact.setSexualContacts(GenderMapper.toDatabaseType(dto.sexualContacts()));
    riskContact.setPartnerRiskFactors(
        PartnerRiskFactorMapper.toDatabaseType(dto.partnerRiskFactors()));
    return riskContact;
  }
}
