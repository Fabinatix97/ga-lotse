/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.api.CreateProphylaxisSessionRequest;
import de.eshg.dental.api.ProphylaxisSessionPaginationAndSortParameters;
import de.eshg.dental.business.model.ProphylaxisSessionWithAugmentedData;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.ProphylaxisSession;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.domain.repository.ProphylaxisSessionRepository;
import de.eshg.dental.mapper.ProphylaxisSessionMapper;
import de.eshg.lib.contact.ContactClient;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.data.domain.Page;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class ProphylaxisSessionService {

  private final ProphylaxisSessionRepository prophylaxisSessionRepository;
  private final ContactClient contactClient;
  private final ChildRepository childRepository;

  public ProphylaxisSessionService(
      ProphylaxisSessionRepository prophylaxisSessionRepository,
      ContactClient contactClient,
      ChildRepository childRepository) {
    this.prophylaxisSessionRepository = prophylaxisSessionRepository;
    this.contactClient = contactClient;
    this.childRepository = childRepository;
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
        childRepository.findByInstitutionIdAndGroupNameOrderById(
            request.institutionId(), request.groupName());
    if (children.isEmpty()) {
      throw new BadRequestException("The requested group does not contain any children.");
    }
    for (Child child : children) {
      Examination examination = new Examination();
      child.addExamination(examination);
      session.addExamination(examination);
    }
  }

  public Page<ProphylaxisSessionWithAugmentedData> getProphylaxisSessions(
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
          Assert.notNull(contact, () -> "Failed to resolve contact " + session.getInstitutionId());
          return new ProphylaxisSessionWithAugmentedData(session, contact);
        });
  }

  public ProphylaxisSessionWithAugmentedData getProphylaxisSession(UUID prophylaxisSessionId) {
    ProphylaxisSession prophylaxisSession =
        prophylaxisSessionRepository
            .findByExternalId(prophylaxisSessionId)
            .orElseThrow(
                () ->
                    new NotFoundException(
                        "Prophylaxis session with UUID %s not found"
                            .formatted(prophylaxisSessionId)));

    return new ProphylaxisSessionWithAugmentedData(
        prophylaxisSession, contactClient.getContact(prophylaxisSession.getInstitutionId()));
  }

  private Map<UUID, ContactDto> fetchContactsInBulk(Streamable<ProphylaxisSession> sessions) {
    List<UUID> institutionIds =
        sessions.map(ProphylaxisSession::getInstitutionId).stream().distinct().toList();
    return contactClient.getBulkContacts(institutionIds, Function.identity());
  }
}
