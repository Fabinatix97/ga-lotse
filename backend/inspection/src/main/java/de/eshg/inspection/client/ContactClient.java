/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.client;

import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.contact.GetContactsRequest;
import de.eshg.base.contact.GetContactsResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.ContactFilterParameters;
import de.eshg.base.contact.api.PersonContactDto;
import de.eshg.base.contact.api.SearchContactsResponse;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class ContactClient {
  private final ContactApi contactApi;

  public static final String UNKNOWN_CONTACT = "<unbekannter Kontakt>";

  public ContactClient(ContactApi contactApi) {
    this.contactApi = contactApi;
  }

  @NotNull
  public SearchContactsResponse getContacts(ContactFilterParameters parameters) {
    return contactApi.getContacts(parameters);
  }

  @NotNull
  public ContactDto getContact(UUID contactId) {
    try {
      return contactApi.getContact(contactId);
    } catch (HttpClientErrorException.NotFound ex) {
      return createUnknownContact(contactId);
    }
  }

  @NotNull
  public Map<UUID, ContactDto> getContactsAsMap(
      Set<UUID> contactIds, boolean throwIfContactNotFound) {
    if (contactIds.isEmpty()) {
      return Collections.emptyMap();
    }

    GetContactsRequest getUsersRequest = new GetContactsRequest(new ArrayList<>(contactIds));
    GetContactsResponse getContactsResponse = contactApi.getBulkContacts(getUsersRequest);
    if (throwIfContactNotFound && !getContactsResponse.notFoundIds().isEmpty()) {
      // This wording is in order to be consistent with the wording of users not being found.
      throw new BadRequestException(ErrorCode.NOT_FOUND, "Some contacts could not be found");
    }

    List<ContactDto> contacts = getContactsResponse.contactResponses();

    Map<UUID, ContactDto> contactMap =
        new HashMap<>(contacts.stream().collect(toMap(ContactDto::id, identity())));

    for (UUID userId : contactIds) {
      contactMap.putIfAbsent(userId, createUnknownContact(userId));
    }

    return contactMap;
  }

  @NotNull
  public Map<UUID, ContactDto> getContactsAsMap(Set<UUID> contactIds) {
    return getContactsAsMap(contactIds, false);
  }

  private ContactDto createUnknownContact(UUID contactId) {
    return new PersonContactDto(
        contactId,
        null,
        null,
        null,
        UNKNOWN_CONTACT,
        null,
        null,
        null,
        Collections.emptyList(),
        Collections.emptyList(),
        null,
        null);
  }
}
