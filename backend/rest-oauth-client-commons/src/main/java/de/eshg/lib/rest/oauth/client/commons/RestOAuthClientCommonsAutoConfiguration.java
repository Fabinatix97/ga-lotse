/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.rest.oauth.client.commons;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@Import(ModuleClientAuthenticator.class)
@PropertySource("classpath:rest-oauth-client-commons.properties")
public class RestOAuthClientCommonsAutoConfiguration {}
