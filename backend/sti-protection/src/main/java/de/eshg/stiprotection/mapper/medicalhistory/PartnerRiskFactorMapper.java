/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.PartnerRiskFactorDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.PartnerRiskFactor;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class PartnerRiskFactorMapper {

  private PartnerRiskFactorMapper() {}

  public static Set<PartnerRiskFactorDto> toInterfaceType(Set<PartnerRiskFactor> entities) {
    if (entities == null) {
      return Collections.emptySet();
    }
    return entities.stream()
        .map(PartnerRiskFactorMapper::toInterfaceType)
        .sorted(Comparator.comparing(PartnerRiskFactorDto::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static PartnerRiskFactorDto toInterfaceType(PartnerRiskFactor entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case HOMOSEXUAL -> PartnerRiskFactorDto.HOMOSEXUAL;
      case BISEXUAL_MALE -> PartnerRiskFactorDto.BISEXUAL_MALE;
      case HIV_POSITIVE -> PartnerRiskFactorDto.HIV_POSITIVE;
      case STI_POSITIVE -> PartnerRiskFactorDto.STI_POSITIVE;
      case INJECTED_DRUGS -> PartnerRiskFactorDto.INJECTED_DRUGS;
      case SEX_WORKER -> PartnerRiskFactorDto.SEX_WORKER;
    };
  }

  public static Set<PartnerRiskFactor> toDatabaseType(Set<PartnerRiskFactorDto> dtos) {
    if (dtos == null) {
      return Collections.emptySet();
    }
    return dtos.stream()
        .map(PartnerRiskFactorMapper::toDatabaseType)
        .sorted(Comparator.comparing(PartnerRiskFactor::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static PartnerRiskFactor toDatabaseType(PartnerRiskFactorDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case HOMOSEXUAL -> PartnerRiskFactor.HOMOSEXUAL;
      case BISEXUAL_MALE -> PartnerRiskFactor.BISEXUAL_MALE;
      case HIV_POSITIVE -> PartnerRiskFactor.HIV_POSITIVE;
      case STI_POSITIVE -> PartnerRiskFactor.STI_POSITIVE;
      case INJECTED_DRUGS -> PartnerRiskFactor.INJECTED_DRUGS;
      case SEX_WORKER -> PartnerRiskFactor.SEX_WORKER;
    };
  }
}
