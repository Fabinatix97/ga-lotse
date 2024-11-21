/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.inspection.facility.api.*;
import de.eshg.inspection.facility.export.ExportedBannedFacility;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.PendingFacilityView;
import de.eshg.inspection.inspection.api.FacilityForDuplicateReviewDto;
import de.eshg.inspection.objecttype.ObjectTypeMapper;
import de.eshg.inspection.objecttype.api.ObjectTypeDto;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class FacilityMapper {

  public static Facility mapFacility(
      Facility facility,
      AddFacilityFileStateResponse baseFacility,
      InspUpdateFacilityRequest request) {
    // mapping result of post response of central file api
    facility.setCentralFileStateId(baseFacility.id());

    // mapping remaining fields from put request
    if (request.banned() != null) {
      facility.setBanned(request.banned());
    }
    return facility;
  }

  public static InspFacilityDto fromAddFacilityResponse(
      Facility facility, AddFacilityFileStateResponse baseFacility) {
    GetFacilityFileStateResponse baseFacilityFileStateResponse =
        new GetFacilityFileStateResponse(
            baseFacility.id(),
            baseFacility.name(),
            baseFacility.emailAddresses(),
            baseFacility.phoneNumbers(),
            baseFacility.referenceVersion(),
            baseFacility.contactPersons(),
            baseFacility.contactAddress(),
            baseFacility.differentBillingAddress(),
            false,
            baseFacility.dataOrigin());
    return fromGetFacilityResponse(facility, baseFacilityFileStateResponse);
  }

  public static InspFacilityDto fromGetFacilityResponse(
      Facility facility, GetFacilityFileStateResponse baseFacility) {
    return new InspFacilityDto(
        facility.getExternalId(),
        baseFacility,
        facility.isBanned(),
        ObjectTypeMapper.toDto(facility.getObjectType()));
  }

  static Facility facilityFrom(AddFacilityFileStateResponse baseFacility) {
    Facility facility = new Facility();
    facility.setCentralFileStateId(baseFacility.id());
    facility.setBanned(false);
    return facility;
  }

  public static List<ExportedBannedFacility> mapFacilitiesToExportedBannedFacility(
      List<Facility> facilities,
      Map<UUID, AddFacilityFileStateResponse> baseFacilityMap,
      ZoneId zoneId) {

    if (facilities.isEmpty()) {
      return Collections.emptyList();
    }

    return facilities.stream()
        .map(
            facility ->
                mapFacilityToExportedBannedFacility(
                    facility, baseFacilityMap.get(facility.getCentralFileStateId()), zoneId))
        .toList();
  }

  private static ExportedBannedFacility mapFacilityToExportedBannedFacility(
      Facility facility, AddFacilityFileStateResponse baseFacility, ZoneId zoneId) {

    LocalDate dateOfBanning = LocalDate.ofInstant(facility.getLastInspected(), zoneId);

    String objectType =
        facility.getObjectType() != null ? facility.getObjectType().getName() : null;

    switch (baseFacility.contactAddress()) {
      case DomesticAddressDto domesticAddress -> {
        return new ExportedBannedFacility(
            baseFacility.name(),
            dateOfBanning,
            objectType,
            domesticAddress.postalCode(),
            domesticAddress.city(),
            domesticAddress.street(),
            domesticAddress.houseNumber(),
            String.join(", ", baseFacility.phoneNumbers()),
            String.join(", ", baseFacility.emailAddresses()));
      }
      case PostboxAddressDto postboxAddress -> {
        return new ExportedBannedFacility(
            baseFacility.name(),
            dateOfBanning,
            objectType,
            postboxAddress.postalCode(),
            postboxAddress.city(),
            "Postfach",
            postboxAddress.postbox(),
            String.join(", ", baseFacility.phoneNumbers()),
            String.join(", ", baseFacility.emailAddresses()));
      }
    }
  }

  private static InsPendingFacilityInspectionDto createInspPendingFacilityInspectionDto(
      PendingFacilityView view) {
    if (view.inspection() == null) return null;
    return new InsPendingFacilityInspectionDto(
        view.inspection().getExternalId(),
        ProcedureMapper.toInterfaceType(view.inspection().getProcedureStatus()),
        view.inspection().getType(),
        view.inspection().getPhase(),
        view.inspection().getIncidents().size(),
        !view.inspection().getPossibleDuplicates().isEmpty(),
        view.inspection().getResult());
  }

  static InspPendingFacilityDto createInspPendingFacilityDto(
      PendingFacilityView view,
      AddFacilityFileStateResponse facilityDto,
      InspPendingFacilityKind kind,
      Instant plannedFrom,
      ObjectTypeRefDto objecttype,
      Instant executedFrom) {
    InsPendingFacilityInspectionDto inspection = createInspPendingFacilityInspectionDto(view);

    switch (facilityDto.contactAddress()) {
      case DomesticAddressDto domesticAddress -> {
        return new InspPendingFacilityDto(
            view.facility().getExternalId(),
            facilityDto.id(),
            kind,
            facilityDto.name(),
            domesticAddress.street(),
            domesticAddress.houseNumber(),
            domesticAddress.addressAddition(),
            domesticAddress.postalCode(),
            domesticAddress.city(),
            plannedFrom,
            objecttype,
            inspection,
            view.facility().hasPossibleDuplicates(),
            executedFrom);
      }
      case PostboxAddressDto postboxAddress -> {
        return new InspPendingFacilityDto(
            view.facility().getExternalId(),
            facilityDto.id(),
            kind,
            facilityDto.name(),
            "Postfach",
            postboxAddress.postbox(),
            null,
            postboxAddress.postalCode(),
            postboxAddress.city(),
            plannedFrom,
            objecttype,
            inspection,
            view.facility().hasPossibleDuplicates(),
            executedFrom);
      }
      default ->
          throw new NotFoundException(
              "invalid address of unknown type: " + facilityDto.contactAddress());
    }
  }

  static ProcedureStatus toDomainType(ProcedureStatusDto status) {
    return status != null ? ProcedureMapper.toDomainType(status) : null;
  }

  @NotNull
  static Set<ProcedureStatus> toDomainType(Set<ProcedureStatusDto> status) {
    return Optional.ofNullable(status).orElse(Set.of()).stream()
        .map(FacilityMapper::toDomainType)
        .collect(Collectors.toSet());
  }

  static AddFacilityFileStateRequest mapBaseFacilityAddRequest(
      GetFacilityFileStateResponse baseFacility) {
    return new AddFacilityFileStateRequest(
        baseFacility.name(),
        baseFacility.emailAddresses(),
        baseFacility.phoneNumbers(),
        baseFacility.contactPersons(),
        baseFacility.contactAddress(),
        baseFacility.differentBillingAddress(),
        baseFacility.dataOrigin());
  }

  static PutFacilityRequest mapAddFacilityFileStateRequestToPutFacilityRequest(
      AddFacilityFileStateRequest baseFacility) {
    return new PutFacilityRequest(
        new FacilityDetailsDto(
            baseFacility.name(),
            baseFacility.emailAddresses(),
            baseFacility.phoneNumbers(),
            baseFacility.contactPersons(),
            baseFacility.contactAddress(),
            baseFacility.differentBillingAddress()));
  }

  public static FacilityForDuplicateReviewDto mapToFacilityForDuplicateReviewDto(
      UUID referenceId, GetFacilityFileStateResponse baseFacility, ObjectTypeDto objectType) {
    switch (baseFacility.contactAddress()) {
      case DomesticAddressDto domesticAddress -> {
        return new FacilityForDuplicateReviewDto(
            referenceId,
            new ObjectTypeRefDto(objectType.id(), objectType.name()),
            baseFacility.name(),
            domesticAddress.street(),
            domesticAddress.houseNumber(),
            domesticAddress.addressAddition(),
            domesticAddress.postalCode(),
            domesticAddress.city(),
            baseFacility.emailAddresses(),
            baseFacility.phoneNumbers());
      }
      case PostboxAddressDto postboxAddress -> {
        return new FacilityForDuplicateReviewDto(
            referenceId,
            new ObjectTypeRefDto(objectType.id(), objectType.name()),
            baseFacility.name(),
            "Postfach",
            postboxAddress.postbox(),
            null,
            postboxAddress.postalCode(),
            postboxAddress.city(),
            baseFacility.emailAddresses(),
            baseFacility.phoneNumbers());
      }
      default ->
          throw new NotFoundException(
              "invalid address of unknown type: " + baseFacility.contactAddress());
    }
  }

  public static FacilityForDuplicateReviewDto mapToFacilityForDuplicateReviewDto(
      GetReferenceFacilityResponse baseFacility) {
    switch (baseFacility.contactAddress()) {
      case DomesticAddressDto domesticAddress -> {
        return new FacilityForDuplicateReviewDto(
            baseFacility.id(),
            null,
            baseFacility.name(),
            domesticAddress.street(),
            domesticAddress.houseNumber(),
            domesticAddress.addressAddition(),
            domesticAddress.postalCode(),
            domesticAddress.city(),
            baseFacility.emailAddresses(),
            baseFacility.phoneNumbers());
      }
      case PostboxAddressDto postboxAddress -> {
        return new FacilityForDuplicateReviewDto(
            baseFacility.id(),
            null,
            baseFacility.name(),
            "Postfach",
            postboxAddress.postbox(),
            null,
            postboxAddress.postalCode(),
            postboxAddress.city(),
            baseFacility.emailAddresses(),
            baseFacility.phoneNumbers());
      }
      default ->
          throw new NotFoundException(
              "invalid address of unknown type: " + baseFacility.contactAddress());
    }
  }
}
