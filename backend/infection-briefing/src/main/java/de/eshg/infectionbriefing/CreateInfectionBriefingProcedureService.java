/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.InfectionBriefingPersonMapper.mapToInfectionBriefingPerson;

import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.citizenuser.api.AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest;
import de.eshg.base.citizenuser.api.CitizenAccessCodeUserDto;
import de.eshg.infectionbriefing.api.ApplicantAddressDto;
import de.eshg.infectionbriefing.api.BookAppointmentResponse;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentByEmployeeRequest;
import de.eshg.infectionbriefing.api.BookNewCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentByEmployeeRequest;
import de.eshg.infectionbriefing.api.BookReplacementCertificateAppointmentRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureRequest;
import de.eshg.infectionbriefing.api.CreateNewCertificateProcedureResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingAppointmentDto;
import de.eshg.infectionbriefing.api.PersonCreationData;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.InstructionType;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.model.ReplacementCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;
import org.springframework.stereotype.Service;

@Service
public class CreateInfectionBriefingProcedureService {

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

  public BookAppointmentResponse createNewCertificateProcedureByCitizen(
      BookNewCertificateAppointmentRequest request) {
    return createProcedureWithApointment(
        TriggerType.CITIZEN,
        AppointmentType.INFECTION_BRIEFING_NEW,
        request.startTime(),
        request.applicant(),
        request.applicantAddress());
  }

  public BookAppointmentResponse createNewCertificateProcedureByEmployee(
      BookNewCertificateAppointmentByEmployeeRequest request) {
    return createProcedureWithApointment(
        TriggerType.EMPLOYEE,
        AppointmentType.INFECTION_BRIEFING_NEW,
        request.startTime(),
        request.applicant(),
        request.applicantAddress());
  }

  public BookAppointmentResponse createReplacementCertificateProcedureByCitizen(
      BookReplacementCertificateAppointmentRequest request) {
    return createProcedureWithApointment(
        TriggerType.CITIZEN,
        AppointmentType.INFECTION_BRIEFING_REPLACEMENT,
        request.startTime(),
        request.applicant(),
        null);
  }

  public BookAppointmentResponse createReplacementCertificateProcedureByEmployee(
      BookReplacementCertificateAppointmentByEmployeeRequest request) {
    return createProcedureWithApointment(
        TriggerType.EMPLOYEE,
        AppointmentType.INFECTION_BRIEFING_REPLACEMENT,
        request.startTime(),
        request.applicant(),
        null);
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

  private BookAppointmentResponse createProcedureWithApointment(
      TriggerType triggerType,
      AppointmentType appointmentType,
      Instant startTime,
      PersonCreationData applicant,
      ApplicantAddressDto applicantAddress) {
    InfectionBriefingProcedure procedure = createProcedure(triggerType, appointmentType);
    InfectionBriefingAppointmentDto appointment =
        appointmentService.bookAppointment(procedure, appointmentType, startTime);
    UUID fileStateId = createFileState(triggerType, applicant, applicantAddress);
    procedure.addRelatedPerson(mapToInfectionBriefingPerson(fileStateId));
    procedure.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);
    boolean emailSent =
        Optional.ofNullable(applicant.email())
            .map(
                email ->
                    createAccessCodeAndSendMail(
                        email,
                        appointmentType,
                        triggerType,
                        startTime,
                        fileStateId,
                        procedure::setCitizenUserId))
            .orElse(false);
    procedureRepository.save(procedure);
    return new BookAppointmentResponse(appointment, emailSent);
  }

  private InfectionBriefingProcedure createProcedure(
      TriggerType triggerType, AppointmentType appointmentType) {
    return switch (appointmentType) {
      case INFECTION_BRIEFING_NEW -> createNewCertificateProcedure(triggerType);
      case INFECTION_BRIEFING_REPLACEMENT -> createReplacementCertificateProcedure(triggerType);
      default ->
          throw new IllegalArgumentException("Unsupported appointmentType " + appointmentType);
    };
  }

  private InfectionBriefingProcedure createNewCertificateProcedure(TriggerType triggerType) {
    NewCertificateProcedure procedure = new NewCertificateProcedure(triggerType);
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_NEW);
    procedure.setInstructionType(InstructionType.ON_SITE);
    return procedure;
  }

  private InfectionBriefingProcedure createReplacementCertificateProcedure(
      TriggerType triggerType) {
    ReplacementCertificateProcedure procedure = new ReplacementCertificateProcedure(triggerType);
    procedure.setProcedureType(ProcedureType.INFECTION_BRIEFING_REPLACEMENT);
    return procedure;
  }

  private boolean createAccessCodeAndSendMail(
      String email,
      AppointmentType appointmentType,
      TriggerType triggerType,
      Instant startTime,
      UUID fileStateId,
      Consumer<UUID> citizenUserIdConsumer) {
    CitizenAccessCodeUserDto citizenAccessCodeUser =
        moduleClientAuthenticator.doWithPotentiallyReplacedModuleClientAuthenticator(
            () ->
                citizenAccessCodeUserApi.addCitizenAccessCodeUserWithDateOfBirthCredential(
                    new AddCitizenAccessCodeUserWithDateOfBirthCredentialRequest(fileStateId)));
    citizenUserIdConsumer.accept(citizenAccessCodeUser.userId());
    return mailService.sendAppointmentConfirmationMail(
        email, appointmentType, triggerType, startTime, citizenAccessCodeUser.accessCode());
  }

  private UUID createFileState(
      TriggerType triggerType, PersonCreationData applicant, ApplicantAddressDto applicantAddress) {
    return switch (triggerType) {
      case CITIZEN -> personClient.createExternalSourcePerson(applicant, applicantAddress);
      case EMPLOYEE -> personClient.createPersonInCentralFile(applicant, applicantAddress);
      default -> throw new IllegalArgumentException("Unsupported triggerType " + triggerType);
    };
  }
}
