/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "DataOrigin",
    description =
        "A list of possible origins of Persons and Facility in the Central Files. EDIT will only be set automatically on changes. EXTERNAL is for entries that come, e.g., from the citizen portal. IMPORT is reserved for automatic imports. MANUAL shall be set for every creation or connection done by an employee.")
public enum DataOriginDto {
  MANUAL,
  EXTERNAL,
  IMPORT,
  EDIT
}
