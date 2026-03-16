/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.ApplicantCategoryMapper.toInterfaceType;
import static de.eshg.infectionbriefing.mapper.PersonDetailsMapper.mapToPersonDetailsDto;
import static de.eshg.infectionbriefing.mapper.ProcedureSearchParametersMapper.mapToProcedureApiType;
import static de.eshg.infectionbriefing.util.PageUtil.toPageSpec;
import static de.eshg.infectionbriefing.util.ProcedureUtil.getFieldOrNull;
import static de.eshg.lib.procedure.util.ProcedureValidator.hasNonNullValue;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.infectionbriefing.api.GetInfectionBriefingProceduresResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingProcedureDetailsDto;
import de.eshg.infectionbriefing.api.ProcedureFilterParameters;
import de.eshg.infectionbriefing.api.ProcedurePaginationParameters;
import de.eshg.infectionbriefing.api.ProcedureSearchParameters;
import de.eshg.infectionbriefing.api.ProcedureSourceDto;
import de.eshg.infectionbriefing.api.UpdateApplicantRequest;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingPerson;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure_;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.infectionbriefing.domain.specification.InfectionBriefingProcedureSpecification;
import de.eshg.infectionbriefing.mapper.InfectionBriefingProcedureMapper;
import de.eshg.infectionbriefing.mapper.InstructionTypeMapper;
import de.eshg.infectionbriefing.util.InfectionBriefingProgressEntryType;
import de.eshg.infectionbriefing.util.InfectionBriefingSystemProgressEntryFactory;
import de.eshg.infectionbriefing.util.ProcedureValidator;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.procedures.ProcedureSearchService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingProcedureService {

  private final InfectionBriefingProcedureRepository repository;
  private final ProcedureSearchService<InfectionBriefingProcedure> procedureSearchService;
  private final ProcedureStatusUpdater procedureStatusUpdater;
  private final Clock clock;
  private final PersonClient personClient;
  private final CustodianConsentHelper custodianConsentHelper;

  public InfectionBriefingProcedureService(
      InfectionBriefingProcedureRepository repository,
      ProcedureSearchService<InfectionBriefingProcedure> procedureSearchService,
      ProcedureStatusUpdater procedureStatusUpdater,
      Clock clock,
      PersonClient personClient,
      CustodianConsentHelper custodianConsentHelper) {
    this.repository = repository;
    this.procedureSearchService = procedureSearchService;
    this.procedureStatusUpdater = procedureStatusUpdater;
    this.clock = clock;
    this.personClient = personClient;
    this.custodianConsentHelper = custodianConsentHelper;
  }

  public GetInfectionBriefingProceduresResponse getProcedures(
      ProcedureFilterParameters filterParameters,
      ProcedurePaginationParameters paginationParameters,
      ProcedureSearchParameters searchParameters) {

    Page<InfectionBriefingProcedure> proceduresPage =
        repository.findAll(
            getSpecification(filterParameters, searchParameters),
            toPageSpec(paginationParameters)
                .withSort(
                    Sort.by(Direction.DESC, InfectionBriefingProcedure_.CREATED_AT)
                        .and(Sort.by(Direction.ASC, InfectionBriefingProcedure_.ID))));

    Map<UUID, GetPersonFileStateResponse> applicantDirectory =
        getApplicantDirectory(proceduresPage);

    return new GetInfectionBriefingProceduresResponse(
        proceduresPage.stream()
            .map(
                procedure ->
                    InfectionBriefingProcedureMapper.enrichAndMapToInterfaceType(
                        procedure, applicantDirectory))
            .toList(),
        proceduresPage.getTotalElements());
  }

  public InfectionBriefingProcedureDetailsDto getProcedureDetails(UUID procedureId) {
    InfectionBriefingProcedure procedure = getProcedure(procedureId);
    GetPersonFileStateResponse applicant =
        personClient.getPersonFileState(procedure.getApplicant().getCentralFileStateId());
    return new InfectionBriefingProcedureDetailsDto(
        procedure.getExternalId(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        ProcedureMapper.toInterfaceType(procedure.getProcedureType()),
        mapToPersonDetailsDto(applicant, procedure.getApplicant().getVersion()),
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

  private Specification<InfectionBriefingProcedure> getSpecification(
      ProcedureFilterParameters filterParameters, ProcedureSearchParameters searchParameters) {
    if (hasNonNullValue(searchParameters)) {
      List<Long> searchResult =
          procedureSearchService
              .searchProceduresByPerson(
                  mapToProcedureApiType(searchParameters), PersonType.PROFESSIONAL)
              .stream()
              .map(SequencedBaseEntity::getId)
              .toList();
      return getSpecification(filterParameters)
          .and(((root, _, _) -> root.get(InfectionBriefingProcedure_.id).in(searchResult)));
    } else {
      return getSpecification(filterParameters);
    }
  }

  private Specification<InfectionBriefingProcedure> getSpecification(
      ProcedureFilterParameters parameters) {
    return new InfectionBriefingProcedureSpecification(
        getStartOfDay(parameters.appointmentDay()),
        InstructionTypeMapper.toDomainType(parameters.instructionType()),
        parameters.instructionYear(),
        InfectionBriefingProcedureMapper.toDomainType(parameters.status()));
  }

  private Map<UUID, GetPersonFileStateResponse> getApplicantDirectory(
      Page<InfectionBriefingProcedure> proceduresPage) {
    List<UUID> centralFileStateIds =
        proceduresPage.stream()
            .map(InfectionBriefingProcedure::getApplicant)
            .map(RelatedPerson::getCentralFileStateId)
            .toList();
    if (centralFileStateIds.isEmpty()) {
      return Collections.emptyMap();
    }
    return personClient.getPersonFileStates(centralFileStateIds).stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private Instant getStartOfDay(LocalDate localDate) {
    if (localDate == null) {
      return null;
    } else {
      return localDate.atStartOfDay(clock.getZone()).toInstant();
    }
  }

  public void close(UUID procedureId) {
    procedureStatusUpdater.close(getProcedure(procedureId));
  }

  public void reopen(UUID procedureId) {
    procedureStatusUpdater.reopen(getProcedure(procedureId));
  }

  public void updateApplicant(UUID procedureId, UpdateApplicantRequest request) {
    InfectionBriefingProcedure procedure =
        new ProcedureValidator<>(getProcedure(procedureId))
            .validateStatus(ProcedureStatus.DRAFT, ProcedureStatus.OPEN)
            .get();
    validateVersion(request, procedure.getApplicant());
    UUID currentFileState = procedure.getApplicant().getCentralFileStateId();
    UUID updatedFileState = personClient.updatePersonInCentralFile(currentFileState, request);
    if (!updatedFileState.equals(currentFileState)) {
      procedure.getApplicant().setCentralFileStateId(updatedFileState);
      procedure.addProgressEntry(applicantModifiedProgressEntry(currentFileState));
    }
  }

  private void validateVersion(
      UpdateApplicantRequest request, InfectionBriefingPerson persistentApplicant) {
    if (request.version() != persistentApplicant.getVersion()) {
      throw new BadRequestException("Version does not match");
    }
  }

  private SystemProgressEntry applicantModifiedProgressEntry(UUID previousPersonFileState) {
    SystemProgressEntry systemProgressEntry =
        InfectionBriefingSystemProgressEntryFactory.createEmployeeTriggeredSystemProgressEntry(
            InfectionBriefingProgressEntryType.APPLICANT_MODIFIED);
    systemProgressEntry.setPreviousPersonFileStateId(previousPersonFileState);
    return systemProgressEntry;
  }

  private InfectionBriefingProcedure getProcedure(UUID procedureId) {
    return repository
        .findByExternalId(procedureId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }
}
