/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.infectionbriefing.api.IssueCertificateResponse;
import de.eshg.infectionbriefing.document.CertificateGenerator;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.infectionbriefing.util.InfectionBriefingKeyDocumentType;
import de.eshg.infectionbriefing.util.InfectionBriefingProgressEntryType;
import de.eshg.infectionbriefing.util.InfectionBriefingSystemProgressEntryFactory;
import de.eshg.infectionbriefing.util.ProcedureValidator;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class NewCertificateProcedureService {

  private final ProgressEntryService<InfectionBriefingProcedure> progressEntryService;
  private final CertificateGenerator certificateGenerator;
  private final PersonClient personClient;
  private final InfectionBriefingProcedureRepository repository;
  private final Clock clock;

  public NewCertificateProcedureService(
      ProgressEntryService<InfectionBriefingProcedure> progressEntryService,
      CertificateGenerator certificateGenerator,
      PersonClient personClient,
      InfectionBriefingProcedureRepository repository,
      Clock clock) {
    this.progressEntryService = progressEntryService;
    this.certificateGenerator = certificateGenerator;
    this.personClient = personClient;
    this.repository = repository;
    this.clock = clock;
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

  public void confirmPayment(UUID procedureId) {
    NewCertificateProcedure procedure =
        new ProcedureValidator<>(getNewCertificateProcedure(procedureId))
            .validateStatus(ProcedureStatus.OPEN)
            .validateNoSystemProgressEntryWithType(InfectionBriefingProgressEntryType.FEE_PAYED)
            .validateHasSystemProgressEntryType(
                InfectionBriefingProgressEntryType.BRIEFING_CONFIRMED)
            .get();
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
                        procedure.getRelatedPersons().stream()
                            .map(RelatedPerson::getCentralFileStateId)
                            .collect(StreamUtil.toSingleElement())),
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
