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
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.inspection.facility.api.*;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.PendingFacilityView;
import de.eshg.inspection.objecttype.ObjectTypeMapper;
import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import de.eshg.rest.service.error.NotFoundException;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FacilityMapper {

  private FacilityMapper() {}

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
    if (request.suspicious() != null) {
      facility.setSuspicious(request.suspicious());
    }
    if (request.active() != null) {
      facility.setActive(request.active());
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
        facility.isSuspicious(),
        facility.isActive(),
        ObjectTypeMapper.toDto(facility.getObjectType()));
  }

  static Facility facilityFrom(AddFacilityFileStateResponse baseFacility) {
    Facility facility = new Facility();
    facility.setCentralFileStateId(baseFacility.id());
    facility.setActive(true);
    facility.setBanned(false);
    facility.setSuspicious(false);
    return facility;
  }

  public static Map<UUID, InspFacilityDto> facilitiesFrom(
      List<Facility> facilities, List<AddFacilityFileStateResponse> baseFacilities) {
    Map<UUID, AddFacilityFileStateResponse> baseFacilityMap =
        baseFacilities.stream()
            .collect(Collectors.toMap(AddFacilityFileStateResponse::id, Function.identity()));

    return facilities.stream()
        .map(
            facility ->
                FacilityMapper.fromAddFacilityResponse(
                    facility, baseFacilityMap.get(facility.getCentralFileStateId())))
        .distinct()
        .collect(Collectors.toMap(InspFacilityDto::id, Function.identity()));
  }

  private static InsPendingFacilityInspectionDto createInspPendingFacilityInspectionDto(
      PendingFacilityView view) {
    if (view.inspection() == null) return null;
    return new InsPendingFacilityInspectionDto(
        view.inspection().getExternalId(),
        ProcedureMapper.toInterfaceType(view.inspection().getProcedureStatus()),
        view.inspection().getType(),
        view.inspection().getPhase(),
        view.inspection().getIncidents().size());
  }

  static InspPendingFacilityDto createInspPendingFacilityDto(
      PendingFacilityView view,
      AddFacilityFileStateResponse facilityDto,
      InspPendingFacilityKind kind,
      Instant plannedFrom,
      ObjectTypeRefDto objecttype) {
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
            inspection);
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
            inspection);
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
}
