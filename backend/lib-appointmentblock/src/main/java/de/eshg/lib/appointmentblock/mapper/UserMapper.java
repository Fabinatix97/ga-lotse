/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.mapper;

import de.eshg.lib.appointmentblock.api.AppointmentBlockUserDto;

public class UserMapper {

  private UserMapper() {}

  public static AppointmentBlockUserDto mapToAppointmentBlockDto(
      de.eshg.base.user.api.UserDto baseDto) {
    return new AppointmentBlockUserDto(baseDto.userId(), baseDto.firstName(), baseDto.lastName());
  }
}
