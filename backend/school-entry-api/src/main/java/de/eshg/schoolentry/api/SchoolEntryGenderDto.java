/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SchoolEntryGender",
    description = "The list of genders as specified in the German Personenstandsgesetz.")
public enum SchoolEntryGenderDto {
  NOT_SPECIFIED,
  DIVERSE,
  FEMALE,
  MALE
}
