/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure;

import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureDetailsDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureHeaderDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedureOverviewDto;
import de.eshg.officialmedicalservice.procedure.api.EmployeeOmsProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.procedure.api.EmployeePagedOmsProcedures;
import de.eshg.officialmedicalservice.procedure.api.PostEmployeeOmsProcedureRequest;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

  public EmployeeOmsProcedureService(
      OmsProcedureRepository omsProcedureRepository,
      OmsProcedureOverviewMapper omsProcedureOverviewMapper,
      PersonClient personClient) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsProcedureOverviewMapper = omsProcedureOverviewMapper;
    this.personClient = personClient;
  }

  @Transactional
  public UUID createEmployeeProcedure(PostEmployeeOmsProcedureRequest request) {
    if (request.affectedPerson().contactAddress() == null) {
      throw new BadRequestException(ErrorCode.BAD_REQUEST, "Contact address is required");
    }

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

    return new EmployeeOmsProcedureDetailsDto(
        omsProcedureAndAffectedPerson.omsProcedure.getExternalId(),
        ProcedureMapper.toInterfaceType(
            omsProcedureAndAffectedPerson.omsProcedure.getProcedureStatus()),
        omsProcedureAndAffectedPerson.affectedPerson);
  }

  @Transactional(readOnly = true)
  public EmployeePagedOmsProcedures getEmployeeProceduresOverview(
      EmployeeOmsProcedurePaginationAndSortParameters paginationAndSortParameters) {

    Page<OmsProcedure> omsProcedures =
        omsProcedureRepository.findAll(
            new EmployeeOmsProcedureSpecification(paginationAndSortParameters),
            EmployeeOmsProcedureSpecification.toPageSpec(paginationAndSortParameters));

    Map<UUID, GetPersonFileStateResponse> personMap = getPersonMap(omsProcedures.getContent());

    List<EmployeeOmsProcedureOverviewDto> omsProcedureOverviewDtos =
        omsProcedures.getContent().stream()
            .map(
                omsProcedure ->
                    omsProcedureOverviewMapper.toInterfaceType(
                        omsProcedure, getPersonForOmsProcedure(omsProcedure, personMap)))
            .toList();

    return new EmployeePagedOmsProcedures(
        omsProcedureOverviewDtos, omsProcedures.getTotalElements());
  }

  private OmsProcedureAndAffectedPerson getOmsProcedureAndAffectedPerson(UUID externalId) {
    OmsProcedure omsProcedure =
        omsProcedureRepository
            .findByExternalId(externalId)
            .orElseThrow(() -> new NotFoundException("Procedure not found"));

    GetPersonFileStateResponse personFileStateResponse =
        personClient.getPersonFileState(omsProcedure.findAffectedPerson().getCentralFileStateId());

    AffectedPersonDto affectedPerson = PersonMapper.mapToAffectedPersonDto(personFileStateResponse);

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

  private GetPersonFileStateResponse getPersonForOmsProcedure(
      OmsProcedure omsProcedure, Map<UUID, GetPersonFileStateResponse> personMap) {
    if (omsProcedure.findAffectedPerson() == null) {
      return null;
    }
    return personMap.get(omsProcedure.findAffectedPerson().getCentralFileStateId());
  }

  private record OmsProcedureAndAffectedPerson(
      OmsProcedure omsProcedure, AffectedPersonDto affectedPerson) {}
}
