/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.infectionbriefing.api.InstructionTypeDto;
import de.eshg.infectionbriefing.domain.model.InstructionType;

public class InstructionTypeMapper {

  private InstructionTypeMapper() {}

  public static InstructionTypeDto toInterfaceType(InstructionType instructionType) {
    return switch (instructionType) {
      case null -> null;
      case ONLINE -> InstructionTypeDto.ONLINE;
      case ON_SITE -> InstructionTypeDto.ON_SITE;
    };
  }

  public static InstructionType toDomainType(InstructionTypeDto instructionType) {
    return switch (instructionType) {
      case null -> null;
      case ONLINE -> InstructionType.ONLINE;
      case ON_SITE -> InstructionType.ON_SITE;
    };
  }
}
