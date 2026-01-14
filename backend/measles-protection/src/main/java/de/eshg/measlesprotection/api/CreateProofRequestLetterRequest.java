/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "CreateProofRequestLetter")
public record CreateProofRequestLetterRequest(
    @NotNull UUID recipientId,
    @NotNull LocalDate deadline,
    @NotNull boolean withDeliveryCertificate)
    implements ProofRequestLetterRequest {

  public CreateProofRequestLetterRequest(UUID recipientId, LocalDate deadline) {
    this(recipientId, deadline, false);
  }
}
