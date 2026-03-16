/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.testhelper;

import static de.eshg.infectionbriefing.mapper.InfectionBriefingPersonMapper.mapToInfectionBriefingPerson;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.infectionbriefing.InfectionBriefingAppointmentService;
import de.eshg.infectionbriefing.InfectionBriefingTriggerType;
import de.eshg.infectionbriefing.PersonClient;
import de.eshg.infectionbriefing.api.CreateInfectionBriefingProcedureRequest;
import de.eshg.infectionbriefing.api.CreateInfectionBriefingProcedureResponse;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingTestHelperService {

  private final InfectionBriefingAppointmentService appointmentService;
  private final PersonClient personClient;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public InfectionBriefingTestHelperService(
      InfectionBriefingAppointmentService appointmentService,
      PersonClient personClient,
      InfectionBriefingProcedureRepository procedureRepository,
      Clock clock,
      AuditLogger auditLogger,
      ModuleClientAuthenticator moduleClientAuthenticator,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.appointmentService = appointmentService;
    this.personClient = personClient;
    this.procedureRepository = procedureRepository;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public CreateInfectionBriefingProcedureResponse createProcedure(
      CreateInfectionBriefingProcedureRequest request) {
    NewCertificateProcedure procedure =
        new NewCertificateProcedure(InfectionBriefingTriggerType.CITIZEN);
    appointmentService.bookAppointment(
        procedure, AppointmentType.INFECTION_BRIEFING_NEW, request.appointmentStartTime());

    UUID personFileStateId =
        personClient.createExternalSourcePerson(request.applicant(), request.applicantAddress());

    CitizenAccessCodeUserDto citizenAccessCodeUser =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () ->
                citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(
                    new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(
                        personFileStateId)));

    procedure.setCitizenUserId(citizenAccessCodeUser.userId());
    procedure.addRelatedPerson(mapToInfectionBriefingPerson(personFileStateId));

    procedure.setProcedureType(request.procedureType());
    procedure.updateProcedureStatus(request.procedureStatus(), clock, auditLogger);
    procedure.setInstructionType(request.instructionType());
    procedure.setInstructionDate(request.instructionDate());
    InfectionBriefingProcedure newProcedure = procedureRepository.save(procedure);

    return new CreateInfectionBriefingProcedureResponse(newProcedure.getExternalId());
  }
}
