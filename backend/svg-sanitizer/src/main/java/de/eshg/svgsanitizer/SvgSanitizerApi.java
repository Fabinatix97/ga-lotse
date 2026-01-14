/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.svgsanitizer;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@HttpExchange("/sanitize")
public interface SvgSanitizerApi {

  @PostExchange(accept = "image/svg+xml", contentType = "image/svg+xml")
  String sanitize(@RequestBody String svg);

  static SvgSanitizerApi createClient(String baseUrl) {
    RestClient restClient = RestClient.builder().baseUrl(baseUrl).build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    return HttpServiceProxyFactory.builderFor(restClientAdapter)
        .build()
        .createClient(SvgSanitizerApi.class);
  }
}
