/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@Import(DefaultEshgSecurityConfig.class)
@PropertySource("classpath:/keycloak-common.properties")
public class KeycloakAuthAutoConfiguration {}
