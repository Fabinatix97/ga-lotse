/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("eshg.rate-limit")
public record RateLimitProperties(SuggestUsers suggestUsers) {
  record SuggestUsers(int capacity, Duration resetInterval) {}
}
