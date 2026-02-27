/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.InfectionBriefingPersonMapper.mapToInfectionBriefingPerson;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentResponse;
import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentResponse;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureResponse;
import de.eshg.infectionbriefing.domain.model.InstructionType;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.model.ReplacementCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.time.Clock;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CreateInfectionBriefingProcedureService {

  private static final Logger log =
      LoggerFactory.getLogger(CreateInfectionBriefingProcedureService.class);

  private final InfectionBriefingAppointmentService appointmentService;
  private final PersonClient personClient;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final MailService mailService;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final CitizenAccessCodeUserApi citizenAccessCodeUserApi;

  public CreateInfectionBriefingProcedureService(
      InfectionBriefingAppointmentService appointmentService,
      PersonClient personClient,
      InfectionBriefingProcedureRepository procedureRepository,
      Clock clock,
      AuditLogger auditLogger,
      MailService mailService,
      ModuleClientAuthenticator moduleClientAuthenticator,
      CitizenAccessCodeUserApi citizenAccessCodeUserApi) {
    this.appointmentService = appointmentService;
    this.personClient = personClient;
    this.procedureRepository = procedureRepository;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.mailService = mailService;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.citizenAccessCodeUserApi = citizenAccessCodeUserApi;
  }

  public BookNewCertificateAppointmentResponse createNewCertificateProcedureByCitizen(
      BookNewCertificateAppointmentRequest request) {
    NewCertificateProcedure procedure = new NewCertificateProcedure(TriggerType.CITIZEN);
    AppointmentDto appointment =
        appointmentService.bookAppointment(
            procedure, AppointmentType.INFECTION_BRIEFING_NEW, request.startTime());

    UUID personFileStateId =
        personClient.createExternalSourcePerson(request.applicant(), request.applicantAddress());

    CitizenAccessCodeUserDto citizenAccessCodeUser =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () ->
                citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(
                    new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(
                        personFileStateId)));

    procedure.addRelatedPerson(mapToInfectionBriefingPerson(personFileStateId));
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_NEW);
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    procedure.setInstructionType(InstructionType.ON_SITE);
    procedure.setCitizenUserId(citizenAccessCodeUser.userId());
    procedureRepository.save(procedure);

    return new BookNewCertificateAppointmentResponse(
        appointment,
        sendNewCertificateConfirmationMail(request, citizenAccessCodeUser.accessCode()));
  }

  public BookReplacementCertificateAppointmentResponse
      createReplacementCertificateProcedureByCitizen(
          BookReplacementCertificateAppointmentRequest request) {
    ReplacementCertificateProcedure procedure =
        new ReplacementCertificateProcedure(TriggerType.CITIZEN);
    AppointmentDto appointment =
        appointmentService.bookAppointment(
            procedure, AppointmentType.INFECTION_BRIEFING_REPLACEMENT, request.startTime());

    UUID personFileStateId = personClient.createExternalSourcePerson(request.applicant(), null);

    CitizenAccessCodeUserDto citizenAccessCodeUser =
        moduleClientAuthenticator.doWithModuleClientAuthentication(
            () ->
                citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(
                    new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(
                        personFileStateId)));

    procedure.addRelatedPerson(mapToInfectionBriefingPerson(personFileStateId));
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_REPLACEMENT);
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    procedure.setCitizenUserId(citizenAccessCodeUser.userId());
    procedureRepository.save(procedure);

    return new BookReplacementCertificateAppointmentResponse(
        appointment,
        sendReplacementCertificateConfirmationMail(request, citizenAccessCodeUser.accessCode()));
  }

  public CreateNewCertificateProcedureResponse createNewCertificateProcedureByEmployee(
      CreateNewCertificateProcedureRequest request) {
    NewCertificateProcedure procedure = new NewCertificateProcedure(TriggerType.EMPLOYEE);
    procedure.addRelatedPerson(
        mapToInfectionBriefingPerson(
            personClient.createPersonInCentralFile(
                request.applicant(), request.applicantAddress())));
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_NEW);
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
    procedure.setInstructionType(InstructionType.ON_SITE);
    return new CreateNewCertificateProcedureResponse(
        procedureRepository.save(procedure).getExternalId());
  }

  private boolean sendNewCertificateConfirmationMail(
      BookNewCertificateAppointmentRequest request, String accessCode) {
    try {
      mailService.sendNewCertificateAppointmentConfirmationMail(
          request.startTime(), request.applicant().email(), accessCode);
      return true;
    } catch (Exception e) {
      log.warn("Cannot send confirmation e-mail", e);
      return false;
    }
  }

  private boolean sendReplacementCertificateConfirmationMail(
      BookReplacementCertificateAppointmentRequest request, String accessCode) {
    try {
      mailService.sendReplacementCertificateAppointmentConfirmationMail(
          request.startTime(), request.applicant().email(), accessCode);
      return true;
    } catch (Exception e) {
      log.warn("Cannot send confirmation e-mail", e);
      return false;
    }
  }
}
