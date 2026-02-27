/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.ApplicantCategoryMapper.toInterfaceType;
import static de.eshg.infectionbriefing.mapper.PersonDetailsMapper.mapToPersonDetailsDto;
import static de.eshg.infectionbriefing.util.PageUtil.toPageSpec;
import static de.eshg.infectionbriefing.util.ProcedureUtil.getFieldOrNull;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.api.GetProceduresResponse;
import de.eshg.infectionbriefing.api.ProcedureDetailsDto;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.infectionbriefing.api.ProcedureSourceDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.infectionbriefing.domain.specification.InfectionBriefingProcedureSpecification;
import de.eshg.infectionbriefing.mapper.InfectionBriefingProcedureMapper;
import de.eshg.infectionbriefing.mapper.InstructionTypeMapper;
import de.eshg.infectionbriefing.util.ProcedureValidator;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
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
  private final CustodianConsentHelper custodianConsentHelper;

  public InfectionBriefingProcedureService(
      InfectionBriefingProcedureRepository repository,
      InfectionBriefingProcedureMapper procedureMapper,
      Clock clock,
      AuditLogger auditLogger,
      PersonClient personClient,
      CustodianConsentHelper custodianConsentHelper) {
    this.repository = repository;
    this.procedureMapper = procedureMapper;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.personClient = personClient;
    this.custodianConsentHelper = custodianConsentHelper;
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

  public ProcedureDetailsDto getProcedureDetails(UUID procedureId) {
    InfectionBriefingProcedure procedure = getProcedure(procedureId);
    GetPersonFileStateResponse applicant =
        personClient.getPersonFileState(
            procedure.getRelatedPersons().stream()
                .map(RelatedPerson::getCentralFileStateId)
                .collect(StreamUtil.toSingleElement()));
    return new ProcedureDetailsDto(
        procedure.getExternalId(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        ProcedureMapper.toInterfaceType(procedure.getProcedureType()),
        mapToPersonDetailsDto(applicant),
        custodianConsentHelper.getCustodianConsent(procedure, applicant.dateOfBirth()),
        Optional.ofNullable(procedure.getAppointment())
            .map(Appointment::getAppointmentStart)
            .orElse(null),
        toInterfaceType(getFieldOrNull(procedure, NewCertificateProcedure::getApplicantCategory)),
        getFieldOrNull(procedure, NewCertificateProcedure::getInstructionDate),
        InstructionTypeMapper.toInterfaceType(
            getFieldOrNull(procedure, NewCertificateProcedure::getInstructionType)),
        ProcedureSourceDto.STAFF_PORTAL);
  }

  private InfectionBriefingProcedureSpecification getSpecification(
      ProcedureFilterParameters parameters) {
    return new InfectionBriefingProcedureSpecification(
        new ArrayList<>(
            List.of(ProcedureStatus.DRAFT, ProcedureStatus.OPEN, ProcedureStatus.IN_PROGRESS)),
        getStartOfDay(parameters.appointmentDay()),
        InstructionTypeMapper.toDomainType(parameters.instructionType()));
  }

  private Instant getStartOfDay(LocalDate localDate) {
    if (localDate == null) {
      return null;
    } else {
      return localDate.atStartOfDay(clock.getZone()).toInstant();
    }
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
