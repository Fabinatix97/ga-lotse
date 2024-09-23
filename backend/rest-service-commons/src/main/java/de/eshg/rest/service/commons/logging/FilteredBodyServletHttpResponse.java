/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import de.eshg.rest.service.commons.logging.filter.MaskingResponseFilter;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import org.zalando.logbook.HttpHeaders;
import org.zalando.logbook.HttpResponse;
import org.zalando.logbook.Origin;

public class FilteredBodyServletHttpResponse extends HttpServletResponseWrapper
    implements HttpResponse {

  private final Object body;
  private final String protocol;
  private final MaskingResponseFilter maskingResponseFilter;
  private final HttpServletResponse response;
  private boolean withBody;

  public FilteredBodyServletHttpResponse(
      HttpServletResponse response,
      Object body,
      String protocol,
      MaskingResponseFilter maskingResponseFilter) {
    super(response);
    this.response = response;
    this.body = body;
    this.protocol = protocol;
    this.maskingResponseFilter = maskingResponseFilter;
  }

  @Override
  public int getStatus() {
    return super.getStatus();
  }

  @Override
  public HttpResponse withBody() {
    this.withBody = true;
    return this;
  }

  @Override
  public HttpResponse withoutBody() {
    this.withBody = false;
    return this;
  }

  @Override
  public Origin getOrigin() {
    return Origin.LOCAL;
  }

  @Override
  public HttpHeaders getHeaders() {
    return maskingResponseFilter.filterResponseHeaders(response);
  }

  @Override
  public byte[] getBody() throws IOException {
    if (!withBody || this.body == null) {
      return new byte[0];
    }

    return maskingResponseFilter.filterResponseBody(body).getBytes(getCharset());
  }

  @Override
  public String getProtocolVersion() {
    return protocol;
  }
}
