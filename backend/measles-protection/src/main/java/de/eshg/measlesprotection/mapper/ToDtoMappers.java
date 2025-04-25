/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.measlesprotection.api.AffectedPersonDto;
import de.eshg.measlesprotection.api.CustodianDto;
import de.eshg.measlesprotection.api.DraftMeaslesProcedureDto;
import de.eshg.measlesprotection.api.FacilityContactPersonDto;
import de.eshg.measlesprotection.api.FacilityDto;
import de.eshg.measlesprotection.api.FacilitySyncDto;
import de.eshg.measlesprotection.api.MeaslesProtectionProcedureDto;
import de.eshg.measlesprotection.api.ProtectionProcedureDto;
import de.eshg.measlesprotection.api.ProtectionProcedureHeaderDto;
import de.eshg.measlesprotection.persistence.centralfile.FacilityData;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureDetailsData;
import java.util.List;

public final class ToDtoMappers {

  private ToDtoMappers() {}

  public static AffectedPersonDto toAffectedPersonDto(ProcedureDetailsData procedureDetailsData) {
    GetPersonFileStateResponse person = procedureDetailsData.person();
    return new AffectedPersonDto(
        person.id(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.phoneNumbers(),
        person.emailAddresses(),
        person.countryOfBirth(),
        person.gender(),
        person.nameAtBirth(),
        person.placeOfBirth(),
        person.salutation(),
        person.title(),
        RoleStatusMapper.toInterfaceType(procedureDetailsData.roleStatus()),
        person.contactAddress());
  }

  public static AffectedPersonDto toAffectedPersonDto(
      GetPersonFileStateResponse fileStateResponse) {
    return new AffectedPersonDto(
        fileStateResponse.id(),
        fileStateResponse.firstName(),
        fileStateResponse.lastName(),
        fileStateResponse.dateOfBirth(),
        fileStateResponse.phoneNumbers(),
        fileStateResponse.emailAddresses(),
        fileStateResponse.countryOfBirth(),
        fileStateResponse.gender(),
        fileStateResponse.nameAtBirth(),
        fileStateResponse.placeOfBirth(),
        fileStateResponse.salutation(),
        fileStateResponse.title(),
        null,
        fileStateResponse.contactAddress());
  }

  public static ProtectionProcedureHeaderDto toProtectionProcedureHeaderDto(
      GetPersonFileStateResponse fileStateResponse) {
    return new ProtectionProcedureHeaderDto(
        fileStateResponse.firstName(),
        fileStateResponse.lastName(),
        fileStateResponse.dateOfBirth());
  }

  public static CustodianDto toCustodianDto(GetPersonFileStateResponse person) {
    de.eshg.base.address.AddressDto address = person.contactAddress();

    return new CustodianDto(
        person.id(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.phoneNumbers(),
        person.emailAddresses(),
        person.gender(),
        person.salutation(),
        person.title(),
        address);
  }

  private static FacilityDto toFacilityDtoNullable(FacilityData facilityData) {
    if (facilityData == null) {
      return null;
    }
    return toFacilityDto(facilityData);
  }

  private static FacilityDto toFacilityDto(FacilityData facilityData) {
    return new FacilityDto(
        facilityData.facilityDto().name(),
        toFacilityContactPersonsDto(facilityData.facilityDto()),
        facilityData.facilityType(),
        facilityData.otherFacilityTypeInformation(),
        getFirstPhoneNumber(facilityData.facilityDto()),
        getFirstEmailAddress(facilityData.facilityDto()),
        facilityData.facilityDto().contactAddress(),
        facilityData.facilityDto().differentBillingAddress(),
        new FacilitySyncDto(
            facilityData.facilityDto().id(),
            facilityData.facilityDto().referenceVersion(),
            facilityData.facilityDto().outdated() != null
                && facilityData.facilityDto().outdated()));
  }

  public static String getFirstPhoneNumber(FacilityDetails facility) {
    return facility.phoneNumbers() == null || facility.phoneNumbers().isEmpty()
        ? null
        : facility.phoneNumbers().getFirst();
  }

  public static String getFirstEmailAddress(FacilityDetails facility) {
    return facility.emailAddresses() == null || facility.emailAddresses().isEmpty()
        ? null
        : facility.emailAddresses().getFirst();
  }

  private static List<FacilityContactPersonDto> toFacilityContactPersonsDto(
      GetFacilityFileStateResponse facilityDto) {
    return facilityDto.contactPersons().stream()
        .map(
            facilityContactPerson ->
                new FacilityContactPersonDto(
                    facilityContactPerson.firstName(),
                    facilityContactPerson.lastName(),
                    facilityContactPerson.phoneNumber(),
                    facilityContactPerson.emailAddress(),
                    facilityContactPerson.role(),
                    facilityContactPerson.salutation(),
                    facilityContactPerson.title()))
        .toList();
  }

  public static ProtectionProcedureDto toProcedureDetails(
      ProcedureDetailsData procedureDetailsData) {
    ProcedureStatus procedureStatus = procedureDetailsData.procedureStatus();

    if (procedureStatus == ProcedureStatus.DRAFT) {
      return new DraftMeaslesProcedureDto(
          procedureDetailsData.externalId(),
          procedureDetailsData.createdAt(),
          toAffectedPersonDto(procedureDetailsData),
          procedureDetailsData.custodians().stream().map(ToDtoMappers::toCustodianDto).toList(),
          toFacilityDtoNullable(procedureDetailsData.facilityData()),
          procedureDetailsData.reportDataDto(),
          ProcedureMapper.toInterfaceType(procedureStatus),
          ProcedureStatus.isOpen(procedureStatus),
          procedureDetailsData.caseStatusDto());
    } else {
      return toMeaslesProtectionProcedure(procedureDetailsData);
    }
  }

  public static MeaslesProtectionProcedureDto toMeaslesProtectionProcedure(
      ProcedureDetailsData detailsData) {
    ProcedureStatus procedureStatus = detailsData.procedureStatus();
    return new MeaslesProtectionProcedureDto(
        detailsData.externalId(),
        detailsData.createdAt(),
        toAffectedPersonDto(detailsData),
        detailsData.custodians().stream().map(ToDtoMappers::toCustodianDto).toList(),
        toFacilityDto(detailsData.facilityData()),
        detailsData.reportDataDto(),
        detailsData.proofSubmissions(),
        detailsData.monetaryFines(),
        detailsData.accessRestriction(),
        ProcedureMapper.toInterfaceType(procedureStatus),
        ProcedureStatus.isOpen(procedureStatus),
        detailsData.caseStatusDto(),
        detailsData.appointmentDto());
  }
}
