/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import de.cronn.commons.lang.StreamUtil;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;

// TODO: There are multiple conflicting definitions of "Language" in the
//  different modules.
public enum Language {
  GERMAN(Locale.GERMAN),
  ENGLISH(Locale.ENGLISH),
  SPANISH(Locale.forLanguageTag("es")),
  TURKISH(Locale.forLanguageTag("tr")),
  RUSSIAN(Locale.forLanguageTag("ru")),
  ARABIC(Locale.forLanguageTag("ar")),
  FRENCH(Locale.FRENCH),
  ITALIAN(Locale.ITALIAN),
  POLISH(Locale.forLanguageTag("pl")),
  ROMANIAN(Locale.forLanguageTag("ro")),
  UKRAINIAN(Locale.forLanguageTag("uk")),
  CROATIAN(Locale.forLanguageTag("hr")),
  FARSI(Locale.forLanguageTag("fa")),
  DARI(Locale.forLanguageTag("prs"));

  public static final Language DEFAULT = GERMAN;
  private static final Map<Locale, Language> LANGUAGE_BY_LOCALE =
      Arrays.stream(Language.values()).collect(StreamUtil.toLinkedHashMap(Language::getLocale));

  public static final Map<Language, String> LANGUAGE_TO_LANGUAGE_TAG =
      Map.ofEntries(
          Map.entry(Language.GERMAN, Language.GERMAN_LANGUAGE_TAG),
          Map.entry(Language.ENGLISH, Language.ENGLISH_LANGUAGE_TAG),
          Map.entry(Language.SPANISH, Language.SPANISH_LANGUAGE_TAG),
          Map.entry(Language.TURKISH, Language.TURKISH_LANGUAGE_TAG),
          Map.entry(Language.RUSSIAN, Language.RUSSIAN_LANGUAGE_TAG),
          Map.entry(Language.ARABIC, Language.ARABIC_LANGUAGE_TAG),
          Map.entry(Language.FRENCH, Language.FRENCH_LANGUAGE_TAG),
          Map.entry(Language.ITALIAN, Language.ITALIAN_LANGUAGE_TAG),
          Map.entry(Language.POLISH, Language.POLISH_LANGUAGE_TAG),
          Map.entry(Language.ROMANIAN, Language.ROMANIAN_LANGUAGE_TAG),
          Map.entry(Language.UKRAINIAN, Language.UKRAINIAN_LANGUAGE_TAG),
          Map.entry(Language.CROATIAN, Language.CROATIAN_LANGUAGE_TAG),
          Map.entry(Language.FARSI, Language.FARSI_LANGUAGE_TAG),
          Map.entry(Language.DARI, Language.DARI_LANGUAGE_TAG));

  public static final Map<String, Language> LANGUAGE_TAG_TO_LANGUAGE =
      LANGUAGE_TO_LANGUAGE_TAG.entrySet().stream()
          .collect(StreamUtil.toLinkedHashMap(Map.Entry::getValue, Map.Entry::getKey));

  public static final String GERMAN_LANGUAGE_TAG = "de";
  public static final String ENGLISH_LANGUAGE_TAG = "en";
  public static final String SPANISH_LANGUAGE_TAG = "es";
  public static final String TURKISH_LANGUAGE_TAG = "tr";
  public static final String RUSSIAN_LANGUAGE_TAG = "ru";
  public static final String ARABIC_LANGUAGE_TAG = "ar";
  public static final String FRENCH_LANGUAGE_TAG = "fr";
  public static final String ITALIAN_LANGUAGE_TAG = "it";
  public static final String POLISH_LANGUAGE_TAG = "pl";
  public static final String ROMANIAN_LANGUAGE_TAG = "ro";
  public static final String UKRAINIAN_LANGUAGE_TAG = "uk";
  public static final String CROATIAN_LANGUAGE_TAG = "hr";
  public static final String FARSI_LANGUAGE_TAG = "fa";
  public static final String DARI_LANGUAGE_TAG = "prs";

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
