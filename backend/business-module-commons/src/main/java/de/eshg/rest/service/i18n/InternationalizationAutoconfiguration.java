/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.i18n;

import java.util.Arrays;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration;
import org.springframework.boot.autoconfigure.validation.ValidationConfigurationCustomizer;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.validation.MessageInterpolatorFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

@AutoConfiguration
@AutoConfigureBefore({WebMvcAutoConfiguration.class, ValidationAutoConfiguration.class})
class InternationalizationAutoconfiguration {

  /**
   * {@link org.springframework.boot.validation.MessageSourceMessageInterpolator} uses the locale
   * context to resolve the error messages which is per default german, see {@link
   * InternationalizationAutoconfiguration#localeResolver()}. Customize the message interpolator to
   * not use this localeResolver.
   */
  @Bean
  ValidationConfigurationCustomizer fixedLocaleValidationConfigurationCustomizer(
      MessageSource messageSource) {
    return configuration ->
        configuration.messageInterpolator(
            new FixedLocaleDelegatingMessageInterpolator(
                new MessageInterpolatorFactory(messageSource).getObject()));
  }

  @Bean(DispatcherServlet.LOCALE_RESOLVER_BEAN_NAME)
  LocaleResolver localeResolver() {
    AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
    localeResolver.setDefaultLocale(Language.DEFAULT.getLocale());
    localeResolver.setSupportedLocales(
        Arrays.stream(Language.values()).map(Language::getLocale).toList());
    return localeResolver;
  }
}
