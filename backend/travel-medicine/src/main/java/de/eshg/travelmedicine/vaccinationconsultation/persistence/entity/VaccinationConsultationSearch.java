/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import java.time.LocalDate;
import java.util.UUID;

public record VaccinationConsultationSearch(
    UUID procedureId,
    UUID fileState,
    LocalDate travelStartDate,
    ProcedureStatus status,
    CreatedByUserType createdBy) {}
