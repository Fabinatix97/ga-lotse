/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UserEventType")
public enum UserEventTypeDto {
  LOGIN,
  LOGIN_ERROR
}
