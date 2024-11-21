/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import org.springframework.stereotype.Component;

@Component
public final class DentalPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  DentalPublicSecurityConfig() {
    super("dental");
  }
}
