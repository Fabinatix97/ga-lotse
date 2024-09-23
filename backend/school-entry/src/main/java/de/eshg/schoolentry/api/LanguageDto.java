/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Language")
public record LanguageDto(
    PrimaryLanguageValueDto primaryLanguage,
    LanguageKnowledgeValueDto germanKnowledgePrimaryCarer,
    FamilyLanguageValueDto familyLanguage,
    GermanKnowledgeValueDto germanKnowledgeChild) {
  public LanguageDto() {
    this(null, null, null, null);
  }
}
