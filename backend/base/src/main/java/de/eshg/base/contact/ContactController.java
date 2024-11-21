/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact;

import static de.eshg.base.contact.persistence.entity.InstitutionContactCategory.HEALTH_DEPARTMENT;
import static de.eshg.base.contact.persistence.entity.InstitutionContactCategory.SCHOOL;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.SortDirection;
import de.eshg.base.address.AddressDto;
import de.eshg.base.audit.RevisionPair;
import de.eshg.base.contact.api.*;
import de.eshg.base.contact.importing.ParseVCardUtils;
import de.eshg.base.contact.persistence.ContactService;
import de.eshg.base.contact.persistence.entity.*;
import de.eshg.base.history.HistoryEntry;
import de.eshg.base.history.HistoryStep;
import de.eshg.base.user.UserService;
import de.eshg.base.user.api.UserDto;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.mapper.RevisionEntryWithChange;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.NoResultException;
import java.io.IOException;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "Contact")
public class ContactController implements ContactApi {

  private final ContactService contactService;
  private final UserService userService;

  public ContactController(ContactService contactService, UserService userService) {
    this.contactService = contactService;
    this.userService = userService;
  }

  @Override
  @Transactional
  public ContactDto addContact(AbstractAddContactRequest request) {
    Contact contact = ContactMapper.mapContactToDm(request);
    ContactAddress contactAddress = ContactMapper.mapAddressIntoDm(request.contactAddress());
    ContactAddress differentBillingAddress =
        ContactMapper.mapAddressIntoDm(request.differentBillingAddress());

    Contact savedContact =
        contactService.addContact(contact, contactAddress, differentBillingAddress);
    return ContactMapper.mapContactToApi(savedContact);
  }

  @Override
  @Transactional(readOnly = true)
  public ContactDto getContact(UUID id) {
    Contact savedContact = findByIdOrThrow(id);
    boolean isCitizenAccessCodeUser =
        CurrentUserHelper.currentUserHasRole(CitizenPermissionRole.ACCESS_CODE_USER);
    if (isCitizenAccessCodeUser) {
      if (savedContact instanceof InstitutionContact institution
          && (institution.getCategory() == SCHOOL
              || institution.getCategory() == HEALTH_DEPARTMENT)) {
        return ContactMapper.mapContactToApi(savedContact);
      } else {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN);
      }
    }
    return ContactMapper.mapContactToApi(savedContact);
  }

  @Override
  @Transactional(readOnly = true)
  public GetContactsResponse getBulkContacts(GetContactsRequest request) {
    List<Contact> contacts = contactService.findAllById(request.ids());
    return ContactMapper.mapToGetContactsResponse(request.ids(), contacts);
  }

  @Override
  @Transactional(readOnly = true)
  public GetContactHistoryResponse getContactHistory(UUID id, UUID userId, Instant before) {
    List<RevisionEntryWithChange<Contact>> contactHistory =
        contactService.getContactHistory(id, userId, before);
    List<ContactHistoryEntryDto> contactHistoryEntries =
        ContactMapper.mapContactAuditEntriesToApi(contactHistory);

    List<RevisionEntryWithChange<ContactAddress>> addressHistory =
        contactService.getAllContactAddressHistory(id, userId, before);
    List<ContactHistoryEntryDto> addressHistoryEntries =
        ContactMapper.mapContactAddressAuditEntriesToApi(addressHistory);

    List<ContactHistoryEntryDto> entries =
        Stream.concat(contactHistoryEntries.stream(), addressHistoryEntries.stream())
            .sorted(
                Comparator.comparing(ContactHistoryEntryDto::historyId)
                    .thenComparing(
                        a -> a.addressReference() == null ? 0 : a.addressReference().addressId()))
            .toList();

    Map<UUID, UserDto> users = getAuditUsers(entries);
    return new GetContactHistoryResponse(entries, users);
  }

  @Override
  @Transactional(readOnly = true)
  public HistoryStep<ContactDto> getContactHistoryStep(UUID id, long historyId) {
    try {
      RevisionPair<Contact> revisionChanges =
          contactService.getContactRevisionChanges(id, historyId);
      UserRepresentation resolvedUser = getAuditUser(revisionChanges);
      return ContactMapper.mapContactRevisionToApi(revisionChanges, resolvedUser);
    } catch (NoResultException exception) {
      throw new NotFoundException("Revision not found");
    }
  }

  @Override
  @Transactional(readOnly = true)
  public HistoryStep<AddressDto> getContactAddressHistoryStep(
      UUID id, long addressId, long historyId) {
    try {
      RevisionPair<ContactAddress> revisionChanges =
          contactService.getContactAddressRevisionChanges(id, addressId, historyId);
      UserRepresentation resolvedUser = getAuditUser(revisionChanges);
      return ContactMapper.mapAddressRevisionToApi(revisionChanges, resolvedUser);
    } catch (NoResultException exception) {
      throw new NotFoundException("Revision not found");
    }
  }

  @Override
  @Transactional
  public ContactDto updateContact(UUID id, AbstractUpdateContactRequest request) {
    Contact requestedContact = findByIdOrThrow(id);
    UUID mergedIntoId =
        requestedContact.getMergedInto() != null ? requestedContact.getMergedInto().getId() : null;
    Contact contactToUpdate =
        requestedContact.getMergedInto() != null
            ? requestedContact.getMergedInto()
            : requestedContact;
    if (request.mergedFrom() != null) {
      mergeContacts(request, contactToUpdate);
    }
    return ContactMapper.mapContactToApi(updateContact(contactToUpdate, request), id, mergedIntoId);
  }

  private void mergeContacts(AbstractUpdateContactRequest request, Contact contactToUpdate) {
    Contact mergeSource = findByIdOrThrow(request.mergedFrom());
    contactService.lockAll(List.of(contactToUpdate, mergeSource));

    if (mergeSource.getMergedInto() != null) {
      throw new BadRequestException(
          ErrorCode.BAD_REQUEST, "Source contact has already been merged");
    }
    if (contactToUpdate.getId().equals(mergeSource.getId())) {
      throw new BadRequestException(ErrorCode.BAD_REQUEST, "Cannot merge contact into itself");
    }

    contactService.merge(contactToUpdate, mergeSource);
  }

  private Contact updateContact(Contact contact, AbstractUpdateContactRequest request) {
    Contact updateResult = null;
    switch (contact) {
      case InstitutionContact institutionContact -> {
        if (request instanceof UpdateInstitutionContactRequest institutionRequest) {
          updateResult = contactService.update(institutionContact, institutionRequest);
        } else {
          throwUpdateWithTypeSwitchException();
        }
      }
      case PersonContact personContact -> {
        if (request instanceof UpdatePersonContactRequest personRequest) {
          updateResult = contactService.update(personContact, personRequest);
        } else {
          throwUpdateWithTypeSwitchException();
        }
      }
      default -> throw new IllegalArgumentException("Unsupported instance of Contact");
    }
    return updateResult;
  }

  private static void throwUpdateWithTypeSwitchException() {
    throw new BadRequestException(
        ErrorCode.BAD_REQUEST,
        "Changing the type from person to institution or vice versa is not supported!");
  }

  @Override
  @Transactional(readOnly = true)
  public SearchContactsResponse getContacts(ContactFilterParameters parameters) {
    PageSpec pageSpec =
        ContactMapper.mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(ContactSortKey.NAME),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    Class<? extends Contact> contactType =
        switch (parameters.type()) {
          case null -> Contact.class;
          case ContactTypeDto.INSTITUTION -> InstitutionContact.class;
          case ContactTypeDto.PERSON -> PersonContact.class;
        };
    InstitutionContactCategory institutionContactCategory =
        ContactMapper.mapInstitutionContactCategoryToDm(parameters.category());

    Page<? extends Contact> contacts =
        contactService.fuzzySearchContacts(
            parameters.name(),
            parameters.street(),
            contactType,
            institutionContactCategory,
            pageSpec);
    return new SearchContactsResponse(
        contacts.stream().map(ContactMapper::mapContactToApi).toList(),
        contacts.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public ImportInstitutionContactResponse importInstitutionContact(MultipartFile file)
      throws IOException {
    validateVCardFile(file);
    VCardInstitutionContactDto vCardData = ParseVCardUtils.getVCardDataFromInstitution(file);

    Page<InstitutionContact> matches =
        contactService.findMatchesForInstitutionContactImport(vCardData);

    return new ImportInstitutionContactResponse(
        vCardData,
        matches
            .get()
            .map(m -> ContactMapper.mapContactToApi(m, InstitutionContactDto.class))
            .toList(),
        matches.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public ImportPersonContactResponse importPersonContact(MultipartFile file) throws IOException {
    validateVCardFile(file);
    VCardPersonContactDto vCardData = ParseVCardUtils.getVCardDataFromPerson(file);

    Page<PersonContact> matches = contactService.findMatchesForPersonContactImport(vCardData);

    return new ImportPersonContactResponse(
        vCardData,
        matches.map(m -> ContactMapper.mapContactToApi(m, PersonContactDto.class)).toList(),
        matches.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public GetMergedContactsResponse getMergedContacts(UUID id) {
    return new GetMergedContactsResponse(contactService.findAllMergeSources(id));
  }

  private static void validateVCardFile(MultipartFile file) {
    ParseVCardUtils.validateFileExistsAndHasCorrectType(file);
  }

  private Contact findByIdOrThrow(UUID id) {
    return contactService
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Contact with id '%s' not found".formatted(id)));
  }

  private Map<UUID, UserDto> getAuditUsers(List<ContactHistoryEntryDto> history) {
    List<UUID> userIds = history.stream().map(HistoryEntry::modifiedBy).toList();
    return userService.getUsers(userIds, true).stream()
        .collect(StreamUtil.toLinkedHashMap(UserDto::userId));
  }

  private UserRepresentation getAuditUser(RevisionPair<?> revisionChanges) {
    UUID modifiedBy = revisionChanges.after().getRevision().getCreatedBy();
    return userService.getUserById(modifiedBy).orElse(null);
  }
}
