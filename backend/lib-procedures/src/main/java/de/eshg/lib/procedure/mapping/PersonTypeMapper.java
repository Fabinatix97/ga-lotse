/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.model.PersonTypeDto;

public final class PersonTypeMapper {

  private PersonTypeMapper() {}

  public static PersonTypeDto toInterfaceType(PersonType personType) {
    return switch (personType) {
      case PATIENT -> PersonTypeDto.PATIENT;
      case PARENT -> PersonTypeDto.PARENT;
      case PROFESSIONAL -> PersonTypeDto.PROFESSIONAL;
    };
  }
}
