/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.i18n;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.rest.service.i18n.Language;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.Map;
import org.apache.commons.io.FilenameUtils;

public record MultiLangFileName(@NotNull @Valid Map<Language, String> localizations) {
  public static MultiLangFileName fromFilenameWithLanguageTags(String filename) {
    return new MultiLangFileName(
        Arrays.stream(Language.values())
            .collect(
                StreamUtil.toLinkedHashMap(l -> l, (l) -> withLanguageTagSuffix(filename, l))));
  }

  public String getFileName(Language language) {
    return localizations.get(language);
  }

  private static String withLanguageTagSuffix(String filename, Language languageTag) {
    return "%s_%s.%s"
        .formatted(
            FilenameUtils.removeExtension(filename),
            languageTag.getLocale().toLanguageTag(),
            FilenameUtils.getExtension(filename));
  }
}
