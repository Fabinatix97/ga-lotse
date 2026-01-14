/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public final class AcceptLanguageForwardingInterceptor implements ClientHttpRequestInterceptor {
  @Override
  public ClientHttpResponse intercept(
      HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {

    Optional.ofNullable(LocaleContextHolder.getLocaleContext())
        .map(LocaleContext::getLocale)
        .map(List::of)
        .ifPresent(request.getHeaders()::setAcceptLanguageAsLocales);

    return execution.execute(request, body);
  }
}
