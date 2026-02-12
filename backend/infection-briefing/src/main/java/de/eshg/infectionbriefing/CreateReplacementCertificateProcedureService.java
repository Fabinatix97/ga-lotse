/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.InfectionBriefingPersonMapper.mapToInfectionBriefingPerson;

import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentRequest;
import de.eshg.infectionbriefing.domain.model.ReplacementCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import java.time.Clock;
import org.springframework.stereotype.Service;

@Service
public class CreateReplacementCertificateProcedureService {

  private final InfectionBriefingAppointmentService appointmentService;
  private final PersonClient personClient;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public CreateReplacementCertificateProcedureService(
      InfectionBriefingAppointmentService appointmentService,
      PersonClient personClient,
      InfectionBriefingProcedureRepository procedureRepository,
      Clock clock,
      AuditLogger auditLogger) {
    this.appointmentService = appointmentService;
    this.personClient = personClient;
    this.procedureRepository = procedureRepository;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public AppointmentDto createReplacementCertificateProcedure(
      BookReplacementCertificateAppointmentRequest request) {
    ReplacementCertificateProcedure procedure = new ReplacementCertificateProcedure();
    AppointmentDto appointment =
        appointmentService.bookAppointment(
            procedure, AppointmentType.INFECTION_BRIEFING_REPLACEMENT, request.startTime());
    procedure.addRelatedPerson(
        mapToInfectionBriefingPerson(personClient.createPerson(request.applicant())));
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_REPLACEMENT);
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    procedureRepository.save(procedure);
    return appointment;
  }
}
