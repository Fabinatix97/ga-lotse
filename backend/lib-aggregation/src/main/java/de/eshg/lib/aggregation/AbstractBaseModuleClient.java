/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.aggregation;

import java.time.Duration;

public class AbstractBaseModuleClient extends ClientWithLocationAndTimeout {
  private static final Duration TIMEOUT = Duration.ofSeconds(10);

  public AbstractBaseModuleClient(String location, String url) {
    super(location, url, TIMEOUT);
  }
}
