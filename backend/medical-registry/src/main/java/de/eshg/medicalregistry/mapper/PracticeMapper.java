/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import static de.eshg.medicalregistry.mapper.AddressMapper.*;

import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.medicalregistry.api.PracticeDto;
import de.eshg.medicalregistry.domain.model.Practice;

public final class PracticeMapper {
  private PracticeMapper() {}

  public static PracticeDto mapToDto(Practice practice, FacilityDetails practiceDetails) {

    return new PracticeDto(
        practiceDetails.name(),
        practiceDetails.emailAddresses(),
        practiceDetails.phoneNumbers(),
        mapToPracticeAddressDto(practiceDetails.contactAddress()),
        practice.getWebsite(),
        practice.getInstitutionIdentifier(),
        practice.getEstablishmentNumber(),
        practice.isHealthInsuranceAuthorization(),
        practice.getOpeningHours());
  }
}
