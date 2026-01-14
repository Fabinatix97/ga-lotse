/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental;

import static de.eshg.dental.Validator.validateAllExaminationsAreEmpty;

import com.google.common.collect.Sets;
import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.api.ProphylaxisSessionRequest;
import de.eshg.dental.api.UpdateChildDetailsInBulkRequest;
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.api.UpdateExaminationRequest;
import de.eshg.dental.api.UpdateExaminationsInBulkRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionExaminationsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionParticipantsRequest;
import de.eshg.dental.api.UpdateProphylaxisSessionRequest;
import de.eshg.dental.business.model.ChildWithPersonAndContactData;
import de.eshg.dental.business.model.ChildWithPersonData;
import de.eshg.dental.business.model.ProphylaxisSessionExaminationUpdateResult;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedInstitution;
import de.eshg.dental.client.PersonClient;
import de.eshg.dental.domain.model.*;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.domain.repository.ExaminationRepository;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.dental.mapper.DentitionTypeMapper;
import de.eshg.dental.mapper.ProphylaxisSessionMapper;
import de.eshg.lib.contact.ContactClient;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.time.Year;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
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
  private final ChildService childService;

  public ProphylaxisSessionService(
      ProphylaxisSessionRepository prophylaxisSessionRepository,
      ContactClient contactClient,
      ChildRepository childRepository,
      PersonClient personClient,
      Clock clock,
      Validator validator,
      UserApi userApi,
      ExaminationService examinationService,
      ExaminationRepository examinationRepository,
      ChildService childService) {
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
    this.personClient = personClient;
    this.clock = clock;
    this.validator = validator;
    this.userApi = userApi;
    this.examinationService = examinationService;
    this.examinationRepository = examinationRepository;
    this.childService = childService;
  }

  public ProphylaxisSession createProphylaxisSession(CreateProphylaxisSessionRequest request) {
    validator.validateInstitutionAndGroupName(request.institutionId(), request.groupName());
    validator.validateTechnicalGroups(request.dentistIds(), request.zfaIds());
    validator.validateDentitionType(request.dentitionType(), request.isScreening());

    ProphylaxisSession session = new ProphylaxisSession();
    mapProphylaxisSessionRequest(session, request);
    addExaminationsForChildren(request, session);
    session.setProphylaxisStatus(ProphylaxisStatus.OPEN);
    prophylaxisSessionRepository.save(session);
    return session;
  }

  private void addExaminationsForChildren(
      CreateProphylaxisSessionRequest request, ProphylaxisSession session) {
    List<Child> children =
        getChildrenForProphylaxisSession(
            request.institutionId(), request.groupName(), Year.of(request.schoolYear()));

    if (children.isEmpty()) {
      throw new BadRequestException("The requested group and year does not contain any children.");
    }
    for (Child child : children) {
      Examination examination = new Examination();
      child.addExamination(examination);
      session.addExamination(examination);
    }
  }

  private List<Child> getChildrenForProphylaxisSession(
      UUID institutionId, String groupName, Year year) {
    if (groupName == null) {
      return childRepository.findByInstitutionIdAndYearAndProcedureStatus(
          institutionId, year, ProcedureStatus.OPEN);
    }
    return childRepository.findByInstitutionIdAndGroupNameAndProcedureStatusAndYearOrderById(
        institutionId, groupName, ProcedureStatus.OPEN, year);
  }

  public Page<ProphylaxisSessionWithAugmentedInstitution> getProphylaxisSessions(
      ProphylaxisSessionPaginationAndSortParameters paginationAndSortParameters,
      ProphylaxisSessionFilterParameters filterParameters) {

    Page<ProphylaxisSession> page =
        prophylaxisSessionRepository.findAll(
            new ProphylaxisSessionSpecification(
                paginationAndSortParameters,
                filterParameters.institutionIdFilter(),
                filterParameters.yearFilter(),
                ProphylaxisSessionMapper.mapToDomain(filterParameters.typeFilter()),
                ProphylaxisSessionMapper.mapToDomain(filterParameters.statusFilter()),
                clock.getZone()),
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
    Map<UUID, ChildWithPersonAndContactData> fileStatesById =
        fetchPersonFileStatesInBulk(examinations);

    Map<Examination, ChildWithPersonAndContactData> examinationMap =
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

    List<UUID> fileStateIdsOfChildrenInSession =
        examinations.stream().map(ex -> ex.getChild().getChildIdFromCentralFile()).toList();

    Map<UUID, List<UUID>> associatedFileStateIdsByFileStateIdInSession =
        personClient.fetchAssociatedExternalIdsInBulk(fileStateIdsOfChildrenInSession);

    List<UUID> allFileStateIds =
        Stream.concat(
                associatedFileStateIdsByFileStateIdInSession.values().stream()
                    .flatMap(List::stream),
                fileStateIdsOfChildrenInSession.stream())
            .toList();

    Map<UUID, List<Examination>> examinationsByFileStateId =
        examinationRepository
            .findAllByPersonFileStateIds(Person.PERSON_TYPE_USED_FOR_CHILDREN, allFileStateIds)
            .collect(
                Collectors.groupingBy(
                    examination -> examination.getChild().getChildIdFromCentralFile()));

    Map<UUID, List<Examination>> previousExaminationsBySessionChildFileStateId =
        fileStateIdsOfChildrenInSession.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    Function.identity(),
                    getPreviousScreeningExaminations(
                        prophylaxisSession,
                        examinationsByFileStateId,
                        associatedFileStateIdsByFileStateIdInSession)));

    Map<UUID, List<FluoridationConsent>> relevantFluoridationConsentsByChildFileStateId =
        examinations.stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    (Examination ex) -> ex.getChild().getChildIdFromCentralFile(),
                    (Examination ex) ->
                        childService.getRelevantFluoridationConsentsForExamination(
                            childService.getChildAndAllPreviousChildren(ex.getChild()),
                            prophylaxisSession
                                .getDateAndTime()
                                .atZone(clock.getZone())
                                .toLocalDate())));

    return new ProphylaxisSessionWithAugmentedData(
        prophylaxisSession,
        contact,
        examinationMap,
        usersMap,
        previousExaminationsBySessionChildFileStateId,
        relevantFluoridationConsentsByChildFileStateId);
  }

  private static Function<UUID, List<Examination>> getPreviousScreeningExaminations(
      ProphylaxisSession prophylaxisSessionToIgnore,
      Map<UUID, List<Examination>> examinationsByChildFileStateId,
      Map<UUID, List<UUID>> associatedFileStateIdsByChildFileStateId) {
    return fileStateId ->
        Stream.concat(
                examinationsByChildFileStateId.get(fileStateId).stream()
                    .filter(ex -> !ex.getProphylaxisSession().equals(prophylaxisSessionToIgnore)),
                associatedFileStateIdsByChildFileStateId
                    .getOrDefault(fileStateId, List.of())
                    .stream()
                    .map(examinationsByChildFileStateId::get)
                    .filter(Objects::nonNull)
                    .flatMap(List::stream))
            .filter(
                prophylaxisSession ->
                    prophylaxisSession.getResult() instanceof ScreeningExaminationResult)
            .filter(isBefore(prophylaxisSessionToIgnore))
            .toList();
  }

  private static Predicate<Examination> isBefore(ProphylaxisSession prophylaxisSession) {
    return examination ->
        examination
            .getProphylaxisSession()
            .getDateAndTime()
            .isBefore(prophylaxisSession.getDateAndTime());
  }

  private Map<UUID, ChildWithPersonAndContactData> fetchPersonFileStatesInBulk(
      List<Examination> examinations) {
    List<Child> children = examinations.stream().map(Examination::getChild).toList();
    List<ChildWithPersonAndContactData> augmentedChildren =
        childService.augmentWithChildAndContactData(children, true);
    return augmentedChildren.stream()
        .collect(StreamUtil.toLinkedHashMap(child -> child.child().getChildIdFromCentralFile()));
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
    Validator.validateUpdatableFields(
        persistedProphylaxisSession,
        mapProphylaxisSessionRequest(new ProphylaxisSession(), updateRequest));

    validator.validateDentitionType(updateRequest.dentitionType(), updateRequest.isScreening());

    mapProphylaxisSessionRequest(persistedProphylaxisSession, updateRequest);

    prophylaxisSessionRepository.flush();

    return getProphylaxisSessionWithDetails(persistedProphylaxisSession.getExternalId());
  }

  public void closeProphylaxisSession(UUID prophylaxisSessionId, long version) {
    ProphylaxisSession prophylaxisSession =
        findProphylaxisSessionForUpdate(prophylaxisSessionId, version);

    validator.validateAllExaminationsAreComplete(prophylaxisSession);

    prophylaxisSession.setProphylaxisStatus(ProphylaxisStatus.CLOSED);
    prophylaxisSessionRepository.flush();
  }

  public ProphylaxisSessionExaminationUpdateResult updateProphylaxisSessionExaminations(
      UUID prophylaxisSessionId, UpdateProphylaxisSessionExaminationsRequest updateRequest) {
    List<UUID> failedPersonUpdates = new ArrayList<>();
    List<UUID> failedExaminationUpdates = new ArrayList<>();

    // must happen before examinationUpdates -> version conflict
    if (!updateRequest.childUpdates().isEmpty()) {
      failedPersonUpdates = updateChildDetails(updateRequest.childUpdates());
    }
    if (!updateRequest.examinationUpdates().isEmpty()) {
      failedExaminationUpdates = updateExaminations(updateRequest.examinationUpdates());
    }
    ProphylaxisSessionWithAugmentedData prophylaxisSessionWithDetails =
        getProphylaxisSessionWithDetails(prophylaxisSessionId);

    return new ProphylaxisSessionExaminationUpdateResult(
        failedPersonUpdates, failedExaminationUpdates, prophylaxisSessionWithDetails);
  }

  private List<UUID> updateChildDetails(List<UpdateChildDetailsInBulkRequest> childUpdates) {
    List<UUID> failedPersonUpdates = new ArrayList<>();

    List<UUID> childIds =
        childUpdates.stream().map(UpdateChildDetailsInBulkRequest::childId).toList();

    List<Child> children = childRepository.findByExternalIdsForUpdate(childIds).toList();
    Map<UUID, ChildWithPersonData> augmentedChildren =
        childService.augmentWithChildData(children).stream()
            .collect(StreamUtil.toLinkedHashMap(child -> child.child().getExternalId()));
    for (UpdateChildDetailsInBulkRequest childUpdate : childUpdates) {
      ChildWithPersonData augmentedChild = augmentedChildren.get(childUpdate.childId());
      Child child = augmentedChild.child();
      if (hasChangedPersonAttribute(childUpdate, augmentedChild.person())) {
        try {
          ValidationUtil.validateVersion(childUpdate.version(), child);
          childService.updateChildPerson(
              child, mapToPersonDetailsDto(augmentedChild.person(), childUpdate));
        } catch (Exception e) {
          failedPersonUpdates.add(childUpdate.childId());
          log.error("Person update failed for child {}", childUpdate.childId(), e);
        }
      }
      childService.updateChildData(
          child,
          new UpdateChildRequest(
              childUpdate.version(),
              childUpdate.groupName(),
              child.getInstitutionId(),
              childUpdate.fluoridationConsent(),
              childUpdate.procedureLabels()));
    }
    childRepository.flush();

    return failedPersonUpdates;
  }

  private PersonDetailsDto mapToPersonDetailsDto(
      GetPersonFileStateResponse personData, UpdateChildDetailsInBulkRequest childUpdate) {
    return new PersonDetailsDto(
        personData.title(),
        personData.salutation(),
        childUpdate.gender(),
        childUpdate.firstName(),
        childUpdate.lastName(),
        childUpdate.dateOfBirth(),
        personData.nameAtBirth(),
        personData.placeOfBirth(),
        personData.countryOfBirth(),
        personData.emailAddresses(),
        personData.phoneNumbers(),
        personData.contactAddress(),
        personData.differentBillingAddress());
  }

  private boolean hasChangedPersonAttribute(
      UpdateChildDetailsInBulkRequest childUpdate, GetPersonFileStateResponse personData) {
    return !(Objects.equals(childUpdate.firstName(), personData.firstName())
        && Objects.equals(childUpdate.lastName(), personData.lastName())
        && Objects.equals(childUpdate.dateOfBirth(), personData.dateOfBirth())
        && Objects.equals(childUpdate.gender(), personData.gender()));
  }

  private List<UUID> updateExaminations(List<UpdateExaminationsInBulkRequest> examinationUpdates) {
    List<UUID> failedExaminationUpdates = new ArrayList<>();
    List<UUID> examinationIds =
        examinationUpdates.stream().map(UpdateExaminationsInBulkRequest::id).toList();

    List<Long> ids = examinationRepository.findAllByExternalIdsForUpdate(examinationIds);
    Map<UUID, Examination> persistedExaminations =
        examinationRepository
            .fetchByIds(ids)
            .collect(StreamUtil.toLinkedHashMap(Examination::getExternalId));

    for (UpdateExaminationsInBulkRequest examinationUpdate : examinationUpdates) {
      Examination persistedExamination = persistedExaminations.get(examinationUpdate.id());
      if (persistedExamination == null) {
        failedExaminationUpdates.add(examinationUpdate.id());
        log.error("Examination with id {} was not found", examinationUpdate.id());
        continue;
      }
      try {
        examinationService.updateExamination(
            persistedExamination,
            new UpdateExaminationRequest(
                examinationUpdate.version(), examinationUpdate.note(), examinationUpdate.result()));
      } catch (Exception e) {
        failedExaminationUpdates.add(examinationUpdate.id());
        log.error("Update of examination with id {} failed", examinationUpdate.id(), e);
      }
    }

    examinationRepository.flush();
    return failedExaminationUpdates;
  }

  private ProphylaxisSession mapProphylaxisSessionRequest(
      ProphylaxisSession session, ProphylaxisSessionRequest request) {
    if (request instanceof CreateProphylaxisSessionRequest createProphylaxisSessionRequest) {
      session.setInstitutionId(createProphylaxisSessionRequest.institutionId());
      session.setGroupName(createProphylaxisSessionRequest.groupName());
    }
    session.setDateAndTime(request.dateAndTime());
    session.setType(ProphylaxisSessionMapper.mapToDomain(request.type()));
    session.setDentitionType(DentitionTypeMapper.mapToDomain(request.dentitionType()));
    session.setIsScreening(request.isScreening());
    session.setFluoridationVarnish(
        ProphylaxisSessionMapper.mapToDomain(request.fluoridationVarnish()));
    session.setDentistIds(request.dentistIds());
    session.setZfaIds(request.zfaIds());
    return session;
  }

  public void deleteProphylaxisSession(UUID prophylaxisSessionId, Long version) {
    ProphylaxisSession prophylaxisSession =
        findProphylaxisSessionForUpdate(prophylaxisSessionId, version);

    List<Examination> examinations = prophylaxisSession.getExaminations();
    validateAllExaminationsAreEmpty(examinations);

    prophylaxisSessionRepository.deleteByExternalId(prophylaxisSessionId);
  }
}
