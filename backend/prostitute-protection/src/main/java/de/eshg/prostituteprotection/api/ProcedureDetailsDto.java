/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(name = "ProcedureDetails")
public record ProcedureDetailsDto(
    @NotNull UUID id,
    @NotNull long version,
    String alias,
    String phoneNumber,
    @Valid AppointmentDto appointment,
    @NotNull boolean appointmentFromAppointmentBlock,
    @NotNull List<LanguageDto> languages,
    @NotNull ProcedureTypeDto procedureType,
    @NotNull ProcedureStatusDto procedureStatus,
    DocumentTypeDto documentTypeDto,
    Instant consultationCertificateCreatedAt,
    @NotNull boolean hasEncryptedData,
    @Valid UserNameDto consultant,
    @Valid UserNameDto creator,
    @NotNull @Valid WaitingRoomDto waitingRoom,
    @Future LocalDate residencePermitValidityDate,
    @Size(max = 255) String customDocumentType)
    implements ValidDocumentType {
  @Override
  @JsonIgnore
  public DocumentTypeDto documentType() {
    return documentTypeDto;
  }
}
