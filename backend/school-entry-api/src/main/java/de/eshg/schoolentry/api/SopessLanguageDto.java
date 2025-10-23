/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "SopessLanguage")
public record SopessLanguageDto(
    PrimaryLanguageValueDto primaryLanguage,
    LanguageKnowledgeValueDto germanKnowledgePrimaryCarer,
    FamilyLanguageValueDto familyLanguage,
    GermanKnowledgeValueDto germanKnowledgeChild,
    LocalDate inGermanySince) {
  public SopessLanguageDto() {
    this(null, null, null, null, null);
  }
}
