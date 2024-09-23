/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.util.UUID;

public record ServicePlanEntry(
    UUID procedureId,
    VcService service,
    ProcedureStep procedureStep,
    Appointment appointment,
    UserDefinedAppointment userDefinedAppointment,
    Boolean isMedicalHistoryAnswered) {}
