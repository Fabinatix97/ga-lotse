/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.lib.procedure.model.PdfDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(
    name = "ProofRequestLetter",
    description =
        "A letter sent by a health department to request evidence or confirmation of vaccination.")
public record ProofRequestLetterDto(
    @NotNull UUID recipientId,
    @NotNull LocalDate sentAt,
    @NotNull LocalDate deadline,
    @NotNull @Valid PdfDto pdf) {}
