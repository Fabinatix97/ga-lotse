/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "CitizenAdditionalChildInfo")
public record CitizenAdditionalChildInfoDto(
    String responsiblePhysician, @NotNull List<Integer> siblingsBirthYears) {
  public CitizenAdditionalChildInfoDto() {
    this(null, List.of());
  }
}
