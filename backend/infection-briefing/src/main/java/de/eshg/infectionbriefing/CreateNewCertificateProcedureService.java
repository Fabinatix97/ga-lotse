/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.ApplicantCategoryMapper.toDomainType;
import static de.eshg.infectionbriefing.mapper.InfectionBriefingPersonMapper.mapToInfectionBriefingPerson;

import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentRequest;
import de.eshg.infectionbriefing.domain.model.InstructionType;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import java.time.Clock;
import org.springframework.stereotype.Service;

@Service
public class CreateNewCertificateProcedureService {

  private final InfectionBriefingAppointmentService appointmentService;
  private final PersonClient personClient;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public CreateNewCertificateProcedureService(
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

  public AppointmentDto createNewCertificateProcedure(
      BookNewCertificateAppointmentRequest request) {
    NewCertificateProcedure procedure = new NewCertificateProcedure();
    AppointmentDto appointment =
        appointmentService.bookAppointment(
            procedure, AppointmentType.INFECTION_BRIEFING_NEW, request.startTime());
    procedure.addRelatedPerson(
        mapToInfectionBriefingPerson(
            personClient.createPerson(request.applicant(), request.applicantAddress())));
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_NEW);
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    procedure.setInstructionType(InstructionType.ON_SITE);
    procedure.setApplicantCategory(toDomainType(request.applicantCategoryDto()));
    procedureRepository.save(procedure);
    return appointment;
  }
}
