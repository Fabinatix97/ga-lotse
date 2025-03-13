/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.mapper;

import static de.eshg.base.address.mapper.AddressMapper.mapAddressToApi;
import static de.eshg.base.util.MappingUtil.extractStrings;
import static de.eshg.base.util.MappingUtil.mapDataOriginToApi;
import static de.eshg.base.util.MappingUtil.mapDataOriginToDm;
import static de.eshg.base.util.MappingUtil.mapGenderToApi;
import static de.eshg.base.util.MappingUtil.mapGenderToDm;
import static de.eshg.base.util.MappingUtil.mapSalutationToApi;
import static de.eshg.base.util.MappingUtil.mapSalutationToDm;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.api.facility.*;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.util.FacilityContactPersonsDiffWrapper;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.lang3.builder.Diff;
import org.apache.commons.lang3.builder.DiffResult;
import org.springframework.stereotype.Component;

@Component
public class FacilityMapper {

  private static final ArrayList<String> CONTACT_PERSON_FIELD_NAMES =
      new ArrayList<String>(
          Arrays.asList(
              "emailAddress",
              "firstName",
              "lastName",
              "role",
              "title",
              "phoneNumber",
              "salutation",
              "gender"));

  public static AddFacilityFileStateResponse mapFacilityFileStateToApi(Facility facility) {
    return new AddFacilityFileStateResponse(
        facility.getExternalId(),
        facility.getName(),
        extractStrings(facility.getEmailAddresses(), FacilityEmailAddress::getEmailAddress),
        extractStrings(facility.getPhoneNumbers(), FacilityPhoneNumber::getPhoneNumber),
        facility.getReferenceVersion(),
        mapContactPersonsToApi(facility.getContactPersons()),
        mapAddressToApi(facility.getContactAddress()),
        mapAddressToApi(facility.getDifferentBillingAddress()),
        mapDataOriginToApi(facility.getDataOrigin()));
  }

  public static GetReferenceFacilityResponse mapReferenceFacilityToApi(Facility referenceFacility) {
    return new GetReferenceFacilityResponse(
        referenceFacility.getExternalId(),
        referenceFacility.getVersion(),
        referenceFacility.getName(),
        extractStrings(
            referenceFacility.getEmailAddresses(), FacilityEmailAddress::getEmailAddress),
        extractStrings(referenceFacility.getPhoneNumbers(), FacilityPhoneNumber::getPhoneNumber),
        mapContactPersonsToApi(referenceFacility.getContactPersons()),
        mapAddressToApi(referenceFacility.getContactAddress()),
        mapAddressToApi(referenceFacility.getDifferentBillingAddress()),
        mapDataOriginToApi(referenceFacility.getDataOrigin()));
  }

  public static GetFacilityFileStateResponse mapFacilityToGetFacilityFileStateResponse(
      Facility facility, Boolean outdated) {
    return new GetFacilityFileStateResponse(
        facility.getExternalId(),
        facility.getName(),
        extractStrings(facility.getEmailAddresses(), FacilityEmailAddress::getEmailAddress),
        extractStrings(facility.getPhoneNumbers(), FacilityPhoneNumber::getPhoneNumber),
        facility.getReferenceVersion(),
        mapContactPersonsToApi(facility.getContactPersons()),
        mapAddressToApi(facility.getContactAddress()),
        mapAddressToApi(facility.getDifferentBillingAddress()),
        outdated,
        mapDataOriginToApi(facility.getDataOrigin()));
  }

  public static GetFacilityFileStatesResponse mapToGetFacilityFileStatesResponse(
      List<UUID> queryIds, List<Facility> foundFileStates, Map<UUID, Boolean> outdated) {
    Map<UUID, GetFacilityFileStateResponse> mappedFacilitiesById =
        mapToApiAndGroupById(foundFileStates, outdated);

    List<GetFacilityFileStateResponse> facilityResponses = new ArrayList<>();
    List<UUID> notFoundFacilityIds = new ArrayList<>();

    for (UUID id : queryIds) {
      GetFacilityFileStateResponse facilityDto = mappedFacilitiesById.get(id);
      if (facilityDto != null) {
        facilityResponses.add(facilityDto);
      } else {
        notFoundFacilityIds.add(id);
      }
    }

    return new GetFacilityFileStatesResponse(facilityResponses, notFoundFacilityIds);
  }

  private static FacilityDetailsDto mapFacilityDetailsToApi(Facility facility) {
    return new FacilityDetailsDto(
        facility.getName(),
        extractStrings(facility.getEmailAddresses(), FacilityEmailAddress::getEmailAddress),
        extractStrings(facility.getPhoneNumbers(), FacilityPhoneNumber::getPhoneNumber),
        mapContactPersonsToApi(facility.getContactPersons()),
        mapAddressToApi(facility.getContactAddress()),
        mapAddressToApi(facility.getDifferentBillingAddress()));
  }

  private static Map<UUID, GetFacilityFileStateResponse> mapToApiAndGroupById(
      List<Facility> facilities, Map<UUID, Boolean> isOutdated) {
    return facilities.stream()
        .map(
            facility ->
                FacilityMapper.mapFacilityToGetFacilityFileStateResponse(
                    facility, isOutdated.getOrDefault(facility.getExternalId(), null)))
        .collect(Collectors.toMap(GetFacilityFileStateResponse::id, Function.identity()));
  }

  private static List<FacilityContactPersonDto> mapContactPersonsToApi(
      List<FacilityContactPerson> contactPersons) {
    if (contactPersons == null) {
      return Collections.emptyList();
    }
    return contactPersons.stream()
        .sorted(byLastNameFirstNameId())
        .map(FacilityMapper::mapContactPersonToApi)
        .toList();
  }

  private static Comparator<FacilityContactPerson> byLastNameFirstNameId() {
    return Comparator.comparing(FacilityContactPerson::getLastName)
        .thenComparing(
            FacilityContactPerson::getFirstName, Comparator.nullsLast(Comparator.naturalOrder()))
        .thenComparing(FacilityContactPerson::getId);
  }

  private static FacilityContactPersonDto mapContactPersonToApi(
      FacilityContactPerson facilityContactPerson) {
    return new FacilityContactPersonDto(
        facilityContactPerson.getEmailAddress(),
        facilityContactPerson.getPhoneNumber(),
        facilityContactPerson.getRole(),
        facilityContactPerson.getLastName(),
        facilityContactPerson.getFirstName(),
        facilityContactPerson.getTitle(),
        mapSalutationToApi(facilityContactPerson.getSalutation()),
        mapGenderToApi(facilityContactPerson.getGender()),
        facilityContactPerson.isMainContact());
  }

  public static Facility mapFacilityToDm(AddFacilityFileStateRequest request) {
    Facility facility = mapBaseFacilityToDm(request);
    facility.setDataOrigin(mapDataOriginToDm(request.dataOrigin()));
    return facility;
  }

  public static Facility mapFacilityToDm(ExternalAddFacilityFileStateRequest request) {
    return mapBaseFacilityToDm(request);
  }

  public static Facility mapFacilityToDm(UpdateReferenceFacilityRequest request) {
    return mapBaseFacilityToDm(request.facilityDetails());
  }

  public static Facility mapFacilityToDm(PutFacilityRequest request) {
    return mapBaseFacilityToDm(request.updatedFacility());
  }

  private static Facility mapBaseFacilityToDm(FacilityDetails request) {
    Facility facility = new Facility();
    facility.setName(request.name());
    facility.addEmailAddresses(mapEmailAddressesToDm(request.emailAddresses()));
    facility.addPhoneNumbers(mapPhoneNumbersToDm(request.phoneNumbers()));
    facility.setContactAddress(mapAddressToDm(request.contactAddress()));
    facility.setDifferentBillingAddress(mapAddressToDm(request.differentBillingAddress()));
    facility.addContactPersons(mapContactPersonsToDm(request.contactPersons(), facility));
    return facility;
  }

  public static List<FacilityEmailAddress> mapEmailAddressesToDm(List<String> emailAddresses) {
    if (emailAddresses == null) {
      return List.of();
    }
    return emailAddresses.stream().map(FacilityMapper::mapEmailAddressToDm).toList();
  }

  private static FacilityEmailAddress mapEmailAddressToDm(String emailAddress) {
    FacilityEmailAddress facilityEmailAddress = new FacilityEmailAddress();
    facilityEmailAddress.setEmailAddress(emailAddress);
    return facilityEmailAddress;
  }

  public static List<FacilityPhoneNumber> mapPhoneNumbersToDm(List<String> phoneNumbers) {
    if (phoneNumbers == null) {
      return List.of();
    }
    return phoneNumbers.stream().map(FacilityMapper::mapPhoneNumberToDm).toList();
  }

  private static FacilityPhoneNumber mapPhoneNumberToDm(String phoneNumber) {
    FacilityPhoneNumber facilityPhoneNumber = new FacilityPhoneNumber();
    facilityPhoneNumber.setPhoneNumber(phoneNumber);
    return facilityPhoneNumber;
  }

  public static FacilityAddress mapAddressToDm(AddressDto address) {
    return switch (address) {
      case null -> null;
      case PostboxAddressDto postboxAddress ->
          AddressMapper.mapPostboxAddressIntoDm(postboxAddress, new PostboxFacilityAddress());
      case DomesticAddressDto domesticAddress ->
          AddressMapper.mapDomesticAddressIntoDm(domesticAddress, new DomesticFacilityAddress());
    };
  }

  public static List<FacilityContactPerson> mapContactPersonsToDm(
      List<FacilityContactPersonDto> contactPersons, Facility facility) {
    if (contactPersons == null) {
      return List.of();
    }

    return contactPersons.stream().map(c -> mapContactPersonToDm(c, facility)).toList();
  }

  private static FacilityContactPerson mapContactPersonToDm(
      FacilityContactPersonDto contactPerson, Facility facility) {
    FacilityContactPerson facilityContactPerson = new FacilityContactPerson();
    facilityContactPerson.setFacility(facility);
    facilityContactPerson.setEmailAddress(contactPerson.emailAddress());
    facilityContactPerson.setFirstName(contactPerson.firstName());
    facilityContactPerson.setLastName(contactPerson.lastName());
    facilityContactPerson.setRole(contactPerson.role());
    facilityContactPerson.setTitle(contactPerson.title());
    facilityContactPerson.setPhoneNumber(contactPerson.phoneNumber());
    facilityContactPerson.setSalutation(mapSalutationToDm(contactPerson.salutation()));
    facilityContactPerson.setGender(mapGenderToDm(contactPerson.gender()));
    facilityContactPerson.setMainContact(Boolean.TRUE.equals(contactPerson.mainContact()));
    return facilityContactPerson;
  }

  public static DiffDto<FacilityDetailsDto> mapToDiffDto(
      DiffResult<Facility> diff, Facility facilityFileState, Facility facilityReference) {
    List<String> differingFields = diff.getDiffs().stream().map(Diff::getFieldName).toList();
    return new DiffDto<>(
        differingFields,
        mapFacilityDetailsToApi(facilityFileState),
        mapFacilityDetailsToApi(facilityReference));
  }

  public static List<FacilityContactPersonDiffDto> mapContactPersonsDiffToApi(
      FacilityContactPersonsDiffWrapper contactPersonsDiffs) {
    ArrayList<FacilityContactPersonDiffDto> contactPersonDiffDtos = new ArrayList<>();

    contactPersonsDiffs
        .fileStateContactPersons()
        .forEach(
            d ->
                contactPersonDiffDtos.add(
                    new FacilityContactPersonDiffDto(
                        new DiffDto<>(
                            CONTACT_PERSON_FIELD_NAMES, mapContactPersonToApi(d), null))));
    contactPersonsDiffs
        .referenceContactPersons()
        .forEach(
            d ->
                contactPersonDiffDtos.add(
                    new FacilityContactPersonDiffDto(
                        new DiffDto<>(
                            CONTACT_PERSON_FIELD_NAMES, null, mapContactPersonToApi(d)))));

    return contactPersonDiffDtos;
  }
}
