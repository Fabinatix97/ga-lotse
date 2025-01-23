/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics;

import de.eshg.base.address.persistence.embeddable.EmbeddableDomesticAddress;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.centralfile.persistence.repository.FacilityRepository;
import de.eshg.base.centralfile.persistence.repository.PersonRepository;
import de.eshg.base.contact.persistence.ContactService;
import de.eshg.base.contact.persistence.entity.Contact;
import de.eshg.base.contact.persistence.entity.InstitutionContact;
import de.eshg.base.contact.persistence.entity.InstitutionContactCategory;
import de.eshg.base.statistics.api.BaseAttribute;
import de.eshg.base.statistics.api.BaseAvailableDataSource;
import de.eshg.base.statistics.api.BaseDataTableHeader;
import de.eshg.base.statistics.api.GetBaseDataSourcesResponse;
import de.eshg.base.statistics.api.GetBaseStatisticsDataRequest;
import de.eshg.base.statistics.api.GetBaseStatisticsDataResponse;
import de.eshg.base.statistics.api.SubjectType;
import de.eshg.base.statistics.options.GenderOptions;
import de.eshg.base.street.DistrictDto;
import de.eshg.base.street.SearchStreetResponse;
import de.eshg.base.street.StreetController;
import de.eshg.base.util.Gender;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.ValueType;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
                SubjectType.CONTACT, mapToAttributes(Arrays.stream(ContactAttributes.values())))));
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
        commonAttribute.isMandatory());
  }

  @Override
  @Transactional(readOnly = true)
  public GetBaseStatisticsDataResponse getSpecificData(
      GetBaseStatisticsDataRequest getSpecificDataRequest) {
    SubjectType subjectType =
        Arrays.stream(SubjectType.values())
            .filter(sT -> sT.name().equals(getSpecificDataRequest.dataSourceName()))
            .findFirst()
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "Data source with name '%s' not found"
                            .formatted(getSpecificDataRequest.dataSourceName())));

    return switch (subjectType) {
      case PERSON -> getPersonFileStateResponse(getSpecificDataRequest);
      case FACILITY -> getFacilityFileStateResponse(getSpecificDataRequest);
      case CONTACT -> getContactResponse(getSpecificDataRequest);
    };
  }

  private GetBaseStatisticsDataResponse getPersonFileStateResponse(
      GetBaseStatisticsDataRequest getSpecificDataRequest) {
    List<CommonAttribute> relevantCommonAttributes =
        getRelevantPersonAttributes(getSpecificDataRequest.attributeCodes());
    if (relevantCommonAttributes.isEmpty()) {
      return new GetBaseStatisticsDataResponse(
          new BaseDataTableHeader(Collections.emptyList()), null);
    }

    List<BaseAttribute> attributes = getAttributes(relevantCommonAttributes, SubjectType.PERSON);

    List<Person> persons =
        personRepository.findAllByExternalIdInAndReferencePersonIsNotNullOrderById(
            getSpecificDataRequest.centralFileIds());
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
        new BaseAttribute(valueType.name(), valueType.name(), valueType, null, null, true));
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
    BasicAddressInfo basicAddressInfo = getBasicAddressInfoPerson(address);
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
      case NOT_SPECIFIED -> GenderOptions.UNKNOWN.getValue();
      case DIVERSE -> GenderOptions.DIVERSE.getValue();
      case FEMALE -> GenderOptions.FEMALE.getValue();
      case MALE -> GenderOptions.MALE.getValue();
    };
  }

  private BasicAddressInfo getBasicAddressInfoPerson(PersonAddress personAddress) {
    if (personAddress == null) {
      return null;
    } else {
      return new BasicAddressInfo(
          personAddress.getCountry(), personAddress.getCity(), personAddress.getPostalCode());
    }
  }

  private DistrictDto getDistrictDto(EmbeddableDomesticAddress domesticAddress) {
    try {
      SearchStreetResponse searchStreetResponse =
          streetController.searchStreet(
              domesticAddress.getStreet(),
              domesticAddress.getHouseNumber(),
              domesticAddress.getPostalCode(),
              domesticAddress.getCountry());
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
      GetBaseStatisticsDataRequest getSpecificDataRequest) {
    List<AddressAttribute> relevantAddressAttributes =
        getRelevantAddressAttributes(getSpecificDataRequest.attributeCodes());
    if (relevantAddressAttributes.isEmpty()) {
      return new GetBaseStatisticsDataResponse(
          new BaseDataTableHeader(Collections.emptyList()), null);
    }
    List<BaseAttribute> attributes = getAttributes(relevantAddressAttributes, SubjectType.FACILITY);

    List<Facility> facilities =
        facilityRepository.findAllByExternalIdInAndReferenceFacilityIsNotNullOrderById(
            getSpecificDataRequest.centralFileIds());
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
      GetBaseStatisticsDataRequest getSpecificDataRequest) {
    List<ContactAttributes> relevantContactAttributes =
        getRelevantContactAttributes(getSpecificDataRequest.attributeCodes());
    if (relevantContactAttributes.isEmpty()) {
      return new GetBaseStatisticsDataResponse(
          new BaseDataTableHeader(Collections.emptyList()), null);
    }

    List<BaseAttribute> attributes = getAttributes(relevantContactAttributes, SubjectType.CONTACT);

    List<Contact> contacts = contactService.findAllById(getSpecificDataRequest.centralFileIds());
    List<DataRow> dataRows =
        contacts.stream()
            .map(contact -> createDataRow(contact, relevantContactAttributes))
            .toList();

    return new GetBaseStatisticsDataResponse(new BaseDataTableHeader(attributes), dataRows);
  }

  private List<ContactAttributes> getRelevantContactAttributes(List<String> attributeCodes) {
    List<ContactAttributes> contactAttributes = new ArrayList<>();
    for (String attributeCode : attributeCodes) {
      Optional<ContactAttributes> contactAttributeOptional =
          getAttribute(attributeCode, ContactAttributes.values());
      contactAttributeOptional.ifPresent(contactAttributes::add);
    }
    return contactAttributes;
  }

  private DataRow createDataRow(Contact contact, List<ContactAttributes> contactAttributes) {
    List<Object> values = new ArrayList<>();
    values.add(contact.getExternalId());

    for (ContactAttributes contactAttribute : contactAttributes) {
      Object value;
      if (contact instanceof InstitutionContact institutionContact) {
        value =
            switch (contactAttribute) {
              case NAME -> institutionContact.getName();
              case OBJECT_TYPE -> mapContactObjectType(institutionContact.getCategory());
            };
      } else {
        value = null;
      }

      values.add(value);
    }

    return new DataRow(values);
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

  private record BasicAddressInfo(CountryCode countryCode, String city, String postalCode) {}
}
