/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PersonLanguage")
public enum LanguageDto {
  BULGARIAN,
  CHINESE,
  GERMAN,
  ENGLISH,
  FRENCH,
  GREEK,
  ITALIAN,
  POLISH,
  PORTUGUESE,
  ROMANIAN,
  RUSSIAN,
  SERBO_CROATIAN,
  SLOVAKIAN,
  SPANISH,
  THAI,
  CZECH,
  TURKISH,
  UKRAINIAN,
  HUNGARIAN,
  UNKNOWN
}
