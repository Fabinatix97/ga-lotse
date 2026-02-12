/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.testhelper;

import static de.eshg.spatz.testhelper.SpatzTestHelperApi.*;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(url = BASE_URL)
public interface SpatzTestHelperApi {
  String BASE_URL = "/test-helper";

  @PostExchange("/reset")
  @Operation(summary = "Resets Spatz certificate and topology")
  void reset();
}
