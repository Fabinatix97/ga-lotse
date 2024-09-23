/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "AdditionalChildInfo")
public record AdditionalChildInfoDto(
    String responsiblePhysician, Integer numberOfSiblings, List<Integer> siblingsBirthYears) {
  public AdditionalChildInfoDto() {
    this(null, null, List.of());
  }
}
