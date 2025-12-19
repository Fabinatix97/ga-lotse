/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.facility;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.officialmedicalservice.procedure.api.FacilityDto;
import de.eshg.officialmedicalservice.procedure.api.FacilitySyncDto;

public class FacilityMapper {

  private FacilityMapper() {}

  public static AddFacilityFileStateRequest mapToAddFacilityFileStateRequest(FacilityDto facility) {
    if (facility == null) {
      return null;
    }
    return new AddFacilityFileStateRequest(
        facility.name(),
        facility.emailAddresses(),
        facility.phoneNumbers(),
        facility.contactPersons(),
        facility.contactAddress(),
        facility.differentBillingAddress(),
        DataOriginDto.MANUAL);
  }

  public static PutFacilityRequest mapToPutFacilityRequest(FacilityDto facility) {
    if (facility == null) {
      return null;
    }
    return new PutFacilityRequest(
        new FacilityDetailsDto(
            facility.name(),
            facility.emailAddresses(),
            facility.phoneNumbers(),
            facility.contactPersons(),
            facility.contactAddress(),
            facility.differentBillingAddress()));
  }

  public static FacilityDto mapToFacilityDto(
      GetFacilityFileStateResponse facilityFileState, long version) {
    if (facilityFileState == null) {
      return null;
    }
    return new FacilityDto(
        version,
        facilityFileState.name(),
        facilityFileState.emailAddresses(),
        facilityFileState.phoneNumbers(),
        facilityFileState.contactPersons(),
        facilityFileState.contactAddress(),
        facilityFileState.differentBillingAddress(),
        new FacilitySyncDto(
            facilityFileState.id(),
            facilityFileState.referenceVersion(),
            facilityFileState.outdated()));
  }
}
