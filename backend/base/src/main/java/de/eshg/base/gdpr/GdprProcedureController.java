/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.util.MappingUtil.mapDirection;

import de.eshg.base.SortDirection;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.mapper.PersonMapper;
import de.eshg.base.centralfile.persistence.PersonService;
import de.eshg.base.centralfile.persistence.entity.BirthDetails;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.gdpr.api.*;
import de.eshg.base.gdpr.persistence.*;
import de.eshg.base.util.MappingUtil;
import de.eshg.base.util.PaginationUtil;
import de.eshg.rest.service.error.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "GdprProcedure")
public class GdprProcedureController implements GdprProcedureApi {

  private final GdprProcedureService service;
  private final PersonService personService;

  public GdprProcedureController(GdprProcedureService service, PersonService personService) {
    this.service = service;
    this.personService = personService;
  }

  @Override
  @Transactional
  public GetGdprProcedureResponse addGdprProcedure(AddGdprProcedureRequest request) {
    GdprProcedure procedure = mapToDm(request);
    GdprProcedure saved = service.add(procedure);
    return mapGdprProcedureToApi(saved);
  }

  private static GetGdprProcedureResponse mapGdprProcedureToApi(GdprProcedure gdprProcedure) {
    return new GetGdprProcedureResponse(
        gdprProcedure.getExternalId(),
        gdprProcedure.getVersion(),
        gdprProcedure.getCentralFileId(),
        mapToApi(gdprProcedure.getStatus()),
        mapToApi(gdprProcedure.getType()),
        mapToApi(gdprProcedure.getIdentificationData()),
        gdprProcedure.getCreatedAt());
  }

  private static GdprIdentificationDataDto mapToApi(IdentificationData identificationData) {
    return switch (identificationData) {
      case GdprPerson p -> mapToApi(p);
      case GdprFacility f -> mapToApi(f);
      default -> throw new IllegalStateException("Unexpected value: " + identificationData);
    };
  }

  private static GdprPersonDto mapToApi(GdprPerson person) {
    return new GdprPersonDto(
        MappingUtil.mapSalutationToApi(person.getSalutation()),
        person.getTitle(),
        person.getFirstName(),
        person.getLastName(),
        person.getBirthDetails().dateOfBirth(),
        mapToApi(person.getContactAddress()),
        person.getEmailAddress(),
        person.getPhoneNumber());
  }

  private static GdprFacilityDto mapToApi(GdprFacility facility) {
    return new GdprFacilityDto(
        facility.getName(),
        mapToApi(facility.getContactAddress()),
        facility.getEmailAddress(),
        facility.getPhoneNumber());
  }

  private static AddressDto mapToApi(GdprFacilityAddress contactAddress) {
    return switch (contactAddress) {
      case GdprDomesticFacilityAddress domestic -> AddressMapper.mapDomesticAddressToApi(domestic);
      case GdprPostboxFacilityAddress postbox -> AddressMapper.mapPostboxAddressToApi(postbox);
      default -> throw new IllegalArgumentException("Unexpected value: " + contactAddress);
    };
  }

  private static AddressDto mapToApi(GdprPersonAddress contactAddress) {
    return switch (contactAddress) {
      case GdprDomesticPersonAddress domestic -> AddressMapper.mapDomesticAddressToApi(domestic);
      case GdprPostboxPersonAddress postbox -> AddressMapper.mapPostboxAddressToApi(postbox);
      default -> throw new IllegalArgumentException("Unexpected value: " + contactAddress);
    };
  }

  private static GdprProcedureTypeDto mapToApi(GdprProcedureType type) {
    return switch (type) {
      case RIGHT_OF_ACCESS -> GdprProcedureTypeDto.RIGHT_OF_ACCESS;
      case RIGHT_TO_OBJECT -> GdprProcedureTypeDto.RIGHT_TO_OBJECT;
      case RIGHT_TO_ERASURE -> GdprProcedureTypeDto.RIGHT_TO_ERASURE;
    };
  }

  private static GdprProcedureStatusDto mapToApi(GdprProcedureStatus status) {
    return switch (status) {
      case DRAFT -> GdprProcedureStatusDto.DRAFT;
      case OPEN -> GdprProcedureStatusDto.OPEN;
      case CLOSED -> GdprProcedureStatusDto.CLOSED;
      case ABORTED -> GdprProcedureStatusDto.ABORTED;
      case IN_PROGRESS -> GdprProcedureStatusDto.IN_PROGRESS;
    };
  }

  private GdprProcedure mapToDm(AddGdprProcedureRequest request) {
    GdprProcedure procedure = new GdprProcedure();
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    procedure.setType(mapToDm(request.type()));
    procedure.setIdentificationData(mapToDm(request.identificationData()));
    return procedure;
  }

  private IdentificationData mapToDm(GdprIdentificationDataDto gdprIdentificationDataDto) {
    return switch (gdprIdentificationDataDto) {
      case GdprPersonDto person -> mapToDm(person);
      case GdprFacilityDto facility -> mapToDm(facility);
    };
  }

  private GdprPerson mapToDm(GdprPersonDto person) {
    GdprPerson gdprPerson = new GdprPerson();
    gdprPerson.setBirthDetails(new BirthDetails(person.dateOfBirth()));
    gdprPerson.setEmailAddress(person.emailAddress());
    gdprPerson.setSalutation(MappingUtil.mapSalutationToDm(person.salutation()));
    gdprPerson.setTitle(person.title());
    gdprPerson.setFirstName(person.firstName());
    gdprPerson.setLastName(person.lastName());
    gdprPerson.setPhoneNumber(person.phoneNumber());
    gdprPerson.setContactAddress(mapToDmGdprPersonAddress(person.address()));
    return gdprPerson;
  }

  private GdprFacility mapToDm(GdprFacilityDto facility) {
    GdprFacility gdprFacility = new GdprFacility();
    gdprFacility.setName(facility.name());
    gdprFacility.setContactAddress(mapToDmGdprFacilityAddress(facility.address()));
    gdprFacility.setEmailAddress(facility.emailAddress());
    gdprFacility.setPhoneNumber(facility.phoneNumber());
    return gdprFacility;
  }

  private GdprFacilityAddress mapToDmGdprFacilityAddress(AddressDto address) {
    return switch (address) {
      case null -> null;
      case PostboxAddressDto postboxAddress ->
          AddressMapper.mapPostboxAddressIntoDm(postboxAddress, new GdprPostboxFacilityAddress());
      case DomesticAddressDto domesticAddress ->
          AddressMapper.mapDomesticAddressIntoDm(
              domesticAddress, new GdprDomesticFacilityAddress());
    };
  }

  private GdprPersonAddress mapToDmGdprPersonAddress(AddressDto address) {
    return switch (address) {
      case null -> null;
      case PostboxAddressDto postboxAddress ->
          AddressMapper.mapPostboxAddressIntoDm(postboxAddress, new GdprPostboxPersonAddress());
      case DomesticAddressDto domesticAddress ->
          AddressMapper.mapDomesticAddressIntoDm(domesticAddress, new GdprDomesticPersonAddress());
    };
  }

  private GdprProcedureType mapToDm(GdprProcedureTypeDto type) {
    return switch (type) {
      case null -> null;
      case RIGHT_OF_ACCESS -> GdprProcedureType.RIGHT_OF_ACCESS;
      case RIGHT_TO_ERASURE -> GdprProcedureType.RIGHT_TO_ERASURE;
      case RIGHT_TO_OBJECT -> GdprProcedureType.RIGHT_TO_OBJECT;
    };
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureResponse getGdprProcedure(UUID id) {
    return mapGdprProcedureToApi(service.findByExternalId(id).orElseThrow(notFound(id)));
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProcedureDetailsPageResponse getGdprProcedureDetailsPage(UUID id) {
    GetGdprProcedureResponse procedure = getGdprProcedure(id);
    GdprIdentificationDataDto identificationData = procedure.identificationData();
    List<Person> persons = List.of();
    if (procedure.centralFileId() == null && identificationData instanceof GdprPersonDto person) {
      persons =
          personService.fuzzySearch(person.firstName(), person.lastName(), person.dateOfBirth());
    }
    return new GetGdprProcedureDetailsPageResponse(
        procedure, persons.stream().map(PersonMapper::mapReferencePersonToApi).toList());
  }

  private static Supplier<NotFoundException> notFound(UUID id) {
    return () -> new NotFoundException("GdprProcedure with id '%s' not found.".formatted(id));
  }

  @Override
  @Transactional(readOnly = true)
  public GetGdprProceduresResponse getGdprProcedures(GdprProcedureFilterParameters parameters) {
    PaginationUtil.PageSpec pageSpec =
        mapToPageSpec(
            parameters.pageNumberOrFallback(0),
            parameters.pageSizeOrFallback(25),
            parameters.sortKeyOrFallback(GdprProcedureSortKey.CREATED_AT),
            parameters.sortDirectionOrFallback(SortDirection.ASC));
    Page<GdprProcedure> procedures = service.findAll(mapToDm(parameters.type()), pageSpec);
    return mapGdprProceduresToApi(procedures);
  }

  @Override
  @Transactional
  public GetGdprProcedureResponse addCentralFileIdToGdprProcedure(
      UUID id, AddCentralFileIdToGdprProcedureRequest request) {
    return mapGdprProcedureToApi(
        service.addCentralFileIdToGdprProcedure(request.centralFileId(), id, request.version()));
  }

  public GetGdprProceduresResponse mapGdprProceduresToApi(Page<GdprProcedure> procedures) {
    return new GetGdprProceduresResponse(
        procedures.stream().map(GdprProcedureController::mapGdprProcedureToApi).toList(),
        procedures.getTotalElements());
  }

  public static PaginationUtil.PageSpec mapToPageSpec(
      int page, int pageSize, GdprProcedureSortKey sortField, SortDirection direction) {
    return new PaginationUtil.PageSpec(page, pageSize, mapToSortOrder(sortField, direction));
  }

  private static Sort.Order mapToSortOrder(
      GdprProcedureSortKey sortField, SortDirection direction) {
    return new Sort.Order(mapDirection(direction), mapSortField(sortField));
  }

  private static String mapSortField(GdprProcedureSortKey key) {
    return switch (key) {
      case null -> GdprProcedure_.CREATED_AT;
      case GdprProcedureSortKey.CREATED_AT -> GdprProcedure_.CREATED_AT;
    };
  }
}
