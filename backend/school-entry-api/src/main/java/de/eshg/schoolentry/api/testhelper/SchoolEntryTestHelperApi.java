/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.testhelper;

import de.eshg.testhelper.TestHelperApi;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(TestHelperApi.BASE_URL)
public interface SchoolEntryTestHelperApi extends TestHelperApi {

  @PostExchange("consume-rate-limit-tokens")
  void consumeRateLimitTokens(@Valid @RequestBody ConsumeRateLimitTokensRequest request);
}
