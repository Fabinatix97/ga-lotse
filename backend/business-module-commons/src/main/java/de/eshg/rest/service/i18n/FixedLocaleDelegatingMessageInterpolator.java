/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import jakarta.validation.MessageInterpolator;
import java.util.Locale;

class FixedLocaleDelegatingMessageInterpolator implements MessageInterpolator {
  private static final Locale DEFAULT_LOCALE = Locale.ENGLISH;

  private final MessageInterpolator delegate;

  FixedLocaleDelegatingMessageInterpolator(MessageInterpolator delegate) {
    this.delegate = delegate;
  }

  @Override
  public String interpolate(String messageTemplate, Context context) {
    return this.interpolate(messageTemplate, context, DEFAULT_LOCALE);
  }

  @Override
  public String interpolate(String messageTemplate, Context context, Locale locale) {
    return this.delegate.interpolate(messageTemplate, context, locale);
  }
}
