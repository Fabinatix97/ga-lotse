/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.DentitionTypeDto;
import de.eshg.dental.domain.model.DentitionType;

public final class DentitionTypeMapper {
  private DentitionTypeMapper() {}

  public static DentitionType mapToDomain(DentitionTypeDto dto) {
    return switch (dto) {
      case null -> null;
      case PRIMARY -> DentitionType.PRIMARY;
      case MIXED -> DentitionType.MIXED;
      case SECONDARY -> DentitionType.SECONDARY;
    };
  }

  public static DentitionTypeDto mapToDto(DentitionType dentitionType) {
    return switch (dentitionType) {
      case null -> null;
      case PRIMARY -> DentitionTypeDto.PRIMARY;
      case MIXED -> DentitionTypeDto.MIXED;
      case SECONDARY -> DentitionTypeDto.SECONDARY;
    };
  }
}
