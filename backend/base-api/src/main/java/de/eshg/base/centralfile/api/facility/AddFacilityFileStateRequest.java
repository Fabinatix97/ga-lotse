/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.CustomValidations.EmailAddressConstraint;
import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Schema(description = "Request used for adding facilities from non-external sources")
public record AddFacilityFileStateRequest(
    @Schema(
            description =
                "Id of a referenceFacility. If this Id is provided, a new File State with the input attributes is created for that referenceFacility, regardless of any matching logic.",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID referenceFacilityId,
    @NotNull @Size(min = 1, max = 300) String name,
    List<@EmailAddressConstraint String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid List<FacilityContactPersonDto> contactPersons,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull DataOriginDto dataOrigin,
    @Schema(
            description =
                "If only the knowledge factor `name` as well as the address (apart from `addressAddition` and `differentName`) shall be used for establishing a connection to an existing referenceFacility instead of a full match of the complete entity. This is useful for automatic connections, e.g. for imports, where incomplete data is present.",
            example = "true")
        Boolean partialMatch)
    implements FacilityDetails {

  public AddFacilityFileStateRequest(FacilityDetailsDto facilityDetails, DataOriginDto dataOrigin) {
    this(
        null,
        facilityDetails.name(),
        facilityDetails.emailAddresses(),
        facilityDetails.phoneNumbers(),
        facilityDetails.contactPersons(),
        facilityDetails.contactAddress(),
        facilityDetails.differentBillingAddress(),
        dataOrigin,
        null);
  }

  public AddFacilityFileStateRequest(
      UUID referenceFacilityId,
      FacilityDetailsDto facilityDetails,
      DataOriginDto dataOrigin,
      Boolean partialMatch) {
    this(
        referenceFacilityId,
        facilityDetails.name(),
        facilityDetails.emailAddresses(),
        facilityDetails.phoneNumbers(),
        facilityDetails.contactPersons(),
        facilityDetails.contactAddress(),
        facilityDetails.differentBillingAddress(),
        dataOrigin,
        partialMatch);
  }

  public AddFacilityFileStateRequest(
      UUID referenceFacilityId, FacilityDetailsDto facilityDetails, DataOriginDto dataOrigin) {
    this(
        referenceFacilityId,
        facilityDetails.name(),
        facilityDetails.emailAddresses(),
        facilityDetails.phoneNumbers(),
        facilityDetails.contactPersons(),
        facilityDetails.contactAddress(),
        facilityDetails.differentBillingAddress(),
        dataOrigin,
        null);
  }

  public AddFacilityFileStateRequest(
      String name,
      List<String> emailAddresses,
      List<String> phoneNumbers,
      List<FacilityContactPersonDto> contactPersons,
      AddressDto contactAddress,
      AddressDto differentBillingAddress,
      DataOriginDto dataOrigin) {
    this(
        null,
        name,
        emailAddresses,
        phoneNumbers,
        contactPersons,
        contactAddress,
        differentBillingAddress,
        dataOrigin,
        null);
  }

  public AddFacilityFileStateRequest(
      GetReferenceFacilityResponse referenceFacility, DataOriginDto dataOrigin) {
    this(
        referenceFacility.id(),
        referenceFacility.name(),
        referenceFacility.emailAddresses(),
        referenceFacility.phoneNumbers(),
        referenceFacility.contactPersons(),
        referenceFacility.contactAddress(),
        referenceFacility.differentBillingAddress(),
        dataOrigin,
        null);
  }
}
