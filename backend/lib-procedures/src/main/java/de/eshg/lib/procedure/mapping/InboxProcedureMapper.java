/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import static de.eshg.lib.procedure.domain.model.InboxProcedureStatus.OPEN;

import de.eshg.lib.procedure.domain.model.Address;
import de.eshg.lib.procedure.domain.model.ContactDetails;
import de.eshg.lib.procedure.domain.model.ContactType;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.InboxProcedure;
import de.eshg.lib.procedure.domain.model.InboxProcedureStatus;
import de.eshg.lib.procedure.domain.model.InboxProgressEntry;
import de.eshg.lib.procedure.domain.model.InboxProgressEntryType;
import de.eshg.lib.procedure.domain.model.Title;
import de.eshg.lib.procedure.model.AbstractFileReferenceDto;
import de.eshg.lib.procedure.model.ContactDetailsDto;
import de.eshg.lib.procedure.model.ContactTypeDto;
import de.eshg.lib.procedure.model.CreateInboxProcedureRequest;
import de.eshg.lib.procedure.model.CreateInboxProgressEntryDto;
import de.eshg.lib.procedure.model.InboxProcedureAddressDto;
import de.eshg.lib.procedure.model.InboxProcedureDto;
import de.eshg.lib.procedure.model.InboxProcedureStatusDto;
import de.eshg.lib.procedure.model.InboxProgressEntryDto;
import de.eshg.lib.procedure.model.InboxProgressEntryTypeDto;
import de.eshg.lib.procedure.model.TitleDto;
import java.time.Clock;
import java.util.function.Function;

public final class InboxProcedureMapper {
  private InboxProcedureMapper() {}

  public static InboxProcedure createInboxProcedure(
      CreateInboxProcedureRequest createInboxProcedureRequest, Clock clock) {
    InboxProcedure inboxProcedure = new InboxProcedure();
    inboxProcedure.updateInboxProcedureStatus(OPEN, clock);
    inboxProcedure.setProcedureType(
        ProcedureMapper.toDomainType(createInboxProcedureRequest.inboxProcedureType()));
    inboxProcedure.addInboxProgressEntry(
        InboxProcedureMapper.toDomainType(createInboxProcedureRequest.inboxProgressEntry()));
    inboxProcedure.addContactDetails(
        InboxProcedureMapper.toDomainType(createInboxProcedureRequest.contactDetails()));
    return inboxProcedure;
  }

  public static InboxProcedureStatus toDomainType(InboxProcedureStatusDto inboxProcedureStatus) {
    return switch (inboxProcedureStatus) {
      case OPEN -> OPEN;
      case CLOSED -> InboxProcedureStatus.CLOSED;
    };
  }

  private static InboxProgressEntry toDomainType(CreateInboxProgressEntryDto inboxProgressEntry) {
    InboxProgressEntry domainType = new InboxProgressEntry();
    domainType.setSubject(inboxProgressEntry.subject());
    domainType.setMessageText(inboxProgressEntry.messageText());
    domainType.setInboxProgressEntryType(toDomainType(inboxProgressEntry.inboxProgressEntryType()));
    return domainType;
  }

  public static InboxProgressEntryType toDomainType(
      InboxProgressEntryTypeDto inboxProgressEntryType) {
    return switch (inboxProgressEntryType) {
      case LETTER -> InboxProgressEntryType.LETTER;
      case PHONE_CALL -> InboxProgressEntryType.PHONE_CALL;
      case EMAIL -> InboxProgressEntryType.EMAIL;
    };
  }

  private static ContactDetails toDomainType(ContactDetailsDto contactDetails) {
    ContactDetails domainType = new ContactDetails();
    domainType.setContactType(toDomainType(contactDetails.contactType()));
    domainType.setFacilityName(contactDetails.facilityName());
    domainType.setFirstName(contactDetails.firstName());
    domainType.setLastName(contactDetails.lastName());
    domainType.setTitle(toDomainType(contactDetails.title()));
    domainType.setDateOfBirth(contactDetails.dateOfBirth());
    domainType.setEmailAddress(contactDetails.emailAddress());
    domainType.setPhoneNumber(contactDetails.phoneNumber());
    domainType.addAddress(toDomainType(contactDetails.address()));
    return domainType;
  }

  private static ContactType toDomainType(ContactTypeDto contactType) {
    return switch (contactType) {
      case PRIVATE_PERSON -> ContactType.PRIVATE_PERSON;
      case FACILITY -> ContactType.FACILITY;
    };
  }

  private static Title toDomainType(TitleDto title) {
    return switch (title) {
      case null -> null;
      case DR -> Title.DR;
      case PROF -> Title.PROF;
      case PROF_DR -> Title.PROF_DR;
    };
  }

  private static Address toDomainType(InboxProcedureAddressDto address) {
    if (address == null) {
      return null;
    }

    Address domainType = new Address();
    domainType.setPostboxNumber(address.postboxNumber());
    domainType.setStreet(address.street());
    domainType.setHouseNumber(address.houseNumber());
    domainType.setAddressAddition(address.addressAddition());
    domainType.setPostalCode(address.postalCode());
    domainType.setCity(address.city());
    domainType.setCountry(address.country());
    return domainType;
  }

  public static InboxProcedureDto toInterfaceType(InboxProcedure inboxProcedure) {
    return toInterfaceType(inboxProcedure, FileMapper::toInterfaceTypeAsReference);
  }

  public static InboxProcedureDto toInterfaceTypeWithResolvedFile(InboxProcedure inboxProcedure) {
    return toInterfaceType(inboxProcedure, FileMapper::toInterfaceType);
  }

  private static InboxProcedureDto toInterfaceType(
      InboxProcedure inboxProcedure, Function<File, AbstractFileReferenceDto> fileMapper) {
    return new InboxProcedureDto(
        inboxProcedure.getExternalId(),
        ProcedureMapper.toInterfaceType(inboxProcedure.getProcedureType()),
        toInterfaceType(inboxProcedure.getInboxProcedureStatus()),
        inboxProcedure.getCreatedBy(),
        inboxProcedure.getCreatedAt(),
        inboxProcedure.getClosedAt(),
        toInterfaceType(inboxProcedure.getInboxProgressEntry(), fileMapper),
        toInterfaceType(inboxProcedure.getContactDetails()));
  }

  private static InboxProcedureStatusDto toInterfaceType(
      InboxProcedureStatus inboxProcedureStatus) {
    return switch (inboxProcedureStatus) {
      case OPEN -> InboxProcedureStatusDto.OPEN;
      case CLOSED -> InboxProcedureStatusDto.CLOSED;
    };
  }

  private static InboxProgressEntryDto toInterfaceType(
      InboxProgressEntry inboxProgressEntry, Function<File, AbstractFileReferenceDto> fileMapper) {
    return new InboxProgressEntryDto(
        inboxProgressEntry.getExternalId(),
        inboxProgressEntry.getSubject(),
        inboxProgressEntry.getMessageText(),
        toInterfaceType(inboxProgressEntry.getInboxProgressEntryType()),
        fileMapper.apply(inboxProgressEntry.getFile()));
  }

  private static InboxProgressEntryTypeDto toInterfaceType(
      InboxProgressEntryType inboxProgressEntryType) {
    return switch (inboxProgressEntryType) {
      case LETTER -> InboxProgressEntryTypeDto.LETTER;
      case EMAIL -> InboxProgressEntryTypeDto.EMAIL;
      case PHONE_CALL -> InboxProgressEntryTypeDto.PHONE_CALL;
    };
  }

  private static ContactDetailsDto toInterfaceType(ContactDetails contactDetails) {
    return new ContactDetailsDto(
        toInterfaceType(contactDetails.getContactType()),
        contactDetails.getFacilityName(),
        contactDetails.getFirstName(),
        contactDetails.getLastName(),
        toInterfaceType(contactDetails.getTitle()),
        contactDetails.getDateOfBirth(),
        contactDetails.getEmailAddress(),
        contactDetails.getPhoneNumber(),
        toInterfaceType(contactDetails.getAddress()));
  }

  private static ContactTypeDto toInterfaceType(ContactType contactType) {
    return switch (contactType) {
      case PRIVATE_PERSON -> ContactTypeDto.PRIVATE_PERSON;
      case FACILITY -> ContactTypeDto.FACILITY;
    };
  }

  private static TitleDto toInterfaceType(Title title) {
    return switch (title) {
      case null -> null;
      case DR -> TitleDto.DR;
      case PROF -> TitleDto.PROF;
      case PROF_DR -> TitleDto.PROF_DR;
    };
  }

  private static InboxProcedureAddressDto toInterfaceType(Address address) {
    if (address == null) {
      return null;
    }

    return new InboxProcedureAddressDto(
        address.getPostboxNumber(),
        address.getStreet(),
        address.getHouseNumber(),
        address.getAddressAddition(),
        address.getPostalCode(),
        address.getCity(),
        address.getCountry());
  }
}
