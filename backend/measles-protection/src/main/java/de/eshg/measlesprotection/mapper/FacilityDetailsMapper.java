/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.base.GenderDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.ExternalAddFacilityFileStateRequest;
import de.eshg.measlesprotection.api.FacilityContactPersonDto;
import de.eshg.measlesprotection.api.FacilityDto;
import java.util.List;

public class FacilityDetailsMapper {

  private FacilityDetailsMapper() {}

  public static AddFacilityFileStateRequest getAddFacilityRequest(FacilityDto source) {
    List<FacilityContactPersonDto> contactPersons = source.contactPersons();
    return new AddFacilityFileStateRequest(
        source.name(),
        source.emailAddress() == null ? null : List.of(source.emailAddress()),
        source.phoneNumber() == null ? null : List.of(source.phoneNumber()),
        contactPersons.stream()
            .map(
                contactPerson ->
                    new de.eshg.base.centralfile.api.facility.FacilityContactPersonDto(
                        contactPerson.emailAddress(),
                        contactPerson.phoneNumber(),
                        contactPerson.role(),
                        contactPerson.lastName(),
                        contactPerson.firstName(),
                        contactPerson.title(),
                        contactPerson.salutation(),
                        GenderDto.NOT_SPECIFIED))
            .toList(),
        source.contactAddress(),
        source.differentBillingAddress(),
        DataOriginDto.MANUAL);
  }

  public static ExternalAddFacilityFileStateRequest getExternalAddFacilityRequest(
      FacilityDto source) {
    List<FacilityContactPersonDto> contactPersons = source.contactPersons();
    return new ExternalAddFacilityFileStateRequest(
        source.name(),
        source.emailAddress() == null ? null : List.of(source.emailAddress()),
        source.phoneNumber() == null ? null : List.of(source.phoneNumber()),
        contactPersons.stream()
            .map(
                contactPerson ->
                    new de.eshg.base.centralfile.api.facility.FacilityContactPersonDto(
                        contactPerson.emailAddress(),
                        contactPerson.phoneNumber(),
                        contactPerson.role(),
                        contactPerson.lastName(),
                        contactPerson.firstName(),
                        contactPerson.title(),
                        contactPerson.salutation(),
                        GenderDto.NOT_SPECIFIED))
            .toList(),
        source.contactAddress(),
        source.differentBillingAddress());
  }
}
