/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "ResourceType",
    description = "The list of possible types under which Resources can be categorized.")
public enum ResourceTypeDto {
  BICYCLE,
  CAR,
  ROOM,
  CAMERA,
  MEASURING_DEVICE,
  MEASURING_KIT,
  MISC,
  TABLET,
  LAPTOP
}
