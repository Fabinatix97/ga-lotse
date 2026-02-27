/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.base.SalutationDto;
import de.eshg.infectionbriefing.api.InfectionBriefingSalutationDto;

public class SalutationMapper {
  private SalutationMapper() {}

  public static InfectionBriefingSalutationDto mapToInfectionBriefingSalutationDto(
      SalutationDto salutation) {
    return switch (salutation) {
      case null -> null;
      case NOT_SPECIFIED -> InfectionBriefingSalutationDto.NOT_SPECIFIED;
      case NEUTRAL -> InfectionBriefingSalutationDto.NEUTRAL;
      case FEMALE -> InfectionBriefingSalutationDto.FEMALE;
      case MALE -> InfectionBriefingSalutationDto.MALE;
    };
  }

  public static SalutationDto mapToBaseSalutationDto(InfectionBriefingSalutationDto salutation) {
    return switch (salutation) {
      case null -> null;
      case NOT_SPECIFIED -> SalutationDto.NOT_SPECIFIED;
      case NEUTRAL -> SalutationDto.NEUTRAL;
      case FEMALE -> SalutationDto.FEMALE;
      case MALE -> SalutationDto.MALE;
    };
  }
}
