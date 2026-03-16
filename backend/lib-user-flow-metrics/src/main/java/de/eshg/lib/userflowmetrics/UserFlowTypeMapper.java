/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics;

import de.eshg.lib.userflowmetrics.api.UserFlowTypeDto;
import de.eshg.lib.userflowmetrics.persistence.UserFlowType;

class UserFlowTypeMapper {
  private UserFlowTypeMapper() {}

  static UserFlowTypeDto mapToApi(UserFlowType type) {
    return switch (type) {
      case ANAMNESIS -> UserFlowTypeDto.ANAMNESIS;
      case BOOKING -> UserFlowTypeDto.BOOKING;
      case CANCELING -> UserFlowTypeDto.CANCELING;
      case INFORMATION_STATEMENT -> UserFlowTypeDto.INFORMATION_STATEMENT;
      case REPORTING -> UserFlowTypeDto.REPORTING;
      case RESCHEDULING -> UserFlowTypeDto.RESCHEDULING;
    };
  }

  static UserFlowType mapToDomain(UserFlowTypeDto type) {
    return switch (type) {
      case ANAMNESIS -> UserFlowType.ANAMNESIS;
      case BOOKING -> UserFlowType.BOOKING;
      case CANCELING -> UserFlowType.CANCELING;
      case INFORMATION_STATEMENT -> UserFlowType.INFORMATION_STATEMENT;
      case REPORTING -> UserFlowType.REPORTING;
      case RESCHEDULING -> UserFlowType.RESCHEDULING;
    };
  }
}
