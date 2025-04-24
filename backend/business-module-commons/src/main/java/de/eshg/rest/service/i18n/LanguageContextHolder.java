/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import java.util.Arrays;
import java.util.Locale;
import org.springframework.context.i18n.LocaleContextHolder;

public final class LanguageContextHolder {

  private LanguageContextHolder() {}

  public static Language getLanguage() {
    Locale locale = LocaleContextHolder.getLocale();

    return Arrays.stream(Language.values())
        .filter(lang -> lang.getLocale().equals(locale))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("Unsupported locale: " + locale));
  }
}
