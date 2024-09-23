/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public interface ProofRequestLetterRequest {

  @Schema(description = "The id of the letter recipient, e.g affected person, custodian, etc..")
  UUID recipientId();

  @Schema(
      description = "The deadline in the future by which a proof must be submitted.",
      example = "2024-06-03")
  @NotNull
  @Future
  LocalDate deadline();

  @NotNull
  @Schema(description = "Indicates whether the letter was sent with a delivery certificate.")
  boolean withDeliveryCertificate();
}
