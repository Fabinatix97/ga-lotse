/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import java.util.Locale;

public enum Language {
  GERMAN(Locale.GERMAN),
  ENGLISH(Locale.ENGLISH),
  ;

  private final Locale locale;

  Language(Locale locale) {
    this.locale = locale;
  }

  public Locale getLocale() {
    return locale;
  }
}
