/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import static java.util.Collections.emptyList;

import de.eshg.base.address.persistence.embeddable.EmbeddableDomesticAddress;
import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.contact.persistence.ContactService;
import de.eshg.base.contact.persistence.entity.*;
import de.eshg.base.statistics.api.BaseAttribute;
import de.eshg.base.statistics.api.BaseAvailableDataSource;
import de.eshg.base.statistics.api.BaseDataTableHeader;
import de.eshg.base.statistics.api.GetBaseDataSourcesResponse;
import de.eshg.base.statistics.api.GetBaseStatisticsDataRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataResponse;
import de.eshg.base.statistics.api.GetBaseStatisticsDataTableHeaderRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataTableHeaderResponse;
import de.eshg.base.statistics.api.SubjectType;
import de.eshg.base.statistics.options.GenderOptions;
import de.eshg.base.street.DistrictDto;
import de.eshg.base.street.SearchStreetResponse;
import de.eshg.base.street.StreetController;
import de.eshg.base.util.Gender;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Hidden
public class StatisticsController implements BaseStatisticsApi {
  private final FacilityRepository facilityRepository;
  private final PersonRepository personRepository;
  private final StreetController streetController;
  private final ContactService contactService;

  public StatisticsController(
      FacilityRepository facilityRepository,
      PersonRepository personRepository,
      StreetController streetController,
      ContactService contactService) {
    this.facilityRepository = facilityRepository;
    this.personRepository = personRepository;
    this.streetController = streetController;
    this.contactService = contactService;
  }

  @Override
  public GetBaseDataSourcesResponse getAvailableDataSources() {
    return new GetBaseDataSourcesResponse(
        List.of(
            new BaseAvailableDataSource(
                SubjectType.PERSON,
                mapToAttributes(
                    Stream.concat(
                        Arrays.stream(PersonAttribute.values()),
                        Arrays.stream(AddressAttribute.values())))),
            new BaseAvailableDataSource(
                SubjectType.FACILITY, mapToAttributes(Arrays.stream(AddressAttribute.values()))),
            new BaseAvailableDataSource(
                SubjectType.CONTACT,
                mapToAttributes(
                    Stream.concat(
                        Arrays.stream(ContactAttribute.values()),
                        Arrays.stream(AddressAttribute.values()))))));
  }

  private List<BaseAttribute> mapToAttributes(Stream<CommonAttribute> commonAttributeStream) {
    return commonAttributeStream.map(StatisticsController::mapToAttribute).toList();
  }

  private static BaseAttribute mapToAttribute(CommonAttribute commonAttribute) {
    return new BaseAttribute(
        commonAttribute.getName(),
        commonAttribute.getCode(),
        commonAttribute.getType(),
        null,
        commonAttribute.getValueOptions(),
        commonAttribute.isMandatory(),
        DataPrivacyCategory.QUASI_IDENTIFYING,
        commonAttribute.getIntervalConfiguration());
  }

  @Override
  @Transactional(readOnly = true)
  public GetBaseStatisticsDataTableHeaderResponse getDataTableHeader(
      GetBaseStatisticsDataTableHeaderRequest getDataTableHeaderRequest) {
    List<String> attributeCodes = getDataTableHeaderRequest.attributeCodes();
    GetBaseStatisticsDataResponse dataResponse =
        switch (getSubjectType(getDataTableHeaderRequest.dataSourceName())) {
          case PERSON -> getPersonFileStateResponse(attributeCodes, emptyList());
          case FACILITY -> getFacilityFileStateResponse(attributeCodes, emptyList());
          case CONTACT -> getContactResponse(attributeCodes, emptyList());
        };
    return new GetBaseStatisticsDataTableHeaderResponse(dataResponse.dataTableHeader());
  }

  @Override
  @Transactional(readOnly = true)
  public GetBaseStatisticsDataResponse getSpecificData(
      GetBaseStatisticsDataRequest getSpecificDataRequest) {
    List<String> attributeCodes = getSpecificDataRequest.attributeCodes();
    List<UUID> baseIds = getSpecificDataRequest.baseIds();
    return switch (getSubjectType(getSpecificDataRequest.dataSourceName())) {
      case PERSON -> getPersonFileStateResponse(attributeCodes, baseIds);
      case FACILITY -> getFacilityFileStateResponse(attributeCodes, baseIds);
      case CONTACT -> getContactResponse(attributeCodes, baseIds);
    };
  }

  private static SubjectType getSubjectType(String dataSourceName) {
    return Arrays.stream(SubjectType.values())
        .filter(sT -> sT.name().equals(dataSourceName))
        .findFirst()
        .orElseThrow(
            () ->
                new BadRequestException(
                    "Data source with name '%s' not found".formatted(dataSourceName)));
  }

  private GetBaseStatisticsDataResponse getPersonFileStateResponse(
      List<String> attributeCodes, List<UUID> centralFileIds) {
    List<CommonAttribute> relevantCommonAttributes = getRelevantPersonAttributes(attributeCodes);
    if (relevantCommonAttributes.isEmpty()) {
      return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(emptyList()), null);
    }

    List<BaseAttribute> attributes = getAttributes(relevantCommonAttributes, SubjectType.PERSON);

    List<Person> persons =
        personRepository.findAllByExternalIdInAndReferencePersonIsNotNullOrderById(centralFileIds);
    List<DataRow> dataRows =
        persons.stream().map(person -> createDataRow(person, relevantCommonAttributes)).toList();

    return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(attributes), dataRows);
  }

  private List<CommonAttribute> getRelevantPersonAttributes(List<String> attributeCodes) {
    List<CommonAttribute> commonAttributes = new ArrayList<>();
    for (String attributeCode : attributeCodes) {
      Optional<PersonAttribute> personAttributeOptional =
          getAttribute(attributeCode, PersonAttribute.values());
      if (personAttributeOptional.isPresent()) {
        commonAttributes.add(personAttributeOptional.get());
        continue;
      }
      Optional<AddressAttribute> addressAttributeOptional =
          getAttribute(attributeCode, AddressAttribute.values());
      addressAttributeOptional.ifPresent(commonAttributes::add);
    }
    return commonAttributes;
  }

  private static <T extends CommonAttribute> Optional<T> getAttribute(
      String attributeCode, T[] values) {
    return Arrays.stream(values)
        .filter(attribute -> attribute.getCode().equals(attributeCode))
        .findFirst();
  }

  private static List<BaseAttribute> getAttributes(
      List<? extends CommonAttribute> baseAttributes, SubjectType subjectType) {
    ValueType valueType = mapToValueType(subjectType);
    List<BaseAttribute> attributes = new ArrayList<>();
    attributes.add(
        new BaseAttribute(
            valueType.name(),
            valueType.name(),
            valueType,
            null,
            null,
            true,
            DataPrivacyCategory.QUASI_IDENTIFYING,
            null));
    baseAttributes.forEach(baseAttribute -> attributes.add(mapToAttribute(baseAttribute)));
    return attributes;
  }

  private static ValueType mapToValueType(SubjectType subjectType) {
    return switch (subjectType) {
      case CONTACT -> ValueType.CONTACT_ID;
      case FACILITY -> ValueType.CENTRAL_FILE_ID_FACILITY;
      case PERSON -> ValueType.CENTRAL_FILE_ID_PERSON;
    };
  }

  private DataRow createDataRow(Person person, List<CommonAttribute> commonAttributes) {
    List<Object> values = new ArrayList<>();
    values.add(person.getExternalId());

    PersonAddress address = person.getContactAddress();
    BasicAddressInfo basicAddressInfo = getBasicAddressInfo(address);
    DistrictDto districtDto = null;
    if (address instanceof DomesticPersonAddress domesticPersonAddress) {
      districtDto = getDistrictDto(domesticPersonAddress.getDelegate());
    }

    for (CommonAttribute attribute : commonAttributes) {
      if (attribute instanceof PersonAttribute personAttribute) {
        values.add(getPersonAttributeValue(person, personAttribute));
      }
      if (attribute instanceof AddressAttribute addressAttribute) {
        if (basicAddressInfo == null) {
          values.add(null);
        } else {
          values.add(getAddressAttributeValue(basicAddressInfo, districtDto, addressAttribute));
        }
      }
    }

    return new DataRow(values);
  }

  private Object getPersonAttributeValue(Person person, PersonAttribute personAttribute) {
    return switch (personAttribute) {
      case MONTH_OF_BIRTH -> getMonth(person.getBirthDetails());
      case YEAR_OF_BIRTH -> getYear(person.getBirthDetails());
      case PLACE_OF_BIRTH -> getPlace(person.getBirthDetails());
      case COUNTRY_OF_BIRTH_ISO -> getCountry(person.getBirthDetails());
      case GESCHL -> getGender(person.getGender());
    };
  }

  private Object getMonth(BirthDetails birthDetails) {
    if (birthDetails == null) {
      return null;
    }
    return String.valueOf(birthDetails.dateOfBirth().getMonth().getValue());
  }

  private Object getYear(BirthDetails birthDetails) {
    if (birthDetails == null) {
      return null;
    }
    return birthDetails.dateOfBirth().getYear();
  }

  private Object getPlace(BirthDetails birthDetails) {
    if (birthDetails == null) {
      return null;
    }
    return birthDetails.placeOfBirth();
  }

  private Object getCountry(BirthDetails birthDetails) {
    if (birthDetails == null) {
      return null;
    }
    return birthDetails.countryOfBirth();
  }

  private Object getGender(Gender gender) {
    return switch (gender) {
      case NOT_SPECIFIED -> GenderOptions.NOT_SPECIFIED.getValue();
      case DIVERSE -> GenderOptions.DIVERSE.getValue();
      case FEMALE -> GenderOptions.FEMALE.getValue();
      case MALE -> GenderOptions.MALE.getValue();
    };
  }

  private <T extends Address> BasicAddressInfo getBasicAddressInfo(T address) {
    if (address == null) {
      return null;
    } else {
      return new BasicAddressInfo(address.getCountry(), address.getCity(), address.getPostalCode());
    }
  }

  private DistrictDto getDistrictDto(EmbeddableDomesticAddress domesticAddress) {
    return getDistrictDto(
        domesticAddress.getStreet(),
        domesticAddress.getHouseNumber(),
        domesticAddress.getPostalCode(),
        domesticAddress.getCountry());
  }

  private DistrictDto getDistrictDto(
      String street, String houseNumber, String postalCode, CountryCode country) {
    try {
      SearchStreetResponse searchStreetResponse =
          streetController.searchStreet(street, houseNumber, postalCode, country);
      Set<DistrictDto> districts = searchStreetResponse.cityDistricts();
      if (districts.size() == 1) {
        return districts.iterator().next();
      } else {
        return null;
      }
    } catch (BadRequestException ignored) {
      return null;
    }
  }

  private Object getAddressAttributeValue(
      BasicAddressInfo basicAddressInfo,
      DistrictDto districtDto,
      AddressAttribute addressAttribute) {
    return switch (addressAttribute) {
      case LAND -> basicAddressInfo.countryCode().name();
      case ORT -> basicAddressInfo.city();
      case PLZ -> basicAddressInfo.postalCode();
      case BEZ -> districtDto == null ? null : districtDto.districtName();
      case STADT_BEZ -> districtDto == null ? null : districtDto.districtCode();
      case GEMEINDE_KEY -> districtDto == null ? null : districtDto.municipalityKey();
    };
  }

  private GetBaseStatisticsDataResponse getFacilityFileStateResponse(
      List<String> attributeCodes, List<UUID> centralFileIds) {
    List<AddressAttribute> relevantAddressAttributes = getRelevantAddressAttributes(attributeCodes);
    if (relevantAddressAttributes.isEmpty()) {
      return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(emptyList()), null);
    }
    List<BaseAttribute> attributes = getAttributes(relevantAddressAttributes, SubjectType.FACILITY);

    List<Facility> facilities =
        facilityRepository.findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(
            centralFileIds);
    List<DataRow> dataRows =
        facilities.stream()
            .map(facility -> createDataRow(facility, relevantAddressAttributes))
            .toList();

    return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(attributes), dataRows);
  }

  private List<AddressAttribute> getRelevantAddressAttributes(List<String> attributeCodes) {
    List<AddressAttribute> addressAttributes = new ArrayList<>();
    for (String attributeCode : attributeCodes) {
      Optional<AddressAttribute> addressAttributeOptional =
          getAttribute(attributeCode, AddressAttribute.values());
      addressAttributeOptional.ifPresent(addressAttributes::add);
    }
    return addressAttributes;
  }

  private DataRow createDataRow(Facility facility, List<AddressAttribute> addressAttributes) {
    List<Object> values = new ArrayList<>();
    values.add(facility.getExternalId());

    FacilityAddress address = facility.getContactAddress();
    BasicAddressInfo basicAddressInfo = getBasicAddressInfoFacility(address);
    DistrictDto districtDto = null;
    if (address instanceof DomesticFacilityAddress domesticFacilityAddress) {
      districtDto = getDistrictDto(domesticFacilityAddress.getDelegate());
    }

    for (AddressAttribute addressAttribute : addressAttributes) {
      if (basicAddressInfo == null) {
        values.add(null);
      } else {
        values.add(getAddressAttributeValue(basicAddressInfo, districtDto, addressAttribute));
      }
    }

    return new DataRow(values);
  }

  private BasicAddressInfo getBasicAddressInfoFacility(FacilityAddress facilityAddress) {
    if (facilityAddress == null) {
      return null;
    } else {
      return new BasicAddressInfo(
          facilityAddress.getCountry(), facilityAddress.getCity(), facilityAddress.getPostalCode());
    }
  }

  private GetBaseStatisticsDataResponse getContactResponse(
      List<String> attributeCodes, List<UUID> contactIds) {
    List<CommonAttribute> relevantContactAttributes = getRelevantContactAttributes(attributeCodes);
    if (relevantContactAttributes.isEmpty()) {
      return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(emptyList()), null);
    }

    List<BaseAttribute> attributes = getAttributes(relevantContactAttributes, SubjectType.CONTACT);

    List<Contact> contacts = contactService.findAllById(contactIds);
    List<DataRow> dataRows =
        contacts.stream()
            .map(contact -> createDataRow(contact, relevantContactAttributes))
            .toList();

    return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(attributes), dataRows);
  }

  private List<CommonAttribute> getRelevantContactAttributes(List<String> attributeCodes) {
    List<CommonAttribute> commonAttributes = new ArrayList<>();
    for (String attributeCode : attributeCodes) {
      Optional<ContactAttribute> contactAttributeOptional =
          getAttribute(attributeCode, ContactAttribute.values());
      if (contactAttributeOptional.isPresent()) {
        commonAttributes.add(contactAttributeOptional.get());
        continue;
      }

      Optional<AddressAttribute> addressAttributeOptional =
          getAttribute(attributeCode, AddressAttribute.values());
      addressAttributeOptional.ifPresent(commonAttributes::add);
    }
    return commonAttributes;
  }

  private DataRow createDataRow(Contact contact, List<CommonAttribute> contactAttributes) {
    List<Object> values = new ArrayList<>();
    values.add(contact.getExternalId());

    ContactAddress address = contact.getContactAddress();
    BasicAddressInfo basicAddressInfo = getBasicAddressInfo(address);
    DistrictDto districtDto = null;
    if (address instanceof DomesticContactAddress domesticContactAddress) {
      districtDto =
          getDistrictDto(
              domesticContactAddress.getStreet(),
              domesticContactAddress.getHouseNumber(),
              domesticContactAddress.getPostalCode(),
              domesticContactAddress.getCountry());
    }

    for (CommonAttribute attribute : contactAttributes) {
      if (contact instanceof InstitutionContact institutionContact) {
        if (attribute instanceof ContactAttribute contactAttribute) {
          values.add(getContactAttributeValues(contactAttribute, institutionContact));
        }
        if (attribute instanceof AddressAttribute addressAttribute && basicAddressInfo != null) {
          values.add(getAddressAttributeValue(basicAddressInfo, districtDto, addressAttribute));
        }
      } else {
        values.add(null);
      }
    }

    return new DataRow(values);
  }

  private Object getContactAttributeValues(
      ContactAttribute contactAttribute, InstitutionContact institutionContact) {
    return switch (contactAttribute) {
      case ContactAttribute.NAME -> institutionContact.getName();
      case ContactAttribute.OBJECT_TYPE -> mapContactObjectType(institutionContact.getCategory());
      case ContactAttribute.OBJECT_SUB_TYPE ->
          mapContactObjectSubType(institutionContact.getSubCategory());
    };
  }

  private String mapContactObjectType(InstitutionContactCategory category) {
    return switch (category) {
      case LABORATORY -> "LABORATORY";
      case SCHOOL -> "SCHOOL";
      case DOCTORS_OFFICE -> "DOCTORS_OFFICE";
      case HEALTH_DEPARTMENT -> "HEALTH_DEPARTMENT";
      case MISC -> "MISC";
      case DAYCARE -> "DAYCARE";
    };
  }

  private String mapContactObjectSubType(InstitutionContactSubCategory subCategory) {
    return switch (subCategory) {
      case null -> null;
      case BERUFSSCHULE -> "BERUFSSCHULE";
      case FOERDERSCHULE -> "FOERDERSCHULE";
      case GRUNDSCHULE -> "GRUNDSCHULE";
      case GRUND_HAUPTSCHULE -> "GRUND_HAUPTSCHULE";
      case GRUND_HAUPT_REALSCHULE -> "GRUND_HAUPT_REALSCHULE";
      case GYMNASIUM -> "GYMNASIUM";
      case HAUPTSCHULE -> "HAUPTSCHULE";
      case HAUPT_REALSCHULE -> "HAUPT_REALSCHULE";
      case INTEGRIERTE_GESAMTSCHULE -> "INTEGRIERTE_GESAMTSCHULE";
      case KOOPERATIVE_GESAMTSCHULE -> "KOOPERATIVE_GESAMTSCHULE";
      case REALSCHULE -> "REALSCHULE";
    };
  }

  private record BasicAddressInfo(CountryCode countryCode, String city, String postalCode) {}
}
