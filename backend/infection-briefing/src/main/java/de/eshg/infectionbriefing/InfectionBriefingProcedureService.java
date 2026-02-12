/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.util.PageUtil.toPageSpec;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.infectionbriefing.api.AcceptDraftRequest;
import de.eshg.infectionbriefing.api.GetProceduresResponse;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingPerson;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.infectionbriefing.domain.specification.InfectionBriefingProcedureSpecification;
import de.eshg.infectionbriefing.mapper.InfectionBriefingProcedureMapper;
import de.eshg.infectionbriefing.util.ProcedureValidator;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingProcedureService {

  private final InfectionBriefingProcedureRepository repository;
  private final InfectionBriefingProcedureMapper procedureMapper;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final PersonClient personClient;

  public InfectionBriefingProcedureService(
      InfectionBriefingProcedureRepository repository,
      InfectionBriefingProcedureMapper procedureMapper,
      Clock clock,
      AuditLogger auditLogger,
      PersonClient personClient) {
    this.repository = repository;
    this.procedureMapper = procedureMapper;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.personClient = personClient;
  }

  public GetProceduresResponse getProcedures(
      ProcedureFilterParameters filterParameters,
      ProcedurePaginationParameters paginationParameters) {

    Page<InfectionBriefingProcedure> proceduresPage =
        repository.findAll(getSpecification(filterParameters), toPageSpec(paginationParameters));
    return new GetProceduresResponse(
        proceduresPage.stream().map(procedureMapper::enrichAndMapToInterfaceType).toList(),
        proceduresPage.getTotalElements());
  }

  private InfectionBriefingProcedureSpecification getSpecification(
      ProcedureFilterParameters parameters) {
    return new InfectionBriefingProcedureSpecification(
        new ArrayList<>(
            List.of(ProcedureStatus.DRAFT, ProcedureStatus.OPEN, ProcedureStatus.IN_PROGRESS)),
        getStartOfDay(parameters.appointmentDay()));
  }

  private Instant getStartOfDay(LocalDate localDate) {
    if (localDate == null) {
      return null;
    } else {
      return localDate.atStartOfDay(clock.getZone()).toInstant();
    }
  }

  public void acceptDraft(UUID procedureId, Optional<AcceptDraftRequest> request) {
    InfectionBriefingProcedure procedure =
        new ProcedureValidator<>(getProcedure(procedureId))
            .validateStatus(ProcedureStatus.DRAFT)
            .get();
    InfectionBriefingPerson person =
        procedure.getRelatedPersons().stream().collect(StreamUtil.toSingleElement());
    UUID referencePersonId = request.map(AcceptDraftRequest::referencePersonId).orElse(null);
    if (referencePersonId == null) {
      person.setCentralFileStateId(
          personClient.createInternalReferencePerson(person.getCentralFileStateId()));
    } else {
      person.setCentralFileStateId(
          personClient.updatePersonAndCreateFileState(
              referencePersonId, person.getCentralFileStateId()));
    }
    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  public void abort(UUID procedureId) {
    new ProcedureValidator<>(getProcedure(procedureId))
        .validateStatus(ProcedureStatus.DRAFT)
        .get()
        .updateProcedureStatus(ProcedureStatus.ABORTED, clock, auditLogger);
  }

  public void close(UUID procedureId) {
    new ProcedureValidator<>(getProcedure(procedureId))
        .validateStatus(ProcedureStatus.OPEN)
        .get()
        .updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  public void reopen(UUID procedureId) {
    new ProcedureValidator<>(getProcedure(procedureId))
        .validateStatus(ProcedureStatus.CLOSED)
        .get()
        .updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  private InfectionBriefingProcedure getProcedure(UUID procedureId) {
    return repository
        .findByExternalId(procedureId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }
}
