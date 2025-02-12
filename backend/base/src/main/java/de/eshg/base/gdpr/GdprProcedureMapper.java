/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import static de.eshg.base.util.MappingUtil.mapDirection;

import de.eshg.base.SortDirection;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.persistence.entity.BirthDetails;
import de.eshg.base.gdpr.api.AddGdprProcedureFromCitizenPortalRequest;
import de.eshg.base.gdpr.api.AddGdprProcedureRequest;
import de.eshg.base.gdpr.api.CitizenUsersGdprProcedureDto;
import de.eshg.base.gdpr.api.GdprFacilityDto;
import de.eshg.base.gdpr.api.GdprIdentificationDataDto;
import de.eshg.base.gdpr.api.GdprPersonDto;
import de.eshg.base.gdpr.api.GdprProcedureSortKey;
import de.eshg.base.gdpr.api.GdprProcedureStatusDto;
import de.eshg.base.gdpr.api.GdprProcedureTypeDto;
import de.eshg.base.gdpr.api.GetCitizenSelfUsersGdprProceduresResponse;
import de.eshg.base.gdpr.api.GetGdprProcedureResponse;
import de.eshg.base.gdpr.api.GetGdprProceduresResponse;
import de.eshg.base.gdpr.persistence.CentralFileIdWrapper;
import de.eshg.base.gdpr.persistence.GdprDomesticFacilityAddress;
import de.eshg.base.gdpr.persistence.GdprDomesticPersonAddress;
import de.eshg.base.gdpr.persistence.GdprDownload;
import de.eshg.base.gdpr.persistence.GdprFacility;
import de.eshg.base.gdpr.persistence.GdprFacilityAddress;
import de.eshg.base.gdpr.persistence.GdprPerson;
import de.eshg.base.gdpr.persistence.GdprPersonAddress;
import de.eshg.base.gdpr.persistence.GdprPostboxFacilityAddress;
import de.eshg.base.gdpr.persistence.GdprPostboxPersonAddress;
import de.eshg.base.gdpr.persistence.GdprProcedure;
import de.eshg.base.gdpr.persistence.GdprProcedureStatus;
import de.eshg.base.gdpr.persistence.GdprProcedureType;
import de.eshg.base.gdpr.persistence.GdprProcedure_;
import de.eshg.base.gdpr.persistence.IdentificationData;
import de.eshg.base.util.MappingUtil;
import de.eshg.base.util.PaginationUtil;
import de.eshg.lib.procedure.model.gdpr.GdprValidationTaskTypeDto;
import de.eshg.rest.service.error.BadRequestException;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

public class GdprProcedureMapper {

  public static final String UNEXPECTED_VALUE = "Unexpected value: ";

  private GdprProcedureMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static GetGdprProcedureResponse mapGdprProcedureToApi(GdprProcedure gdprProcedure) {
    return new GetGdprProcedureResponse(
        gdprProcedure.getExternalId(),
        gdprProcedure.getVersion(),
        mapToApi(gdprProcedure.getCentralFileIdsWrappers()),
        mapToApi(gdprProcedure.getStatus()),
        mapToApi(gdprProcedure.getType()),
        mapToApi(gdprProcedure.getIdentificationData()),
        gdprProcedure.getCreatedAt(),
        gdprProcedure.getClosedAt(),
        gdprProcedure.getMatterOfConcern(),
        gdprProcedure.getInternalNote());
  }

  private static List<UUID> mapToApi(List<CentralFileIdWrapper> wrappers) {
    return wrappers.stream().map(CentralFileIdWrapper::getCentralFileId).toList();
  }

  public static GdprIdentificationDataDto mapToApi(IdentificationData identificationData) {
    return switch (identificationData) {
      case GdprPerson p -> mapToApi(p);
      case GdprFacility f -> mapToApi(f);
      default -> throw new IllegalStateException(UNEXPECTED_VALUE + identificationData);
    };
  }

  public static GdprPersonDto mapToApi(GdprPerson person) {
    return new GdprPersonDto(
        MappingUtil.mapSalutationToApi(person.getSalutation()),
        person.getTitle(),
        person.getFirstName(),
        person.getLastName(),
        person.getBirthDetails().dateOfBirth(),
        mapToApi(person.getContactAddress()),
        person.getEmailAddress(),
        person.getPhoneNumber(),
        person.getBpk2());
  }

  public static GdprFacilityDto mapToApi(GdprFacility facility) {
    return new GdprFacilityDto(
        facility.getName(),
        mapToApi(facility.getContactAddress()),
        facility.getEmailAddress(),
        facility.getPhoneNumber(),
        facility.getDataTransmitterPseudonymId());
  }

  public static AddressDto mapToApi(GdprFacilityAddress contactAddress) {
    return switch (contactAddress) {
      case GdprDomesticFacilityAddress domestic -> AddressMapper.mapDomesticAddressToApi(domestic);
      case GdprPostboxFacilityAddress postbox -> AddressMapper.mapPostboxAddressToApi(postbox);
      default -> throw new IllegalArgumentException(UNEXPECTED_VALUE + contactAddress);
    };
  }

  public static AddressDto mapToApi(GdprPersonAddress contactAddress) {
    return switch (contactAddress) {
      case GdprDomesticPersonAddress domestic -> AddressMapper.mapDomesticAddressToApi(domestic);
      case GdprPostboxPersonAddress postbox -> AddressMapper.mapPostboxAddressToApi(postbox);
      default -> throw new IllegalArgumentException(UNEXPECTED_VALUE + contactAddress);
    };
  }

  public static GdprProcedureTypeDto mapToApi(GdprProcedureType type) {
    return switch (type) {
      case RIGHT_OF_ACCESS -> GdprProcedureTypeDto.RIGHT_OF_ACCESS;
      case RIGHT_TO_OBJECT -> GdprProcedureTypeDto.RIGHT_TO_OBJECT;
      case RIGHT_TO_ERASURE -> GdprProcedureTypeDto.RIGHT_TO_ERASURE;
      case RIGHT_TO_RECTIFICATION -> GdprProcedureTypeDto.RIGHT_TO_RECTIFICATION;
    };
  }

  public static GdprValidationTaskTypeDto mapToValidationTaskApi(GdprProcedureType type) {
    return switch (type) {
      case RIGHT_OF_ACCESS -> GdprValidationTaskTypeDto.RIGHT_OF_ACCESS;
      case RIGHT_TO_ERASURE -> GdprValidationTaskTypeDto.RIGHT_TO_ERASURE;
      default -> throw new IllegalArgumentException(UNEXPECTED_VALUE + type);
    };
  }

  public static GdprProcedureStatusDto mapToApi(GdprProcedureStatus status) {
    return switch (status) {
      case DRAFT -> GdprProcedureStatusDto.DRAFT;
      case CLOSED -> GdprProcedureStatusDto.CLOSED;
      case ABORTED -> GdprProcedureStatusDto.ABORTED;
      case IN_PROGRESS -> GdprProcedureStatusDto.IN_PROGRESS;
    };
  }

  public static GdprProcedure mapToDm(AddGdprProcedureRequest request) {
    GdprProcedure procedure = new GdprProcedure();
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    procedure.setType(mapToDm(request.type()));
    procedure.setIdentificationData(mapToDm(request.identificationData()));
    return procedure;
  }

  public static GdprProcedure mapToDm(AddGdprProcedureFromCitizenPortalRequest request) {
    GdprProcedure procedure = new GdprProcedure();
    procedure.setStatus(GdprProcedureStatus.DRAFT);
    procedure.setType(mapToDm(request.type()));
    procedure.setMatterOfConcern(request.matterOfConcern());
    return procedure;
  }

  public static IdentificationData mapToDm(GdprIdentificationDataDto gdprIdentificationDataDto) {
    return switch (gdprIdentificationDataDto) {
      case GdprPersonDto person -> mapToDm(person);
      case GdprFacilityDto facility -> mapToDm(facility);
    };
  }

  public static GdprPerson mapToDm(GdprPersonDto person) {
    GdprPerson gdprPerson = new GdprPerson();
    gdprPerson.setBirthDetails(new BirthDetails(person.dateOfBirth()));
    gdprPerson.setEmailAddress(person.emailAddress());
    gdprPerson.setSalutation(MappingUtil.mapSalutationToDm(person.salutation()));
    gdprPerson.setTitle(person.title());
    gdprPerson.setFirstName(person.firstName());
    gdprPerson.setLastName(person.lastName());
    gdprPerson.setPhoneNumber(person.phoneNumber());
    gdprPerson.setContactAddress(mapToDmGdprPersonAddress(person.address()));
    if (person.bpk2() != null) {
      throw new BadRequestException("Cannot set bkp2 using the API.");
    }
    return gdprPerson;
  }

  public static GdprFacility mapToDm(GdprFacilityDto facility) {
    GdprFacility gdprFacility = new GdprFacility();
    gdprFacility.setName(facility.name());
    gdprFacility.setContactAddress(mapToDmGdprFacilityAddress(facility.address()));
    gdprFacility.setEmailAddress(facility.emailAddress());
    gdprFacility.setPhoneNumber(facility.phoneNumber());
    if (facility.dataTransmitterPseudonymId() != null) {
      throw new BadRequestException("Cannot set dataTransmitterPseudonymId using the API.");
    }
    return gdprFacility;
  }

  public static List<CentralFileIdWrapper> mapToDm(List<UUID> centralFileIds) {
    return centralFileIds.stream().map(GdprProcedureMapper::mapToDm).toList();
  }

  private static CentralFileIdWrapper mapToDm(UUID centralFileId) {
    CentralFileIdWrapper centralFileIdWrapper = new CentralFileIdWrapper();
    centralFileIdWrapper.setCentralFileId(centralFileId);
    return centralFileIdWrapper;
  }

  public static GdprFacilityAddress mapToDmGdprFacilityAddress(AddressDto address) {
    return switch (address) {
      case null -> null;
      case PostboxAddressDto postboxAddress ->
          AddressMapper.mapPostboxAddressIntoDm(postboxAddress, new GdprPostboxFacilityAddress());
      case DomesticAddressDto domesticAddress ->
          AddressMapper.mapDomesticAddressIntoDm(
              domesticAddress, new GdprDomesticFacilityAddress());
    };
  }

  public static GdprPersonAddress mapToDmGdprPersonAddress(AddressDto address) {
    return switch (address) {
      case null -> null;
      case PostboxAddressDto postboxAddress ->
          AddressMapper.mapPostboxAddressIntoDm(postboxAddress, new GdprPostboxPersonAddress());
      case DomesticAddressDto domesticAddress ->
          AddressMapper.mapDomesticAddressIntoDm(domesticAddress, new GdprDomesticPersonAddress());
    };
  }

  public static GdprProcedureType mapToDm(GdprProcedureTypeDto type) {
    return switch (type) {
      case null -> null;
      case RIGHT_OF_ACCESS -> GdprProcedureType.RIGHT_OF_ACCESS;
      case RIGHT_TO_ERASURE -> GdprProcedureType.RIGHT_TO_ERASURE;
      case RIGHT_TO_OBJECT -> GdprProcedureType.RIGHT_TO_OBJECT;
      case RIGHT_TO_RECTIFICATION -> GdprProcedureType.RIGHT_TO_RECTIFICATION;
    };
  }

  public static Set<UUID> mapDownloadToApi(Collection<GdprDownload> downloads) {
    return downloads.stream().map(GdprDownload::getDownloadId).collect(Collectors.toSet());
  }

  public static GetGdprProceduresResponse mapGdprProceduresToApi(Page<GdprProcedure> procedures) {
    return new GetGdprProceduresResponse(
        procedures.stream().map(GdprProcedureMapper::mapGdprProcedureToApi).toList(),
        procedures.getTotalElements());
  }

  public static GetCitizenSelfUsersGdprProceduresResponse mapCitizenGdprProceduresToApi(
      List<GdprProcedure> procedures) {
    List<CitizenUsersGdprProcedureDto> responses =
        procedures.stream().map(GdprProcedureMapper::mapProcedureToCitizenApi).toList();
    return new GetCitizenSelfUsersGdprProceduresResponse(responses);
  }

  static CitizenUsersGdprProcedureDto mapProcedureToCitizenApi(GdprProcedure procedure) {
    return new CitizenUsersGdprProcedureDto(
        procedure.getExternalId(),
        GdprProcedureMapper.mapToApi(procedure.getType()),
        GdprProcedureMapper.mapToApi(procedure.getStatus()),
        procedure.getMatterOfConcern(),
        procedure.getCentralFileDownload() != null,
        procedure.getCreatedAt(),
        procedure.getClosedAt());
  }

  public static PaginationUtil.PageSpec mapToPageSpec(
      int page, int pageSize, GdprProcedureSortKey sortField, SortDirection direction) {
    return new PaginationUtil.PageSpec(page, pageSize, mapToSortOrder(sortField, direction));
  }

  public static Sort.Order mapToSortOrder(GdprProcedureSortKey sortField, SortDirection direction) {
    return new Sort.Order(mapDirection(direction), mapSortField(sortField));
  }

  public static String mapSortField(GdprProcedureSortKey key) {
    return switch (key) {
      case null -> GdprProcedure_.CREATED_AT;
      case GdprProcedureSortKey.CREATED_AT -> GdprProcedure_.CREATED_AT;
    };
  }
}
