/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.api.AcceptDraftRequest;
import de.eshg.infectionbriefing.api.ConfirmPaymentRequest;
import de.eshg.infectionbriefing.api.IssueCertificateResponse;
import de.eshg.infectionbriefing.document.CertificateGenerator;
import de.eshg.infectionbriefing.domain.model.CustodianConsent;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.infectionbriefing.mapper.ApplicantCategoryMapper;
import de.eshg.infectionbriefing.mapper.CustodianConsentMapper;
import de.eshg.infectionbriefing.util.InfectionBriefingKeyDocumentType;
import de.eshg.infectionbriefing.util.InfectionBriefingProgressEntryType;
import de.eshg.infectionbriefing.util.InfectionBriefingSystemProgressEntryFactory;
import de.eshg.infectionbriefing.util.ProcedureValidator;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class NewCertificateProcedureService {

  private final ProgressEntryService<InfectionBriefingProcedure> progressEntryService;
  private final CertificateGenerator certificateGenerator;
  private final PersonClient personClient;
  private final CustodianConsentHelper custodianConsentHelper;
  private final InfectionBriefingProcedureRepository repository;
  private final AuditLogger auditLogger;
  private final Clock clock;

  public NewCertificateProcedureService(
      ProgressEntryService<InfectionBriefingProcedure> progressEntryService,
      CertificateGenerator certificateGenerator,
      PersonClient personClient,
      CustodianConsentHelper custodianConsentHelper,
      InfectionBriefingProcedureRepository repository,
      AuditLogger auditLogger,
      Clock clock) {
    this.progressEntryService = progressEntryService;
    this.certificateGenerator = certificateGenerator;
    this.personClient = personClient;
    this.custodianConsentHelper = custodianConsentHelper;
    this.repository = repository;
    this.auditLogger = auditLogger;
    this.clock = clock;
  }

  public void acceptDraft(UUID procedureId, Optional<AcceptDraftRequest> request) {
    NewCertificateProcedure procedure =
        new ProcedureValidator<>(getNewCertificateProcedure(procedureId))
            .validateStatus(ProcedureStatus.DRAFT)
            .get();
    GetPersonFileStateResponse personFileState =
        personClient.getPersonFileState(procedure.getApplicant().getCentralFileStateId());
    procedure.setCustodianConsent(
        validateCustodianConsent(
            CustodianConsentMapper.toDomainType(
                request.map(AcceptDraftRequest::custodianConsent).orElse(null)),
            personFileState.dateOfBirth()));
    procedure
        .getApplicant()
        .setCentralFileStateId(
            getCentralFileState(
                request.map(AcceptDraftRequest::referencePersonId).orElse(null), personFileState));
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  public void confirmInfectionBriefing(UUID procedureId) {
    NewCertificateProcedure procedure =
        new ProcedureValidator<>(getNewCertificateProcedure(procedureId))
            .validateStatus(ProcedureStatus.OPEN)
            .validateNoSystemProgressEntryWithType(
                InfectionBriefingProgressEntryType.BRIEFING_CONFIRMED)
            .get();
    procedure.setInstructionDate(LocalDate.now(clock));
    progressEntryService.addSystemProgressEntry(
        procedure,
        InfectionBriefingSystemProgressEntryFactory.createSystemProgressEntry(
            InfectionBriefingProgressEntryType.BRIEFING_CONFIRMED, TriggerType.EMPLOYEE));
  }

  public void confirmPayment(UUID procedureId, ConfirmPaymentRequest request) {
    NewCertificateProcedure procedure =
        new ProcedureValidator<>(getNewCertificateProcedure(procedureId))
            .validateStatus(ProcedureStatus.OPEN)
            .validateNoSystemProgressEntryWithType(InfectionBriefingProgressEntryType.FEE_PAYED)
            .validateHasSystemProgressEntryType(
                InfectionBriefingProgressEntryType.BRIEFING_CONFIRMED)
            .get();
    procedure.setApplicantCategory(
        ApplicantCategoryMapper.toDomainType(request.applicantCategory()));
    progressEntryService.addSystemProgressEntry(
        procedure,
        InfectionBriefingSystemProgressEntryFactory.createSystemProgressEntry(
            InfectionBriefingProgressEntryType.FEE_PAYED, TriggerType.EMPLOYEE));
  }

  public IssueCertificateResponse issueCertificate(UUID procedureId) {
    NewCertificateProcedure procedure =
        new ProcedureValidator<>(getNewCertificateProcedure(procedureId))
            .validateStatus(ProcedureStatus.OPEN)
            .validateNoSystemProgressEntryWithType(
                InfectionBriefingProgressEntryType.CERTIFICATE_ISSUED)
            .validateHasSystemProgressEntryType(
                InfectionBriefingProgressEntryType.BRIEFING_CONFIRMED)
            .validateHasSystemProgressEntryType(InfectionBriefingProgressEntryType.FEE_PAYED)
            .get();
    return new IssueCertificateResponse(
        progressEntryService
            .addSystemProgressEntry(
                procedure,
                InfectionBriefingSystemProgressEntryFactory.createSystemProgressEntry(
                    InfectionBriefingProgressEntryType.CERTIFICATE_ISSUED,
                    TriggerType.EMPLOYEE,
                    InfectionBriefingKeyDocumentType.CERTIFICATE),
                certificateGenerator.generate(
                    personClient.getPersonFileState(
                        procedure.getApplicant().getCentralFileStateId()),
                    procedure.getInstructionDate()))
            .getFile()
            .getExternalId());
  }

  public IssueCertificateResponse issueReplacementCertificate(UUID procedureId) {
    NewCertificateProcedure procedure =
        new ProcedureValidator<>(getNewCertificateProcedure(procedureId))
            .validateStatus(ProcedureStatus.OPEN)
            .get();
    UUID fileId = getCertificateFileId(procedure);
    progressEntryService.addSystemProgressEntry(
        procedure,
        InfectionBriefingSystemProgressEntryFactory.createSystemProgressEntry(
            InfectionBriefingProgressEntryType.REPLACEMENT_CERTIFICATE_ISSUED,
            TriggerType.EMPLOYEE));
    return new IssueCertificateResponse(fileId);
  }

  private CustodianConsent validateCustodianConsent(
      CustodianConsent custodianConsent, LocalDate dateOfBirth) {
    if (custodianConsent == null && custodianConsentHelper.isMinor(dateOfBirth)) {
      throw new BadRequestException("Missing custodian consent for minor applicant");
    }
    return custodianConsent;
  }

  private UUID getCentralFileState(
      UUID referencePersonId, GetPersonFileStateResponse externalPerson) {
    if (externalPerson.dataOrigin() == DataOriginDto.EXTERNAL) {
      return createOrUpdateCentralFileState(referencePersonId, externalPerson);
    } else {
      if (referencePersonId != null) {
        throw new BadRequestException(
            "ReferencePersonId not allowed (person data origin is not EXTERNAL)");
      } else {
        return externalPerson.id();
      }
    }
  }

  private UUID createOrUpdateCentralFileState(
      UUID referencePersonId, GetPersonFileStateResponse externalPerson) {
    if (referencePersonId == null) {
      return personClient.createInternalReferencePerson(externalPerson);
    } else {
      return personClient.updatePersonAndCreateFileState(referencePersonId, externalPerson);
    }
  }

  private NewCertificateProcedure getNewCertificateProcedure(UUID procedureId) {
    InfectionBriefingProcedure procedure =
        repository
            .findByExternalId(procedureId)
            .orElseThrow(() -> new NotFoundException("Procedure not found"));
    if (procedure instanceof NewCertificateProcedure newCertificateProcedure) {
      return newCertificateProcedure;
    }
    throw new BadRequestException("Wrong procedure type");
  }

  private UUID getCertificateFileId(NewCertificateProcedure procedure) {
    return procedure.getProgressEntries().stream()
        .filter(SystemProgressEntry.class::isInstance)
        .map(SystemProgressEntry.class::cast)
        .filter(
            progressEntry ->
                InfectionBriefingProgressEntryType.CERTIFICATE_ISSUED
                    .name()
                    .equals(progressEntry.getSystemProgressEntryType()))
        .collect(StreamUtil.toSingleOptionalElement())
        .orElseThrow(
            () ->
                new BadRequestException(
                    "No SystemProgressEntry of type %s"
                        .formatted(InfectionBriefingProgressEntryType.CERTIFICATE_ISSUED)))
        .getFile()
        .getExternalId();
  }
}
