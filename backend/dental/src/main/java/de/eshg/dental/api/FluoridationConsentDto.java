/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "FluoridationConsent")
public record FluoridationConsentDto(
    @NotNull @PastOrPresent LocalDate dateOfConsent,
    BooleanWithUnknownDto consented,
    Boolean hasAllergy) {

  public FluoridationConsentDto(LocalDate dateOfConsent, BooleanWithUnknownDto consented) {
    this(dateOfConsent, consented, null);
  }
}
