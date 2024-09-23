/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service;

import de.eshg.rest.service.error.GlobalExceptionHandler;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ConditionalOnProperty(
    name = "de.eshg.rest.service.error-handling-enabled",
    havingValue = "true",
    matchIfMissing = true)
@Import(GlobalExceptionHandler.class)
public class ExceptionHandlingAutoConfiguration {}
