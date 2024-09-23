/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "ContactCategory",
    description =
        "The list of possible types under which an Institution in the Contact Management can be categorized.")
public enum InstitutionContactCategoryDto {
  LABORATORY,
  SCHOOL,
  DOCTORS_OFFICE,
  HEALTH_DEPARTMENT,
  MISC
}
