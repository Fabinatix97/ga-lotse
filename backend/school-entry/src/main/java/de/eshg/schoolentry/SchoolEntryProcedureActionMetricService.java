/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.ANAMNESIS_ADDED_BY_CITIZEN;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.procedure.model.ProcedureAction;
import de.eshg.lib.procedure.model.ProcedureActionType;
import de.eshg.lib.procedure.procedures.AbstractProcedureActionMetricService;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryProcedureActionMetricService extends AbstractProcedureActionMetricService {
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  protected SchoolEntryProcedureActionMetricService(
      SchoolEntryProcedureRepository schoolEntryProcedureRepository) {
    super(BusinessModule.SCHOOL_ENTRY);
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
  }

  @Override
  protected ProcedureAction getReferenceProcedureAction(
      Instant timeRangeStart, Instant timeRangeEnd) {
    return new ProcedureAction(
        ProcedureActionType.INVITATIONS_SENT,
        schoolEntryProcedureRepository.countInvitationSentTrueCreatedAtBetween(
            timeRangeStart, timeRangeEnd));
  }

  @Override
  protected List<ProcedureAction> getRelatedProcedureActions(
      Instant timeRangeStart, Instant timeRangeEnd) {
    ProcedureAction appointmentOnce =
        new ProcedureAction(
            ProcedureActionType.APPOINTMENTS_RESCHEDULED_AT_LEAST_ONCE,
            schoolEntryProcedureRepository
                .countByAppointmentChangedAtLeastTimesByCitizenCreatedAtBetween(
                    1, timeRangeStart, timeRangeEnd));
    ProcedureAction appointmentTwice =
        new ProcedureAction(
            ProcedureActionType.APPOINTMENTS_RESCHEDULED_AT_LEAST_TWICE,
            schoolEntryProcedureRepository
                .countByAppointmentChangedAtLeastTimesByCitizenCreatedAtBetween(
                    2, timeRangeStart, timeRangeEnd));
    ProcedureAction anamnesis =
        new ProcedureAction(
            ProcedureActionType.SUBMITTED_ANAMNESIS,
            schoolEntryProcedureRepository.countBySystemProgressEntryTypeExistCreatedAtBetween(
                ANAMNESIS_ADDED_BY_CITIZEN.name(), timeRangeStart, timeRangeEnd));
    return List.of(appointmentOnce, appointmentTwice, anamnesis);
  }
}
