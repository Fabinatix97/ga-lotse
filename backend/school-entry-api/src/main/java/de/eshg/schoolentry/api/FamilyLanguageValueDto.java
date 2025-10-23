/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "FamilyLanguageValue")
public enum FamilyLanguageValueDto {
  GERMAN,
  TURKISH,
  KURDISH,
  RUSSIAN,
  POLISH,
  ARABIC,
  FARSI_DARI,
  SERBO_CROATIAN,
  ROMAN,
  BULGARIAN,
  PASHTU,
  TIGRINIA,
  BERBERIAN,
  AMHARIAN,
  ARAMEAN,
  ITALIAN,
  SPANISH,
  GREEK,
  PORTUGUESE,
  ENGLISH,
  FRENCH,
  URDU,
  OTHER_EUROPEAN_LANGUAGES,
  OTHER_ASIAN_LANGUAGES,
  OTHER_AFRICAN_LANGUAGES,
  OTHER_LANGUAGES,
  UNKNOWN
}
