/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "Gender",
    description = "The list of genders as specified in the German Personenstandsgesetz.")
public enum GenderDto {
  NOT_SPECIFIED,
  DIVERSE,
  FEMALE,
  MALE
}
