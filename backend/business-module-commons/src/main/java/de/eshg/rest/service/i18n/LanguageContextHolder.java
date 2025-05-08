/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import java.util.Optional;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.context.i18n.LocaleContextHolder;

public final class LanguageContextHolder {

  private LanguageContextHolder() {}

  public static Language getLanguage() {
    return Language.ofLocaleOrDefault(
        Optional.ofNullable(LocaleContextHolder.getLocaleContext())
            .map(LocaleContext::getLocale)
            .orElse(null));
  }
}
