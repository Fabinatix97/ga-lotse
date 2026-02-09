/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.ApplicantCategoryMapper.toDomainType;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.PersonDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingPerson;
import de.eshg.infectionbriefing.domain.model.InstructionType;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import java.time.Clock;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CreateNewCertificateProcedureService {

  private final PersonApi personApi;
  private final InfectionBriefingAppointmentService appointmentService;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public CreateNewCertificateProcedureService(
      PersonApi personApi,
      InfectionBriefingAppointmentService appointmentService,
      InfectionBriefingProcedureRepository procedureRepository,
      Clock clock,
      AuditLogger auditLogger) {
    this.personApi = personApi;
    this.appointmentService = appointmentService;
    this.procedureRepository = procedureRepository;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  public AppointmentDto createNewCertificateProcedure(
      BookNewCertificateAppointmentRequest request) {
    NewCertificateProcedure procedure = new NewCertificateProcedure();
    AppointmentDto appointment = appointmentService.bookAppointment(procedure, request.startTime());
    UUID fileStateId = createPersonInCentralFile(request.applicant());
    procedure.addRelatedPerson(createRelatedPerson(fileStateId));
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_NEW);
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    procedure.setInstructionType(InstructionType.ON_SITE);
    procedure.setApplicantCategory(toDomainType(request.applicantCategoryDto()));
    procedureRepository.save(procedure);
    return appointment;
  }

  private InfectionBriefingPerson createRelatedPerson(UUID fileStateId) {
    InfectionBriefingPerson person = new InfectionBriefingPerson();
    person.setCentralFileStateId(fileStateId);
    person.setPersonType(PersonType.PROFESSIONAL);
    return person;
  }

  private UUID createPersonInCentralFile(PersonDto applicant) {
    return personApi
        .addPersonFromExternalSource(
            new ExternalAddPersonFileStateRequest(
                null,
                applicant.salutation(),
                null,
                applicant.firstName().trim(),
                applicant.lastName().trim(),
                applicant.dateOfBirth(),
                null,
                null,
                null,
                List.of(applicant.email()),
                Optional.ofNullable(applicant.phone()).map(List::of).orElse(null),
                null,
                null))
        .id();
  }
}
