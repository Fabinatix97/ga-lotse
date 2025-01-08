/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "SaveProofRequestLetter")
public record SaveProofRequestLetterRequest(
    @NotNull UUID recipientId, LocalDate deadline, @NotNull boolean withDeliveryCertificate)
    implements ProofRequestLetterRequest {
  public SaveProofRequestLetterRequest(UUID recipientId, LocalDate deadline) {
    this(recipientId, deadline, false);
  }
}
