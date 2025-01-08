/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact;

import static de.eshg.base.address.mapper.AddressMapper.mapDomesticAddressToApi;
import static de.eshg.base.address.mapper.AddressMapper.mapPostboxAddressToApi;
import static de.eshg.base.contact.persistence.entity.InstitutionContactCategory.*;
import static de.eshg.base.history.HistoryChange.newChange;
import static de.eshg.base.util.MappingUtil.*;

import de.eshg.base.SortDirection;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.audit.RevisionHistoryMapper;
import de.eshg.base.audit.RevisionPair;
import de.eshg.base.contact.api.*;
import de.eshg.base.contact.persistence.ContactService;
import de.eshg.base.contact.persistence.entity.*;
import de.eshg.base.history.HistoryStep;
import de.eshg.base.user.mapper.UserMapper;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.mapper.RevisionEntryWithChange;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.data.domain.Sort;

public class ContactMapper {

  private ContactMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static Contact mapContactToDm(AbstractAddContactRequest request) {
    return switch (request) {
      case AddInstitutionContactRequest addInstitutionContactRequest ->
          mapInstitutionContactToDm(addInstitutionContactRequest);
      case AddPersonContactRequest addPersonContactRequest ->
          mapPersonContactToDm(addPersonContactRequest);
    };
  }

  public static InstitutionContact mapInstitutionContactToDm(AddInstitutionContactRequest request) {
    InstitutionContact contact = new InstitutionContact();
    setContactDmFields(request, contact);
    contact.setCategory(mapInstitutionContactCategoryToDm(request.category()));
    return contact;
  }

  public static PersonContact mapPersonContactToDm(AddPersonContactRequest request) {
    PersonContact contact = new PersonContact();
    setContactDmFields(request, contact);
    contact.setTitle(request.title());
    contact.setFirstName(request.firstName());
    contact.setSalutation(mapSalutationToDm(request.salutation()));
    contact.setGender(mapGenderToDm(request.gender()));
    contact.setExternalChatUsername(request.externalChatUsername());
    return contact;
  }

  private static void setContactDmFields(AbstractAddContactRequest request, Contact contact) {
    contact.setName(request.name());
    if (request.emailAddresses() != null) {
      contact.addEmailAddresses(mapEmailAddressesToDm(request.emailAddresses()));
    }
    if (request.phoneNumbers() != null) {
      contact.addPhoneNumbers(mapPhoneNumbersToDm(request.phoneNumbers()));
    }
  }

  public static List<ContactEmailAddress> mapEmailAddressesToDm(List<String> emailAddresses) {
    return emailAddresses.stream().map(ContactMapper::mailEmailAddressToDm).toList();
  }

  private static ContactEmailAddress mailEmailAddressToDm(String emailAddress) {
    ContactEmailAddress contactEmailAddress = new ContactEmailAddress();
    contactEmailAddress.setEmailAddress(emailAddress);
    return contactEmailAddress;
  }

  public static List<ContactPhoneNumber> mapPhoneNumbersToDm(List<String> phoneNumbers) {
    return phoneNumbers.stream().map(ContactMapper::mapPhoneNumberIntoDm).toList();
  }

  private static ContactPhoneNumber mapPhoneNumberIntoDm(String phoneNumber) {
    ContactPhoneNumber contactPhoneNumber = new ContactPhoneNumber();
    contactPhoneNumber.setPhoneNumber(phoneNumber);
    return contactPhoneNumber;
  }

  public static InstitutionContactCategory mapInstitutionContactCategoryToDm(
      InstitutionContactCategoryDto category) {
    return switch (category) {
      case null -> null;
      case LABORATORY -> LABORATORY;
      case SCHOOL -> SCHOOL;
      case DOCTORS_OFFICE -> DOCTORS_OFFICE;
      case HEALTH_DEPARTMENT -> HEALTH_DEPARTMENT;
      case MISC -> MISC;
      case DAYCARE -> DAYCARE;
    };
  }

  public static ContactAddress mapAddressIntoDm(
      DomesticAddressDto domesticAddressDto, DomesticContactAddress domesticAddress) {
    return AddressMapper.mapDomesticAddressIntoDm(domesticAddressDto, domesticAddress);
  }

  public static ContactAddress mapAddressIntoDm(
      PostboxAddressDto postboxAddressDto, PostboxContactAddress postboxAddress) {
    return AddressMapper.mapPostboxAddressIntoDm(postboxAddressDto, postboxAddress);
  }

  public static ContactAddress mapAddressIntoDm(AddressDto addressDto) {
    return switch (addressDto) {
      case null -> null;
      case DomesticAddressDto domesticAddress ->
          mapAddressIntoDm(domesticAddress, new DomesticContactAddress());
      case PostboxAddressDto postboxAddress ->
          mapAddressIntoDm(postboxAddress, new PostboxContactAddress());
    };
  }

  public static <T extends ContactDto> T mapContactToApi(Contact contact, Class<T> contactDtoType) {
    return contactDtoType.cast(mapContactToApi(contact));
  }

  public static ContactDto mapContactToApi(Contact contact) {
    if (contact.getMergedInto() == null) {
      return mapContactToApi_ignoreMerge(contact);
    } else {
      return mapContactToApi(
          contact.getMergedInto(), contact.getId(), contact.getMergedInto().getId());
    }
  }

  public static ContactDto mapContactToApi_ignoreMerge(Contact contact) {
    UUID queryId = contact.getId();
    UUID mergedIntoId = contact.getMergedInto() != null ? contact.getMergedInto().getId() : null;
    return mapContactToApi(contact, queryId, mergedIntoId);
  }

  public static ContactDto mapContactToApi(Contact contact, UUID queryId, UUID mergedIntoId) {
    return switch (contact) {
      case null -> null;
      case InstitutionContact institutionContact ->
          mapInstitutionContactToApi(institutionContact, queryId, mergedIntoId);
      case PersonContact personContact ->
          mapPersonContactToApi(personContact, queryId, mergedIntoId);
      default -> throw new IllegalArgumentException("Unsupported instance of Contact");
    };
  }

  public static GetContactsResponse mapToGetContactsResponse(
      List<UUID> queryIds, List<Contact> foundContacts) {
    Map<UUID, ContactDto> mappedContactsById = mapToApiAndGroupById(foundContacts);

    List<ContactDto> contactResponses = new ArrayList<>();
    List<UUID> notFoundContactIds = new ArrayList<>();

    for (UUID id : queryIds) {
      ContactDto contact = mappedContactsById.get(id);
      if (contact != null) {
        contactResponses.add(contact);
      } else {
        notFoundContactIds.add(id);
      }
    }

    return new GetContactsResponse(contactResponses, notFoundContactIds);
  }

  private static Map<UUID, ContactDto> mapToApiAndGroupById(List<Contact> contacts) {
    return contacts.stream()
        .map(ContactMapper::mapContactToApi)
        .collect(Collectors.toMap(ContactDto::id, Function.identity()));
  }

  public static InstitutionContactDto mapInstitutionContactToApi(
      InstitutionContact contact, UUID queryId, UUID mergedIntoId) {
    return new InstitutionContactDto(
        queryId,
        mergedIntoId,
        contact.getName(),
        mapInstitutionContactCategoryToApi(contact.getCategory()),
        extractStrings(contact.getPhoneNumbers(), ContactPhoneNumber::getPhoneNumber),
        extractStrings(contact.getEmailAddresses(), ContactEmailAddress::getEmailAddress),
        mapAddressToApi(contact.getContactAddress()),
        mapAddressToApi(contact.getDifferentBillingAddress()));
  }

  public static PersonContactDto mapPersonContactToApi(
      PersonContact contact, UUID queryId, UUID mergedIntoId) {
    return new PersonContactDto(
        queryId,
        mergedIntoId,
        contact.getTitle(),
        contact.getFirstName(),
        contact.getName(),
        mapSalutationToApi(contact.getSalutation()),
        mapGenderToApi(contact.getGender()),
        contact.getExternalChatUsername(),
        extractStrings(contact.getPhoneNumbers(), ContactPhoneNumber::getPhoneNumber),
        extractStrings(contact.getEmailAddresses(), ContactEmailAddress::getEmailAddress),
        mapAddressToApi(contact.getContactAddress()),
        mapAddressToApi(contact.getDifferentBillingAddress()));
  }

  public static List<ContactHistoryEntryDto> mapContactAuditEntriesToApi(
      List<RevisionEntryWithChange<Contact>> history) {
    if (history.isEmpty()) {
      return Collections.emptyList();
    }

    List<ContactHistoryEntryDto> entries = new ArrayList<>(history.size());
    for (RevisionEntryWithChange<Contact> next : history) {
      entries.add(
          new ContactHistoryEntryDto(
              RevisionHistoryMapper.mapTypeToApi(next.getType()),
              next.getRevision().getId(),
              next.getRevision().getCreatedBy(),
              next.getRevision().getCreatedAt(),
              next.getEntity().getId(),
              null,
              mapContactChangeToApi(next)));
    }

    return entries;
  }

  private static ContactChange mapContactChangeToApi(RevisionEntryWithChange<Contact> revision) {
    return switch (revision.getEntity()) {
      case InstitutionContact institutionContact ->
          mapInstitutionContactChangeToApi(revision, institutionContact);
      case PersonContact personContact -> mapPersonContactChangeToApi(revision, personContact);
      default -> throw new IllegalArgumentException("Unsupported instance of Contact");
    };
  }

  private static InstitutionContactChange mapInstitutionContactChangeToApi(
      RevisionEntryWithChange<Contact> revision, InstitutionContact entity) {
    Set<String> fields = revision.getChangedFields();
    return new InstitutionContactChange(
        newChange(
            fields.contains(Contact_.MERGED_INTO),
            entity.getMergedInto() != null ? entity.getMergedInto().getId() : null),
        newChange(
            fields.contains(Contact_.MERGED_FROM),
            entity.getMergedFrom() != null ? entity.getMergedFrom().getId() : null),
        newChange(fields.contains(Contact_.NAME), entity.getName()),
        newChange(
            fields.contains(InstitutionContact_.CATEGORY),
            mapInstitutionContactCategoryToApi(entity.getCategory())),
        newChange(
            fields.contains(Contact_.PHONE_NUMBERS),
            extractStrings(entity.getPhoneNumbers(), ContactPhoneNumber::getPhoneNumber)),
        newChange(
            fields.contains(Contact_.EMAIL_ADDRESSES),
            extractStrings(entity.getEmailAddresses(), ContactEmailAddress::getEmailAddress)));
  }

  private static PersonContactChange mapPersonContactChangeToApi(
      RevisionEntryWithChange<Contact> revision, PersonContact entity) {
    Set<String> fields = revision.getChangedFields();
    return new PersonContactChange(
        newChange(
            fields.contains(Contact_.MERGED_INTO),
            entity.getMergedInto() != null ? entity.getMergedInto().getId() : null),
        newChange(
            fields.contains(Contact_.MERGED_FROM),
            entity.getMergedFrom() != null ? entity.getMergedFrom().getId() : null),
        newChange(fields.contains(PersonContact_.TITLE), entity.getTitle()),
        newChange(fields.contains(PersonContact_.FIRST_NAME), entity.getFirstName()),
        newChange(fields.contains(Contact_.NAME), entity.getName()),
        newChange(
            fields.contains(PersonContact_.SALUTATION), mapSalutationToApi(entity.getSalutation())),
        newChange(fields.contains(PersonContact_.GENDER), mapGenderToApi(entity.getGender())),
        newChange(
            fields.contains(PersonContact_.EXTERNAL_CHAT_USERNAME),
            entity.getExternalChatUsername()),
        newChange(
            fields.contains(Contact_.PHONE_NUMBERS),
            extractStrings(entity.getPhoneNumbers(), ContactPhoneNumber::getPhoneNumber)),
        newChange(
            fields.contains(Contact_.EMAIL_ADDRESSES),
            extractStrings(entity.getEmailAddresses(), ContactEmailAddress::getEmailAddress)));
  }

  public static List<ContactHistoryEntryDto> mapContactAddressAuditEntriesToApi(
      List<RevisionEntryWithChange<ContactAddress>> history) {
    if (history.isEmpty()) {
      return Collections.emptyList();
    }

    List<ContactHistoryEntryDto> entries = new ArrayList<>(history.size());
    for (RevisionEntryWithChange<ContactAddress> next : history) {
      ContactAddress address = next.getEntity();

      entries.add(
          new ContactHistoryEntryDto(
              RevisionHistoryMapper.mapTypeToApi(next.getType()),
              next.getRevision().getId(),
              next.getRevision().getCreatedBy(),
              next.getRevision().getCreatedAt(),
              getContactId(address),
              new ContactAddressReference(address.getId(), getUsage(address)),
              mapContactAddressChangeToApi(next)));
    }

    return entries;
  }

  private static ContactAddressUsage getUsage(ContactAddress address) {
    if (address.getContactOfContactAddress() != null) {
      return ContactAddressUsage.CONTACT_ADDRESS;
    } else if (address.getContactOfDifferentBillingAddress() != null) {
      return ContactAddressUsage.DIFFERENT_BILLING_ADDRESS;
    } else {
      throw new IllegalStateException(
          "Addresses of contacts must either be a contactAddress of a differentBillingAddress but address(id=%s) was neither!"
              .formatted(address.getId()));
    }
  }

  private static UUID getContactId(ContactAddress address) {
    Long addressId = address.getId();
    Contact contactOfContactAddress = address.getContactOfContactAddress();
    Contact contactOfDifferentBillingAddress = address.getContactOfDifferentBillingAddress();
    if (contactOfContactAddress != null && contactOfDifferentBillingAddress != null) {
      throw new IllegalStateException(
          "Addresses of contacts can only be either a contactAddress OR a differentBillingAddress but address(id=%s) was used as both!"
              .formatted(addressId));
    } else if (contactOfContactAddress != null) {
      return contactOfContactAddress.getId();
    } else if (contactOfDifferentBillingAddress != null) {
      return contactOfDifferentBillingAddress.getId();
    } else {
      throw new IllegalStateException(
          "Addresses of contacts must either be a contactAddress of a differentBillingAddress but address(id=%s) was neither!"
              .formatted(addressId));
    }
  }

  private static ContactAddressChange mapContactAddressChangeToApi(
      RevisionEntryWithChange<ContactAddress> revision) {
    Set<String> fields = revision.getChangedFields();
    ContactAddress entity = revision.getEntity();
    return switch (entity) {
      case null -> null;
      case DomesticContactAddress domesticContactAddress ->
          mapDomesticContactAddressChangeToApi(fields, domesticContactAddress);
      case PostboxContactAddress postboxContactAddress ->
          mapPostboxContactAddressChangeToApi(fields, postboxContactAddress);
      default ->
          throw new UnsupportedOperationException(
              "Unknown ContactAddress type: %s".formatted(entity.getClass()));
    };
  }

  private static DomesticContactAddressChange mapDomesticContactAddressChangeToApi(
      Set<String> fields, DomesticContactAddress entity) {
    return new DomesticContactAddressChange(
        newChange(fields.contains(DomesticContactAddress_.COUNTRY), entity.getCountry()),
        newChange(fields.contains(DomesticContactAddress_.CITY), entity.getCity()),
        newChange(fields.contains(DomesticContactAddress_.POSTAL_CODE), entity.getPostalCode()),
        newChange(
            fields.contains(DomesticContactAddress_.DIFFERENT_NAME), entity.getDifferentName()),
        newChange(fields.contains(DomesticContactAddress_.STREET), entity.getStreet()),
        newChange(fields.contains(DomesticContactAddress_.HOUSE_NUMBER), entity.getHouseNumber()),
        newChange(
            fields.contains(DomesticContactAddress_.ADDRESS_ADDITION),
            entity.getAddressAddition()));
  }

  private static PostboxContactAddressChange mapPostboxContactAddressChangeToApi(
      Set<String> fields, PostboxContactAddress entity) {
    return new PostboxContactAddressChange(
        newChange(fields.contains(PostboxContactAddress_.COUNTRY), entity.getCountry()),
        newChange(fields.contains(PostboxContactAddress_.CITY), entity.getCity()),
        newChange(fields.contains(PostboxContactAddress_.POSTAL_CODE), entity.getPostalCode()),
        newChange(
            fields.contains(PostboxContactAddress_.DIFFERENT_NAME), entity.getDifferentName()),
        newChange(fields.contains(PostboxContactAddress_.POSTBOX), entity.getPostbox()));
  }

  public static HistoryStep<ContactDto> mapContactRevisionToApi(
      RevisionPair<Contact> step, UserRepresentation resolvedUser) {
    return new HistoryStep<>(
        step.before() != null ? mapContactToApi_ignoreMerge(step.before().getEntity()) : null,
        mapContactToApi_ignoreMerge(step.after().getEntity()),
        RevisionHistoryMapper.mapTypeToApi(step.after().getType()),
        step.after().getRevision().getCreatedBy(),
        resolvedUser != null ? UserMapper.mapUserToApi(resolvedUser) : null,
        step.after().getRevision().getCreatedAt(),
        step.after().getChangedFields().stream().sorted().toList());
  }

  public static HistoryStep<AddressDto> mapAddressRevisionToApi(
      RevisionPair<ContactAddress> step, UserRepresentation resolvedUser) {
    return new HistoryStep<>(
        step.before() != null ? mapAddressToApi(step.before().getEntity()) : null,
        mapAddressToApi(step.after().getEntity()),
        RevisionHistoryMapper.mapTypeToApi(step.after().getType()),
        step.after().getRevision().getCreatedBy(),
        resolvedUser != null ? UserMapper.mapUserToApi(resolvedUser) : null,
        step.after().getRevision().getCreatedAt(),
        step.after().getChangedFields().stream().sorted().toList());
  }

  private static InstitutionContactCategoryDto mapInstitutionContactCategoryToApi(
      InstitutionContactCategory category) {
    return switch (category) {
      case null -> null;
      case LABORATORY -> InstitutionContactCategoryDto.LABORATORY;
      case SCHOOL -> InstitutionContactCategoryDto.SCHOOL;
      case DOCTORS_OFFICE -> InstitutionContactCategoryDto.DOCTORS_OFFICE;
      case HEALTH_DEPARTMENT -> InstitutionContactCategoryDto.HEALTH_DEPARTMENT;
      case MISC -> InstitutionContactCategoryDto.MISC;
      case DAYCARE -> InstitutionContactCategoryDto.DAYCARE;
    };
  }

  private static AddressDto mapAddressToApi(ContactAddress address) {
    return switch (address) {
      case null -> null;
      case DomesticContactAddress domesticAddress -> mapDomesticAddressToApi(domesticAddress);
      case PostboxContactAddress postboxAddress -> mapPostboxAddressToApi(postboxAddress);
      default ->
          throw new UnsupportedOperationException(
              "Unknown ContactAddress type: %s".formatted(address.getClass()));
    };
  }

  public static PageSpec mapToPageSpec(
      int pageNumber, int pageSize, ContactSortKey sortKey, SortDirection direction) {
    return new PageSpec(pageNumber, pageSize, mapToSortOrder(sortKey, direction));
  }

  private static Sort.Order mapToSortOrder(ContactSortKey sortKey, SortDirection direction) {
    return new Sort.Order(mapDirection(direction), mapSortField(sortKey));
  }

  private static String mapSortField(ContactSortKey sortKey) {
    return switch (sortKey) {
      case null -> ContactService.TYPE_SORT_KEY;
      case ContactSortKey.NAME -> Contact_.NAME;
      case ContactSortKey.TYPE -> ContactService.TYPE_SORT_KEY;
      case ContactSortKey.RELEVANCE -> ContactService.RELEVANCE_SORT_KEY;
      case ContactSortKey.CATEGORY -> ContactService.CATEGORY_SORT_KEY;
    };
  }
}
