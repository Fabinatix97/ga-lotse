/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import com.google.common.collect.Sets;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.ProphylaxisSessionRequest;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.api.UpdateExaminationsInBulkRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionExaminationsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionParticipantsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionRequest;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.dental.mapper.ProphylaxisSessionMapper;
import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class ProphylaxisSessionService {

  private static final Logger log = LoggerFactory.getLogger(ProphylaxisSessionService.class);

  private final ProphylaxisSessionRepository prophylaxisSessionRepository;
  private final ContactClient contactClient;
  private final ChildRepository childRepository;
  private final PersonClient personClient;
  private final Clock clock;
  private final Validator validator;
  private final UserApi userApi;
  private final ExaminationService examinationService;
  private final ExaminationRepository examinationRepository;

  public ProphylaxisSessionService(
      ProphylaxisSessionRepository prophylaxisSessionRepository,
      ContactClient contactClient,
      ChildRepository childRepository,
      PersonClient personClient,
      Clock clock,
      Validator validator,
      UserApi userApi,
      ExaminationService examinationService,
      ExaminationRepository examinationRepository) {
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
    this.personClient = personClient;
    this.clock = clock;
    this.validator = validator;
    this.userApi = userApi;
    this.examinationService = examinationService;
    this.examinationRepository = examinationRepository;
  }

  public ProphylaxisSession createProphylaxisSession(CreateProphylaxisSessionRequest request) {
    ProphylaxisSession session = new ProphylaxisSession();
    mapProphylaxisSessionRequest(session, request);
    session.setInstitutionId(request.institutionId());
    session.setDentistIds(request.dentistIds());
    session.setZfaIds(request.zfaIds());
    addExaminationsForChildren(request, session);
    prophylaxisSessionRepository.save(session);
    return session;
  }

  private void addExaminationsForChildren(
      CreateProphylaxisSessionRequest request, ProphylaxisSession session) {
    List<Child> children =
        childRepository.findByInstitutionIdAndGroupNameAndProcedureStatusOrderById(
            request.institutionId(), request.groupName(), ProcedureStatus.OPEN);
    if (children.isEmpty()) {
      throw new BadRequestException("The requested group does not contain any children.");
    }
    for (Child child : children) {
      Examination examination = new Examination();
      child.addExamination(examination);
      session.addExamination(examination);
    }
  }

  public Page<ProphylaxisSessionWithAugmentedInstitution> getProphylaxisSessions(
      ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters,
      ProphylaxisSessionFilterParameters filterParameters) {

    Page<ProphylaxisSession> page =
        prophylaxisSessionRepository.findAll(
            new ProphylaxisSessionSpecification(
                paginationAndSortParameters,
                filterParameters.institutionIdFilter(),
                ProphylaxisSessionMapper.mapToDomain(filterParameters.typeFilter())),
            ProphylaxisSessionSpecification.toPageSpec(paginationAndSortParameters));

    Map<UUID, ContactDto> contacts = fetchContactsInBulk(page);

    return page.map(
        session -> {
          ContactDto contact = contacts.get(session.getInstitutionId());
          Assert.notNull(contact, () -> "Failed to resolve given contact");
          return new ProphylaxisSessionWithAugmentedInstitution(session, contact);
        });
  }

  private ProphylaxisSession findProphylaxisSession(UUID prophylaxisSessionId) {
    return prophylaxisSessionRepository
        .findByExternalId(prophylaxisSessionId)
        .orElseThrow(() -> new NotFoundException("Prophylaxis session not found."));
  }

  private ProphylaxisSession findProphylaxisSessionForUpdate(
      UUID prophylaxisSessionId, long version) {
    ProphylaxisSession prophylaxisSession =
        prophylaxisSessionRepository
            .findByExternalIdForUpdate(prophylaxisSessionId)
            .orElseThrow(
                () -> new NotFoundException("Prophylaxis session with given UUID not found"));
    ValidationUtil.validateVersion(version, prophylaxisSession);
    return prophylaxisSession;
  }

  public ProphylaxisSessionWithAugmentedData getProphylaxisSessionWithDetails(
      UUID prophylaxisSessionId) {
    ProphylaxisSession prophylaxisSession = findProphylaxisSession(prophylaxisSessionId);

    List<Examination> examinations = prophylaxisSession.getExaminations();
    Map<UUID, GetPersonFileStateResponse> fileStatesById =
        fetchPersonFileStatesInBulk(examinations);

    Map<Examination, GetPersonFileStateResponse> examinationMap =
        examinations.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    Function.identity(),
                    examination ->
                        fileStatesById.get(examination.getChild().getChildIdFromCentralFile())));

    ContactDto contact = contactClient.getContact(prophylaxisSession.getInstitutionId());
    Map<UUID, UserDto> usersMap =
        userApi
            .getUsersBulk(
                new GetUsersRequest(
                    Stream.concat(
                            prophylaxisSession.getDentistIds().stream(),
                            prophylaxisSession.getZfaIds().stream())
                        .toList(),
                    true))
            .users()
            .stream()
            .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
    return new ProphylaxisSessionWithAugmentedData(
        prophylaxisSession, contact, examinationMap, usersMap);
  }

  private Map<UUID, GetPersonFileStateResponse> fetchPersonFileStatesInBulk(
      List<Examination> examinations) {
    List<Child> children = examinations.stream().map(Examination::getChild).toList();

    return personClient.fetchPersonDataInBulk(children).stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private Map<UUID, ContactDto> fetchContactsInBulk(Streamable<ProphylaxisSession> sessions) {
    List<UUID> institutionIds =
        sessions.map(ProphylaxisSession::getInstitutionId).stream().distinct().toList();
    return contactClient.getBulkContacts(institutionIds, Function.identity());
  }

  public ProphylaxisSessionWithAugmentedData updateProphylaxisSessionParticipants(
      UUID prophylaxisSessionId, UpdateProphylaxisSessionParticipantsRequest updateRequest) {
    ProphylaxisSession persistedProphylaxisSession =
        findProphylaxisSessionForUpdate(prophylaxisSessionId, updateRequest.version());

    Set<UUID> desiredParticipantsIds =
        updateRequest.participants().stream().collect(StreamUtil.toLinkedHashSet());

    Set<UUID> actualParticipantsIds =
        persistedProphylaxisSession.getExaminations().stream()
            .map(Examination::getChild)
            .map(Child::getExternalId)
            .collect(StreamUtil.toLinkedHashSet());

    Set<UUID> idsToAdd = Sets.difference(desiredParticipantsIds, actualParticipantsIds);
    Set<UUID> idsToRemove = Sets.difference(actualParticipantsIds, desiredParticipantsIds);

    if (!idsToAdd.isEmpty() || !idsToRemove.isEmpty()) {
      for (UUID id : idsToAdd) {
        addChildToProphylaxisSession(id, persistedProphylaxisSession);
      }
      for (UUID id : idsToRemove) {
        removeChildFromProphylaxisSession(id, persistedProphylaxisSession);
      }
      persistedProphylaxisSession.setModifiedAt(Instant.now(clock));
      prophylaxisSessionRepository.flush();
    }

    return getProphylaxisSessionWithDetails(persistedProphylaxisSession.getExternalId());
  }

  private void addChildToProphylaxisSession(UUID childId, ProphylaxisSession prophylaxisSession) {
    Child child =
        childRepository
            .findByExternalId(childId)
            .orElseThrow(() -> new BadRequestException("Requested child id not found"));
    if (!Objects.equals(child.getInstitutionId(), prophylaxisSession.getInstitutionId())) {
      throw new BadRequestException(
          "Requested child is not in the same institution as the prophylaxis session.");
    }
    if (!child.getProcedureStatus().isOpen()) {
      throw new BadRequestException("Requested child is not open.");
    }
    Examination examination = new Examination();
    child.addExamination(examination);
    prophylaxisSession.addExamination(examination);
    log.info("Added participant {}", childId);
  }

  private void removeChildFromProphylaxisSession(
      UUID childId, ProphylaxisSession prophylaxisSession) {
    Examination examinationToRemove =
        prophylaxisSession.getExaminations().stream()
            .filter(examination -> examination.getChild().getExternalId().equals(childId))
            .collect(
                StreamUtil.toSingleElement(
                    () -> new BadRequestException("Expected to find exactly one examination")));
    if (examinationToRemove.hasEdits()) {
      throw new BadRequestException(
          "Child cannot be removed because the examination has already been edited.");
    }
    examinationToRemove.getChild().removeExamination(examinationToRemove);
    prophylaxisSession.removeExamination(examinationToRemove);
    log.info("Removed participant {}", childId);
  }

  public ProphylaxisSessionWithAugmentedData updateProphylaxisSession(
      UUID prophylaxisSessionId, UpdateProphylaxisSessionRequest updateRequest) {
    ProphylaxisSession persistedProphylaxisSession =
        findProphylaxisSessionForUpdate(prophylaxisSessionId, updateRequest.version());
    validator.validateGroupAtInstitutionExists(
        persistedProphylaxisSession.getInstitutionId(), updateRequest.groupName());

    mapProphylaxisSessionRequest(persistedProphylaxisSession, updateRequest);

    prophylaxisSessionRepository.flush();

    return getProphylaxisSessionWithDetails(persistedProphylaxisSession.getExternalId());
  }

  public ProphylaxisSessionWithAugmentedData updateProphylaxisSessionExaminations(
      UUID prophylaxisSessionId, UpdateProphylaxisSessionExaminationsRequest updateRequest) {
    List<UUID> examinationIds =
        updateRequest.examinationUpdates().stream()
            .map(UpdateExaminationsInBulkRequest::id)
            .toList();

    Map<UUID, Examination> persistedExaminations =
        examinationRepository.findAllByExternalIdsForUpdate(examinationIds).stream()
            .collect(
                Collectors.toMap(BaseEntityWithExternalId::getExternalId, Function.identity()));

    for (UpdateExaminationsInBulkRequest examinationUpdate : updateRequest.examinationUpdates()) {
      Examination persistedExamination = persistedExaminations.get(examinationUpdate.id());

      examinationService.updateExamination(
          persistedExamination,
          new UpdateExaminationRequest(
              examinationUpdate.version(), examinationUpdate.note(), examinationUpdate.result()));
    }

    return getProphylaxisSessionWithDetails(prophylaxisSessionId);
  }

  private void mapProphylaxisSessionRequest(
      ProphylaxisSession session, ProphylaxisSessionRequest request) {
    session.setDateAndTime(request.dateAndTime());
    session.setGroupName(request.groupName());
    session.setType(ProphylaxisSessionMapper.mapToDomain(request.type()));
    session.setScreening(request.screening());
    session.setFluoridationVarnish(
        ProphylaxisSessionMapper.mapToDomain(request.fluoridationVarnish()));
  }
}
