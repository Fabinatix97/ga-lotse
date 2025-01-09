/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import com.google.common.collect.Sets;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.UpdateProphylaxisSessionParticipantsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionRequest;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.dental.mapper.ProphylaxisSessionMapper;
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

  public ProphylaxisSessionService(
      ProphylaxisSessionRepository prophylaxisSessionRepository,
      ContactClient contactClient,
      ChildRepository childRepository,
      PersonClient personClient,
      Clock clock,
      Validator validator) {
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
    this.personClient = personClient;
    this.clock = clock;
    this.validator = validator;
  }

  public ProphylaxisSession createProphylaxisSession(CreateProphylaxisSessionRequest request) {
    ProphylaxisSession session = new ProphylaxisSession();
    session.setDateAndTime(request.dateAndTime());
    session.setInstitutionId(request.institutionId());
    session.setGroupName(request.groupName());
    session.setType(ProphylaxisSessionMapper.mapToDomain(request.type()));
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

    Map<UUID, GetPersonFileStateResponse> fileStatesById =
        personClient.fetchPersonDataInBulk(prophylaxisSession.getParticipants()).stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
    Map<Child, GetPersonFileStateResponse> participantMap =
        prophylaxisSession.getParticipants().stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    Function.identity(),
                    child -> fileStatesById.get(child.getChildIdFromCentralFile())));

    ContactDto contact = contactClient.getContact(prophylaxisSession.getInstitutionId());
    return new ProphylaxisSessionWithAugmentedData(prophylaxisSession, contact, participantMap);
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
      if (persistedProphylaxisSession.getExaminations().isEmpty()) {
        throw new BadRequestException("Prophylaxis session may not remain without participants.");
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

    persistedProphylaxisSession.setDateAndTime(updateRequest.dateAndTime());
    persistedProphylaxisSession.setGroupName(updateRequest.groupName());
    persistedProphylaxisSession.setType(ProphylaxisSessionMapper.mapToDomain(updateRequest.type()));

    prophylaxisSessionRepository.flush();

    return getProphylaxisSessionWithDetails(persistedProphylaxisSession.getExternalId());
  }
}
