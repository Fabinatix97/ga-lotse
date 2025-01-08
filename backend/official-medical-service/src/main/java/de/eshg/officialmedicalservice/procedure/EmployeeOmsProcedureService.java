/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.officialmedicalservice.facility.FacilityClient;
import de.eshg.officialmedicalservice.facility.FacilityMapper;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureDetailsDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureHeaderDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureOverviewDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeePagedOmsProcedures;
import de.eshg.officialmedicalservice.procedure.api.FacilityDto;
import de.eshg.officialmedicalservice.procedure.api.PatchAffectedPersonRequest;
import de.eshg.officialmedicalservice.procedure.api.PatchEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Facility;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeOmsProcedureService {
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsProcedureOverviewMapper omsProcedureOverviewMapper;
  private final PersonClient personClient;
  private final FacilityClient facilityClient;
  private final Clock clock;
  private final AuditLogger auditLogger;

  public EmployeeOmsProcedureService(
      OmsProcedureRepository omsProcedureRepository,
      OmsProcedureOverviewMapper omsProcedureOverviewMapper,
      PersonClient personClient,
      FacilityClient facilityClient,
      Clock clock,
      AuditLogger auditLogger) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsProcedureOverviewMapper = omsProcedureOverviewMapper;
    this.personClient = personClient;
    this.facilityClient = facilityClient;
    this.clock = clock;
    this.auditLogger = auditLogger;
  }

  @Transactional
  public UUID createEmployeeProcedure(PostEmployeeOmsProcedureRequest request) {
    AddPersonFileStateResponse affectedPersonBaseResponse =
        personClient.addPersonFileState(
            PersonMapper.mapToAddPersonFileStateRequest(request.affectedPerson()));

    OmsProcedure procedure =
        omsProcedureOverviewMapper.toDomainType(
            request, CurrentUserHelper.getCurrentUserId(), affectedPersonBaseResponse);

    omsProcedureRepository.save(procedure);

    return procedure.getExternalId();
  }

  @Transactional(readOnly = true)
  public EmployeeOmsProcedureHeaderDto getEmployeeProcedureHeader(UUID externalId) {
    OmsProcedureAndAffectedPerson omsProcedureAndAffectedPerson =
        getOmsProcedureAndAffectedPerson(externalId);

    return new EmployeeOmsProcedureHeaderDto(
        omsProcedureAndAffectedPerson.omsProcedure.getExternalId(),
        ProcedureMapper.toInterfaceType(
            omsProcedureAndAffectedPerson.omsProcedure.getProcedureStatus()),
        omsProcedureAndAffectedPerson.affectedPerson.firstName(),
        omsProcedureAndAffectedPerson.affectedPerson.lastName(),
        omsProcedureAndAffectedPerson.affectedPerson.dateOfBirth());
  }

  @Transactional(readOnly = true)
  public EmployeeOmsProcedureDetailsDto getEmployeeProcedureDetails(UUID externalId) {
    OmsProcedureAndAffectedPerson omsProcedureAndAffectedPerson =
        getOmsProcedureAndAffectedPerson(externalId);

    FacilityDto facility = null;
    Optional<Facility> optionalFacility = omsProcedureAndAffectedPerson.omsProcedure.getFacility();
    if (optionalFacility.isPresent()) {
      Facility facilityFromCentralFile = optionalFacility.get();
      GetFacilityFileStateResponse facilityFileState =
          facilityClient.getFacilityFileState(facilityFromCentralFile.getCentralFileStateId());
      facility =
          FacilityMapper.mapToFacilityDto(facilityFileState, facilityFromCentralFile.getVersion());
    }

    return new EmployeeOmsProcedureDetailsDto(
        omsProcedureAndAffectedPerson.omsProcedure.getExternalId(),
        ProcedureMapper.toInterfaceType(
            omsProcedureAndAffectedPerson.omsProcedure.getProcedureStatus()),
        omsProcedureAndAffectedPerson.affectedPerson,
        facility);
  }

  @Transactional(readOnly = true)
  public EmployeePagedOmsProcedures getEmployeeProceduresOverview(
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters) {

    Page<OmsProcedure> omsProcedures =
        omsProcedureRepository.findAll(
            new EmployeeOmsProcedureSpecification(paginationAndSortParameters),
            EmployeeOmsProcedureSpecification.toPageSpec(paginationAndSortParameters));

    Map<UUID, GetPersonFileStateResponse> personMap = getPersonMap(omsProcedures.getContent());
    Map<UUID, AddFacilityFileStateResponse> facilityMap =
        getFacilityMap(omsProcedures.getContent());

    List<EmployeeOmsProcedureOverviewDto> omsProcedureOverviewDtos =
        omsProcedures.getContent().stream()
            .map(
                omsProcedure ->
                    omsProcedureOverviewMapper.toInterfaceType(
                        omsProcedure,
                        getPersonForOmsProcedure(omsProcedure, personMap),
                        getFacilityForOmsProcedure(omsProcedure, facilityMap)))
            .toList();

    return new EmployeePagedOmsProcedures(
        omsProcedureOverviewDtos, omsProcedures.getTotalElements());
  }

  @Transactional
  public void updateAffectedPerson(
      UUID externalId, PatchAffectedPersonRequest patchAffectedPersonRequest) {
    OmsProcedure omsProcedure = loadOmsProcedureForUpdate(externalId);

    Person person = omsProcedure.findAffectedPerson();

    ValidationUtil.validateVersion(patchAffectedPersonRequest.affectedPerson().version(), person);

    AddPersonFileStateResponse baseResponse;
    try {
      baseResponse =
          personClient.updatePersonFileStateAndReference(
              person.getCentralFileStateId(),
              PersonMapper.mapToUpdatePersonRequest(patchAffectedPersonRequest.affectedPerson()));
    } catch (BadRequestException e) {
      if (!"Matching reference Person already exists".equals(e.getMessage())) {
        throw e;
      }
      baseResponse =
          personClient.addPersonFileState(
              PersonMapper.mapToAddPersonFileStateRequest(
                  patchAffectedPersonRequest.affectedPerson()));
    }

    person.setCentralFileStateId(baseResponse.id());
  }

  @Transactional
  public UUID addFacility(UUID externalId, PostEmployeeOmsProcedureFacilityRequest request) {
    OmsProcedure procedure = loadOmsProcedure(externalId);

    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException("Facility con only be added in DRAFT status");
    }
    if (procedure.getFacility().isPresent()) {
      throw new BadRequestException("Procedure already has a facility");
    }
    AddFacilityFileStateResponse facilityFileState =
        facilityClient.addFacilityFileState(
            FacilityMapper.mapToAddFacilityFileStateRequest(request.facility()));

    Facility facility = new Facility();
    facility.setCentralFileStateId(facilityFileState.id());
    facility.setFacilityType(FacilityType.OTHER);
    procedure.addRelatedFacility(facility);

    return facilityFileState.id();
  }

  @Transactional
  public void updateFacility(UUID externalId, PatchEmployeeOmsProcedureFacilityRequest request) {
    OmsProcedure procedure = loadOmsProcedureForUpdate(externalId);

    if (procedure.getProcedureStatus() == ProcedureStatus.CLOSED) {
      throw new BadRequestException("Facility can not be edited in CLOSED status");
    }
    Optional<Facility> optionalFacility = procedure.getFacility();
    if (optionalFacility.isEmpty()) {
      throw new BadRequestException("Procedure doesn't have a facility");
    }
    Facility facility = optionalFacility.get();
    ValidationUtil.validateVersion(request.updatedFacility().version(), facility);

    AddFacilityFileStateResponse baseResponse;
    try {
      baseResponse =
          facilityClient.updateFacilityFileStateAndReference(
              facility.getCentralFileStateId(),
              FacilityMapper.mapToPutFacilityRequest(request.updatedFacility()));
    } catch (BadRequestException e) {
      if (!"Matching reference facility already exists".equals(e.getMessage())) {
        throw e;
      }
      baseResponse =
          facilityClient.addFacilityFileState(
              FacilityMapper.mapToAddFacilityFileStateRequest(request.updatedFacility()));
    }

    facility.setCentralFileStateId(baseResponse.id());
  }

  @Transactional
  public void startProcedure(UUID externalId) {
    OmsProcedure procedure = loadOmsProcedure(externalId);

    if (procedure.getProcedureStatus() == ProcedureStatus.OPEN) {
      throw new BadRequestException("Procedure already started");
    }

    procedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);
  }

  @Transactional
  public void closeProcedure(UUID externalId) {
    OmsProcedure procedure = loadOmsProcedure(externalId);

    if (procedure.getProcedureStatus() == ProcedureStatus.CLOSED) {
      throw new BadRequestException("Procedure already closed");
    }

    procedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
  }

  private OmsProcedure loadOmsProcedure(UUID externalId) {
    return omsProcedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private OmsProcedure loadOmsProcedureForUpdate(UUID externalId) {
    return omsProcedureRepository
        .findByExternalIdForUpdate(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private OmsProcedureAndAffectedPerson getOmsProcedureAndAffectedPerson(UUID externalId) {
    OmsProcedure omsProcedure = loadOmsProcedure(externalId);

    Person person = omsProcedure.findAffectedPerson();

    GetPersonFileStateResponse personFileStateResponse =
        personClient.getPersonFileState(person.getCentralFileStateId());

    AffectedPersonDto affectedPerson =
        PersonMapper.mapToAffectedPersonDto(personFileStateResponse, person.getVersion());

    return new OmsProcedureAndAffectedPerson(omsProcedure, affectedPerson);
  }

  private Map<UUID, GetPersonFileStateResponse> getPersonMap(List<OmsProcedure> omsProcedures) {
    List<UUID> centralFileStateIds =
        omsProcedures.stream()
            .map(OmsProcedure::findAffectedPerson)
            .map(RelatedPerson::getCentralFileStateId)
            .distinct()
            .toList();

    if (centralFileStateIds.isEmpty()) {
      return Collections.emptyMap();
    }

    GetPersonFileStatesResponse personFileStatesResponse =
        personClient.getPersonFileStates(
            new GetPersonFileStatesRequest(
                omsProcedures.stream()
                    .map(OmsProcedure::findAffectedPerson)
                    .filter(Objects::nonNull)
                    .map(RelatedPerson::getCentralFileStateId)
                    .distinct()
                    .toList()));

    return personFileStatesResponse.personFileStates().stream()
        .collect(Collectors.toMap(GetPersonFileStateResponse::id, person -> person));
  }

  private Map<UUID, AddFacilityFileStateResponse> getFacilityMap(List<OmsProcedure> omsProcedures) {
    List<UUID> centralFileStateIds =
        omsProcedures.stream()
            .map(OmsProcedure::getFacility)
            .flatMap(Optional::stream)
            .map(Facility::getCentralFileStateId)
            .distinct()
            .toList();

    if (centralFileStateIds.isEmpty()) {
      return Collections.emptyMap();
    }

    GetFacilityFileStatesResponse facilityFileStatesResponse =
        facilityClient.getFacilityFileStates(new GetFacilityFileStatesRequest(centralFileStateIds));

    return facilityFileStatesResponse.facilityFileStates().stream()
        .collect(Collectors.toMap(AddFacilityFileStateResponse::id, facility -> facility));
  }

  private GetPersonFileStateResponse getPersonForOmsProcedure(
      OmsProcedure omsProcedure, Map<UUID, GetPersonFileStateResponse> personMap) {
    if (omsProcedure.findAffectedPerson() == null) {
      return null;
    }
    return personMap.get(omsProcedure.findAffectedPerson().getCentralFileStateId());
  }

  private AddFacilityFileStateResponse getFacilityForOmsProcedure(
      OmsProcedure omsProcedure, Map<UUID, AddFacilityFileStateResponse> facilityMap) {
    return omsProcedure
        .getFacility()
        .map(facility -> facilityMap.get(facility.getCentralFileStateId()))
        .orElse(null);
  }

  private record OmsProcedureAndAffectedPerson(
      OmsProcedure omsProcedure, AffectedPersonDto affectedPerson) {}
}
