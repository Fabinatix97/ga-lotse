/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.RoleStatusDto;
import de.eshg.measlesprotection.persistence.db.RoleStatus;
import de.eshg.rest.service.error.BadRequestException;

public class RoleStatusMapper {

  private RoleStatusMapper() {}

  public static RoleStatusDto toInterfaceType(RoleStatus roleStatus) {
    return switch (roleStatus) {
      case null -> null;
      case EMPLOYEE -> RoleStatusDto.EMPLOYEE;
      case SUPERVISED -> RoleStatusDto.SUPERVISED;
    };
  }

  public static RoleStatus toDatabaseType(RoleStatusDto roleStatus) {
    if (roleStatus == null) {
      throw new BadRequestException("Role status must not be null");
    }
    return switch (roleStatus) {
      case EMPLOYEE -> RoleStatus.EMPLOYEE;
      case SUPERVISED -> RoleStatus.SUPERVISED;
    };
  }
}
