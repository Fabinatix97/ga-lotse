/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SopessLanguage")
public record SopessLanguageDto(
    PrimaryLanguageValueDto primaryLanguage,
    LanguageKnowledgeValueDto germanKnowledgePrimaryCarer,
    FamilyLanguageValueDto familyLanguage,
    GermanKnowledgeValueDto germanKnowledgeChild) {
  public SopessLanguageDto() {
    this(null, null, null, null);
  }
}
