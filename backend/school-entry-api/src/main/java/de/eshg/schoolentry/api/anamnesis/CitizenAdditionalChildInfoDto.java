/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "CitizenAdditionalChildInfo")
public record CitizenAdditionalChildInfoDto(
    String responsiblePhysician, List<Integer> siblingsBirthYears) {
  public CitizenAdditionalChildInfoDto() {
    this(null, null);
  }
}
