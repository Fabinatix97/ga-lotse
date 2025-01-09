/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.consultation;

import de.eshg.stiprotection.api.consultation.GeneralSectionDto;
import de.eshg.stiprotection.persistence.db.consultation.GeneralSection;

public class GeneralSectionMapper {
  private GeneralSectionMapper() {}

  public static GeneralSectionDto toInterfaceType(GeneralSection entity) {
    if (entity == null) {
      return new GeneralSectionDto(
          null, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    return new GeneralSectionDto(
        entity.getMainReason(),
        entity.getFurtherGenderInfo(),
        entity.getHasSufficientGermanLanguageSkills(),
        entity.getIsIlliterate(),
        entity.getOtherKnownLanguages(),
        entity.getHasHealthInsurance(),
        entity.getHasGermanHealthInsurance(),
        entity.getHasInsecureResidence(),
        entity.getHasSymptoms(),
        entity.getSymptoms(),
        entity.getDrugUse(),
        entity.getReferral(),
        entity.getNotes());
  }

  public static GeneralSection toDatabaseType(GeneralSectionDto dto) {
    if (dto == null) {
      return null;
    }

    GeneralSection entity = new GeneralSection();
    entity.setMainReason(dto.mainReason());
    entity.setFurtherGenderInfo(dto.furtherGenderInfo());
    entity.setHasSufficientGermanLanguageSkills(dto.hasSufficientGermanLanguageSkills());
    entity.setIsIlliterate(dto.isIlliterate());
    entity.setOtherKnownLanguages(dto.otherKnownLanguages());
    entity.setHasHealthInsurance(dto.hasHealthInsurance());
    entity.setHasGermanHealthInsurance(dto.hasGermanHealthInsurance());
    entity.setHasInsecureResidence(dto.hasInsecureResidence());
    entity.setHasSymptoms(dto.hasSymptoms());
    entity.setSymptoms(dto.symptoms());
    entity.setDrugUse(dto.drugUse());
    entity.setReferral(dto.referral());
    entity.setNotes(dto.notes());

    return entity;
  }
}
