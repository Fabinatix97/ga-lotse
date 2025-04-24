/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Language")
public enum LanguageDto {
  GERMAN("_DE"),
  ENGLISH("_EN");

  private final String fileNameSuffix;

  LanguageDto(String fileNameSuffix) {
    this.fileNameSuffix = fileNameSuffix;
  }

  public String fileNameSuffix() {
    return fileNameSuffix;
  }
}
