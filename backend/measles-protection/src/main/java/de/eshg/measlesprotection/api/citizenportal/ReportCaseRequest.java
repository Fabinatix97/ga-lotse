/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api.citizenportal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.centralfile.api.facility.ExternalAddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.measlesprotection.api.MPFacilityTypeDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ReportCaseRequest(
    @NotNull @Valid ExternalAddFacilityFileStateRequest facility,
    @NotNull MPFacilityTypeDto type,
    String otherFacilityTypeInformation,
    @Valid @Size(min = 1, max = 50) List<ReportPersonDto> affectedPersons) {
  @AssertTrue(message = "Exactly one contact person required.")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isValidFacilityContactPersons() {
    if (facility == null) {
      return false;
    }
    List<FacilityContactPersonDto> contactPersons = facility.contactPersons();
    if (contactPersons == null) {
      return false;
    }
    return contactPersons.size() == 1;
  }
}
