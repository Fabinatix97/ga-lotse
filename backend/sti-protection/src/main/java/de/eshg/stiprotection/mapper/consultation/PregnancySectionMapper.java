/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.consultation;

import de.eshg.stiprotection.api.consultation.PregnancySectionDto;
import de.eshg.stiprotection.persistence.db.consultation.PregnancySection;

public class PregnancySectionMapper {
  private PregnancySectionMapper() {}

  public static PregnancySectionDto toInterfaceType(PregnancySection entity) {
    if (entity == null) {
      return new PregnancySectionDto(null, null, null, null, null, null, null, null);
    }

    return new PregnancySectionDto(
        entity.getHasPregnancyRelatedInfo(),
        entity.getLastCytologyTest(),
        entity.getStartOfLastPeriod(),
        entity.getNumberOfPregnancies(),
        entity.getNumberOfInducedAbortions(),
        entity.getNumberOfBirths(),
        entity.getNumberOfOtherAbortions(),
        entity.getNumberOfEctopicPregnancies());
  }

  public static PregnancySection toDatabaseType(PregnancySectionDto dto) {
    if (dto == null) {
      return null;
    }
    PregnancySection entity = new PregnancySection();
    entity.setHasPregnancyRelatedInfo(dto.hasPregnancyRelatedInfo());
    entity.setLastCytologyTest(dto.lastCytologyTest());
    entity.setStartOfLastPeriod(dto.startOfLastPeriod());
    entity.setNumberOfPregnancies(dto.numberOfPregnancies());
    entity.setNumberOfInducedAbortions(dto.numberOfInducedAbortions());
    entity.setNumberOfBirths(dto.numberOfBirths());
    entity.setNumberOfOtherAbortions(dto.numberOfOtherAbortions());
    entity.setNumberOfEctopicPregnancies(dto.numberOfEctopicPregnancies());

    return entity;
  }
}
