/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.client;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.contact.GetContactsRequest;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.rest.service.error.BadRequestException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class ContactClient {
  private final ContactApi contactApiClient;
  private final Map<UUID, ContactDto> cachedContacts = new ConcurrentHashMap<>();

  public ContactClient(ContactApi contactApiClient) {
    this.contactApiClient = contactApiClient;
  }

  public ContactDto getContact(UUID contactId) {
    return cachedContacts.computeIfAbsent(contactId, contactApiClient::getContact);
  }

  public List<ContactDto> getBulkContacts(List<UUID> contactIds) {
    if (contactIds.isEmpty()) {
      return List.of();
    }
    return contactApiClient.getBulkContacts(new GetContactsRequest(contactIds)).contactResponses();
  }

  public void validateContactIsInstitutionWithCategory(
      UUID locationId, InstitutionContactCategoryDto category) {
    try {
      ContactDto contact = getContact(locationId);
      if (!(contact instanceof InstitutionContactDto institution
          && institution.category() == category)) {
        throw new BadRequestException(
            "Contact with id %s is not of category %s.".formatted(locationId, category));
      }
    } catch (HttpClientErrorException.NotFound e) {
      throw new BadRequestException("Contact with id %s does not exist.".formatted(locationId));
    }
  }
}
