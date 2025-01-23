/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "FluoridationConsent")
public record FluoridationConsentDto(
    @NotNull @PastOrPresent LocalDate dateOfConsent,
    @NotNull boolean consented,
    Boolean hasAllergy) {

  public FluoridationConsentDto(LocalDate dateOfConsent, boolean consented) {
    this(dateOfConsent, consented, null);
  }
}
