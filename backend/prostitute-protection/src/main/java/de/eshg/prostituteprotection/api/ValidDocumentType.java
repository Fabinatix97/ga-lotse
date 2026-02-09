/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import java.time.LocalDate;
import org.apache.commons.lang3.StringUtils;

public interface ValidDocumentType {
  @JsonIgnore
  @SuppressWarnings("unused")
  @AssertTrue(message = "A custom document type is required for document typ  e OTHER only.")
  default boolean isValidCustomDocumentType() {
    if (documentType() == DocumentTypeDto.OTHER) {
      return StringUtils.isNotBlank(customDocumentType());
    } else {
      return StringUtils.isBlank(customDocumentType());
    }
  }

  @JsonIgnore
  @SuppressWarnings("unused")
  @AssertTrue(
      message =
          "A residence permit validity date is required for document type RESIDENCE_PERMIT only.")
  default boolean isValidResidencePermitValidityDate() {
    if (documentType() == DocumentTypeDto.RESIDENCE_PERMIT) {
      return residencePermitValidityDate() != null;
    } else {
      return residencePermitValidityDate() == null;
    }
  }

  DocumentTypeDto documentType();

  LocalDate residencePermitValidityDate();

  String customDocumentType();
}
