/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.i18n;

import de.eshg.rest.service.i18n.Language;
import org.apache.commons.io.FilenameUtils;

public record MultiLangFileName(String de, String en) {
  public static MultiLangFileName fromFilenameWithLanguageTags(String filename) {
    return new MultiLangFileName(
        withLanguageTagSuffix(filename, Language.GERMAN),
        withLanguageTagSuffix(filename, Language.ENGLISH));
  }

  private static String withLanguageTagSuffix(String filename, Language languageTag) {
    return "%s_%s.%s"
        .formatted(
            FilenameUtils.removeExtension(filename),
            languageTag.getLocale().toLanguageTag(),
            FilenameUtils.getExtension(filename));
  }
}
