/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import de.eshg.rest.service.commons.logging.filter.MaskingRequestFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import java.util.Optional;
import org.springframework.core.annotation.AnnotatedMethod;
import org.zalando.logbook.HttpHeaders;
import org.zalando.logbook.HttpRequest;
import org.zalando.logbook.Origin;

public class FilteredBodyServletHttpRequest extends HttpServletRequestWrapper
    implements HttpRequest {

  private final Object body;
  private final AnnotatedMethod annotatedMethod;
  private final MaskingRequestFilter maskingRequestFilter;
  private final HttpServletRequest request;
  private boolean withBody = false;

  public FilteredBodyServletHttpRequest(
      HttpServletRequest request,
      Object body,
      AnnotatedMethod annotatedMethod,
      MaskingRequestFilter maskingRequestFilter) {
    super(request);
    this.request = request;
    this.body = body;
    this.annotatedMethod = annotatedMethod;
    this.maskingRequestFilter = maskingRequestFilter;
  }

  @Override
  public String getRemote() {
    return getRemoteAddr();
  }

  @Override
  public String getMethod() {
    return super.getMethod();
  }

  @Override
  public String getScheme() {
    return super.getScheme();
  }

  @Override
  public String getHost() {
    return getServerName();
  }

  @Override
  public Optional<Integer> getPort() {
    return Optional.of(getServerPort());
  }

  @Override
  public String getPath() {
    return getRequestURI();
  }

  @Override
  public String getQuery() {
    return Optional.ofNullable(getParameterMap())
        .map(parameters -> maskingRequestFilter.filterQuery(parameters, annotatedMethod))
        .orElse("");
  }

  @Override
  public HttpRequest withBody() {
    this.withBody = true;
    return this;
  }

  @Override
  public HttpRequest withoutBody() {
    this.withBody = false;
    return this;
  }

  @Override
  public Origin getOrigin() {
    return Origin.REMOTE;
  }

  @Override
  public HttpHeaders getHeaders() {
    return maskingRequestFilter.filterRequestHeader(this.request);
  }

  @Override
  public byte[] getBody() throws IOException {
    if (!withBody || body == null) {
      return new byte[0];
    }

    return maskingRequestFilter.filterRequestBody(body).getBytes(getCharset());
  }
}
