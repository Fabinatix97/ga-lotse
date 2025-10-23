/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.waitingroom;

import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.DATE_OF_BIRTH;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.FACILITY;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.FIRSTNAME;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.LASTNAME;
import static de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.PHYSICIAN;
import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsLast;

import de.eshg.api.commons.SortDirection;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.base.centralfile.api.person.GetPersonsSortKey;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.procedures.ProcedureQuery;
import de.eshg.officialmedicalservice.facility.FacilityClient;
import de.eshg.officialmedicalservice.facility.FacilityMapper;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.api.FacilityDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.user.UserClient;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomDto;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomProcedureDto;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomProcedurePaginationAndSortParameters;
import de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingRoom;
import de.eshg.officialmedicalservice.waitingroom.util.WaitingRoomPageSpec;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
public class WaitingRoomService {
  private final OmsProcedureRepository procedureRepository;
  private final PersonClient personClient;
  private final FacilityClient facilityClient;
  private final ProcedureQuery procedureQuery;
  private final OmsProcedureRepository omsProcedureRepository;
  private final UserClient userClient;

  public WaitingRoomService(
      OmsProcedureRepository procedureRepository,
      PersonClient personClient,
      FacilityClient facilityClient,
      ProcedureQuery procedureQuery,
      OmsProcedureRepository omsProcedureRepository,
      UserClient userClient) {
    this.procedureRepository = procedureRepository;
    this.personClient = personClient;
    this.facilityClient = facilityClient;
    this.procedureQuery = procedureQuery;
    this.omsProcedureRepository = omsProcedureRepository;
    this.userClient = userClient;
  }

  @Transactional(readOnly = true)
  public PagedWaitingRoomProcedures getWaitingRoomProcedures(
      WaitingRoomProcedurePaginationAndSortParameters paginationAndSortParameters) {

    WaitingRoomPageSpec pageSpec =
        WaitingRoomMapper.mapToPageSpec(
            paginationAndSortParameters.pageNumberOrFallback(0),
            paginationAndSortParameters.pageSizeOrFallback(25),
            paginationAndSortParameters.sortKeyOrFallback(
                de.eshg.officialmedicalservice.waitingroom.api.WaitingRoomSortKey.ID),
            paginationAndSortParameters.sortDirectionOrFallback(SortDirection.DESC));

    WaitingRoomSpecification waitingRoomSpecification =
        new WaitingRoomSpecification(pageSpec.sortKey(), pageSpec.direction());

    if (List.of(FIRSTNAME, LASTNAME, DATE_OF_BIRTH).contains(pageSpec.sortKey())) {
      return getSortingForPersonAttributes(pageSpec, waitingRoomSpecification);
    }

    if (Objects.equals(PHYSICIAN, pageSpec.sortKey())) {
      return getSortingForPhysicianAttribute(pageSpec);
    }

    if (Objects.equals(FACILITY, pageSpec.sortKey())) {
      return getSortingForFacilityAttribute(pageSpec, waitingRoomSpecification);
    }

    Page<OmsProcedure> omsProcedures =
        procedureRepository.findAll(
            waitingRoomSpecification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
    List<WaitingRoomProcedureDto> procedureData =
        augmentWithWaitingRoomData(omsProcedures.getContent()).toList();

    return new PagedWaitingRoomProcedures(procedureData, omsProcedures.getTotalElements());
  }

  @Transactional
  public void updateWaitingRoom(UUID externalId, WaitingRoomDto request) {
    OmsProcedure omsProcedure = loadOmsProcedure(externalId);

    if (Objects.equals(ProcedureStatus.DRAFT, omsProcedure.getProcedureStatus())) {
      throw new BadRequestException(
          "Waiting room cannot be updated when the procedure is in DRAFT status.");
    }

    if (omsProcedure.isFinalized()) {
      throw new BadRequestException(
          "Waiting room cannot be updated when the procedure is finalized.");
    }

    WaitingRoom waitingRoom = omsProcedure.getWaitingRoom();
    waitingRoom.setInfo(request.info());
    waitingRoom.setStatus(WaitingRoomMapper.mapStatusFromDto(request.status()));
  }

  private PagedWaitingRoomProcedures getSortingForPersonAttributes(
      WaitingRoomPageSpec pageSpec, WaitingRoomSpecification waitingRoomSpecification) {
    List<UUID> personIds =
        procedureQuery.findAllRelatedPersonFileStateIds(
            waitingRoomSpecification, OmsProcedure.class, PersonType.PATIENT);

    List<UUID> pagedAndSortedPersonIds =
        fetchPersonsBulk(
                personIds,
                mapToGetPersonsSortKey(pageSpec.sortKey()),
                pageSpec.direction(),
                pageSpec.pageNumber(),
                pageSpec.pageSize())
            .stream()
            .map(GetPersonFileStateResponse::id)
            .toList();

    List<OmsProcedure> result =
        omsProcedureRepository
            .findByRelatedPersons(pagedAndSortedPersonIds)
            .sorted(
                Comparator.comparingInt(
                    procedure -> {
                      int index =
                          pagedAndSortedPersonIds.indexOf(
                              procedure.findAffectedPerson().getCentralFileStateId());
                      Assert.isTrue(index >= 0, "Unexpected index: " + index);
                      return index;
                    }))
            .toList();

    List<WaitingRoomProcedureDto> procedureData = augmentWithWaitingRoomData(result).toList();
    return new PagedWaitingRoomProcedures(procedureData, personIds.size());
  }

  private PagedWaitingRoomProcedures getSortingForPhysicianAttribute(WaitingRoomPageSpec pageSpec) {
    List<UUID> physicianIds = omsProcedureRepository.findDistinctPhysicianIds();

    List<UUID> pagedAndSortedPhysicianIds =
        fetchPhysiciansBulk(
            physicianIds, pageSpec.direction(), pageSpec.pageNumber(), pageSpec.pageSize());

    List<OmsProcedure> result =
        omsProcedureRepository
            .findAllByWaitingRoomStatusInWaitingOrInConsultation()
            .sorted(
                Comparator.comparing(
                    procedure -> {
                      if (procedure.getPhysicianId() == null) {
                        return null;
                      }
                      int index = pagedAndSortedPhysicianIds.indexOf(procedure.getPhysicianId());
                      Assert.isTrue(index >= 0, "Unexpected index: " + index);
                      return index;
                    },
                    nullsLast(naturalOrder())))
            .toList();

    List<WaitingRoomProcedureDto> procedureData = augmentWithWaitingRoomData(result).toList();
    return new PagedWaitingRoomProcedures(procedureData, result.size());
  }

  private PagedWaitingRoomProcedures getSortingForFacilityAttribute(
      WaitingRoomPageSpec pageSpec, WaitingRoomSpecification waitingRoomSpecification) {
    List<UUID> facilityIds =
        procedureQuery.findAllRelatedFacilityFileStateIds(
            waitingRoomSpecification, OmsProcedure.class, FacilityType.OTHER);

    List<UUID> pagedAndSortedFacilityIds =
        fetchFacilitiesBulk(
                facilityIds, pageSpec.direction(), pageSpec.pageNumber(), pageSpec.pageSize())
            .stream()
            .map(GetFacilityFileStateResponse::id)
            .toList();

    List<OmsProcedure> result =
        omsProcedureRepository
            .findByRelatedFacility(pagedAndSortedFacilityIds)
            .sorted(
                Comparator.comparingInt(
                    procedure -> {
                      int index =
                          pagedAndSortedFacilityIds.indexOf(
                              procedure.getFacility().orElseThrow().getCentralFileStateId());
                      Assert.isTrue(index >= 0, "Unexpected index: " + index);
                      return index;
                    }))
            .toList();

    List<WaitingRoomProcedureDto> procedureData = augmentWithWaitingRoomData(result).toList();
    return new PagedWaitingRoomProcedures(procedureData, facilityIds.size());
  }

  private Stream<WaitingRoomProcedureDto> augmentWithWaitingRoomData(
      List<OmsProcedure> procedures) {
    Map<UUID, String> physicianNamesMap = userClient.getPhysicianNamesMap();
    return procedures.stream()
        .map(
            data -> {
              AffectedPersonDto affectedPerson =
                  PersonMapper.mapToAffectedPersonDto(
                      personClient.getPersonFileState(
                          data.findAffectedPerson().getCentralFileStateId()),
                      data.findAffectedPerson().getVersion());
              FacilityDto facility =
                  FacilityMapper.mapToFacilityDto(
                      facilityClient.getFacilityFileState(
                          data.getFacility().orElseThrow().getCentralFileStateId()),
                      data.findAffectedPerson().getVersion());

              return new WaitingRoomProcedureDto(
                  data.getExternalId(),
                  affectedPerson.firstName(),
                  affectedPerson.lastName(),
                  affectedPerson.dateOfBirth(),
                  facility.name(),
                  physicianNamesMap.get(data.getPhysicianId()),
                  WaitingRoomMapper.mapToDto(data.getWaitingRoom()),
                  data.getWaitingRoom().getModifiedAt());
            });
  }

  private OmsProcedure loadOmsProcedure(UUID externalId) {
    return procedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private List<GetPersonFileStateResponse> fetchPersonsBulk(
      List<UUID> personIdsToFetch,
      GetPersonsSortKey sortKey,
      SortDirection direction,
      Integer pageNumber,
      Integer pageSize) {
    if (personIdsToFetch.isEmpty()) {
      return List.of();
    }
    GetPersonFileStatesSortParameters sortParameters =
        mapToSortParameters(sortKey, direction, pageNumber, pageSize);

    GetPersonFileStatesResponse response =
        personClient.getPersonFileStates(
            new GetPersonFileStatesRequest(personIdsToFetch, sortParameters));

    int expectedResponseSize =
        sortParameters == null
            ? personIdsToFetch.size()
            : Math.min(pageSize, personIdsToFetch.size() - (pageNumber * pageSize));
    if (response.personFileStates().size() < expectedResponseSize) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates();
  }

  private List<GetFacilityFileStateResponse> fetchFacilitiesBulk(
      List<UUID> facilityIdsToFetch,
      SortDirection direction,
      Integer pageNumber,
      Integer pageSize) {
    if (facilityIdsToFetch.isEmpty()) {
      return List.of();
    }

    List<GetFacilityFileStateResponse> facilities =
        facilityClient
            .getFacilityFileStates(new GetFacilityFileStatesRequest(facilityIdsToFetch))
            .facilityFileStates();

    Comparator<GetFacilityFileStateResponse> comparator =
        comparing(GetFacilityFileStateResponse::name);

    if (direction == SortDirection.DESC) {
      comparator = comparator.reversed();
    }

    facilities = facilities.stream().sorted(comparator).toList();

    int start = pageNumber * pageSize;
    int end = Math.min(start + pageSize, facilities.size());

    if (start > facilities.size()) {
      return List.of();
    }

    return facilities.subList(start, end);
  }

  private List<UUID> fetchPhysiciansBulk(
      List<UUID> physicianIdsToFetch,
      SortDirection direction,
      Integer pageNumber,
      Integer pageSize) {

    if (physicianIdsToFetch.isEmpty()) {
      return List.of();
    }

    Map<UUID, String> physicianNamesMap = userClient.getPhysicianNamesMap();

    List<Map.Entry<UUID, String>> physicians =
        physicianNamesMap.entrySet().stream()
            .filter(entry -> physicianIdsToFetch.contains(entry.getKey()))
            .toList();

    Comparator<Map.Entry<UUID, String>> comparator = comparing(Map.Entry::getValue);

    if (direction == SortDirection.DESC) {
      comparator = comparator.reversed();
    }

    physicians = physicians.stream().sorted(comparator).toList();

    int start = pageNumber * pageSize;
    int end = Math.min(start + pageSize, physicians.size());

    if (start > physicians.size()) {
      return List.of();
    }

    return physicians.subList(start, end).stream().map(Map.Entry::getKey).toList();
  }

  private GetPersonFileStatesSortParameters mapToSortParameters(
      GetPersonsSortKey sortKey, SortDirection direction, Integer pageNumber, Integer pageSize) {
    if (sortKey == null) {
      return null;
    }
    return new GetPersonFileStatesSortParameters(sortKey, direction, pageNumber, pageSize);
  }

  private static GetPersonsSortKey mapToGetPersonsSortKey(WaitingRoomSortKey sortKey) {
    return switch (sortKey) {
      case DATE_OF_BIRTH -> GetPersonsSortKey.DATE_OF_BIRTH;
      case FIRSTNAME -> GetPersonsSortKey.FIRST_NAME;
      case LASTNAME -> GetPersonsSortKey.LAST_NAME;
      case ID, INFO, STATUS, MODIFIED_AT, PHYSICIAN, FACILITY ->
          throw new IllegalArgumentException("Unexpected sort key: " + sortKey);
    };
  }
}
