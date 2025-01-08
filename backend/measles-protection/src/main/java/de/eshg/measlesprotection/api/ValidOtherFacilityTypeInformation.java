/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import org.apache.commons.lang3.StringUtils;

public interface ValidOtherFacilityTypeInformation {

  @AssertTrue(message = "Other facility type information must be provided for type OTHER only.")
  @JsonIgnore
  @SuppressWarnings("unused")
  default boolean isOtherFacilityTypeInformationValid() {
    if (type() == MPFacilityTypeDto.OTHER) {
      return StringUtils.isNotBlank(otherFacilityTypeInformation());
    } else {
      return StringUtils.isBlank(otherFacilityTypeInformation());
    }
  }

  MPFacilityTypeDto type();

  String otherFacilityTypeInformation();
}
