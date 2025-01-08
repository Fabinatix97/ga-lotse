/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "Salutation",
    description =
        "A list of categories for the salutation from which specific salutation phrases can be derived. The choice of salutation is free for every citizen and not dependent on gender.")
public enum SalutationDto {
  NOT_SPECIFIED,
  NEUTRAL,
  FEMALE,
  MALE
}
