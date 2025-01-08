/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.contact;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.contact.GetContactsRequest;
import de.eshg.base.contact.GetContactsResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactDto;
import de.eshg.rest.service.error.BadRequestException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
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

  public Stream<ContactDto> getBulkContacts(List<UUID> contactIds) {
    if (contactIds.isEmpty()) {
      return Stream.empty();
    }
    GetContactsResponse response =
        contactApiClient.getBulkContacts(new GetContactsRequest(contactIds));
    Assert.isTrue(
        response.notFoundIds().isEmpty(),
        () -> "Failed to find %s contact(s)".formatted(response.notFoundIds().size()));
    return response.contactResponses().stream();
  }

  public <T> Map<UUID, T> getBulkContacts(
      List<UUID> contactIds, Function<ContactDto, T> valueMapper) {
    return getBulkContacts(contactIds)
        .collect(StreamUtil.toLinkedHashMap(ContactDto::id, valueMapper));
  }

  public void validateContactIsInstitutionWithCategory(
      UUID contactId, InstitutionContactCategoryDto category) {
    try {
      ContactDto contact = getContact(contactId);
      if (!(contact instanceof InstitutionContactDto institution
          && institution.category() == category)) {
        throw new BadRequestException(
            "Contact with id %s is not of category %s.".formatted(contactId, category));
      }
    } catch (HttpClientErrorException.NotFound e) {
      throw new BadRequestException("Contact with id %s does not exist.".formatted(contactId));
    }
  }

  public void validateContactIsInstitutionWithCategory(
      UUID contactId, Set<InstitutionContactCategoryDto> categories) {
    try {
      ContactDto contact = getContact(contactId);
      if (!(contact instanceof InstitutionContactDto institution
          && categories.contains(institution.category()))) {
        String expectedCategories =
            categories.stream()
                .map(InstitutionContactCategoryDto::toString)
                .collect(Collectors.joining(", "));
        throw new BadRequestException(
            "Contact with id %s does not have a valid category. Expected one of: %s"
                .formatted(contactId, expectedCategories));
      }
    } catch (HttpClientErrorException.NotFound e) {
      throw new BadRequestException("Contact with id %s does not exist.".formatted(contactId));
    }
  }
}
