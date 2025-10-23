/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import de.cronn.commons.lang.StreamUtil;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;

public enum Language {
  GERMAN(Locale.GERMAN),
  ENGLISH(Locale.ENGLISH),
  ;

  public static final Language DEFAULT = GERMAN;
  private static final Map<Locale, Language> LANGUAGE_BY_LOCALE =
      Arrays.stream(Language.values()).collect(StreamUtil.toLinkedHashMap(Language::getLocale));

  private final Locale locale;

  Language(Locale locale) {
    this.locale = locale;
  }

  public Locale getLocale() {
    return locale;
  }

  static Language ofLocaleOrDefault(Locale locale) {
    if (!LANGUAGE_BY_LOCALE.containsKey(locale)) {
      return DEFAULT;
    }
    return LANGUAGE_BY_LOCALE.get(locale);
  }
}
