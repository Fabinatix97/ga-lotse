/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.centralrepository.client;

import java.io.IOException;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

class CertSubjectForwardingInterceptor implements ClientHttpRequestInterceptor {

  private static final String HEADER_CERT_SUBJECT = "X-ESHG-CERT-SUBJECT";
  private final String commonName;

  CertSubjectForwardingInterceptor(String commonName) {
    this.commonName = commonName;
  }

  @Override
  public ClientHttpResponse intercept(
      HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
    request.getHeaders().set(HEADER_CERT_SUBJECT, "CN=" + commonName);
    return execution.execute(request, body);
  }
}
