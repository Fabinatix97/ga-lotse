/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service;

import de.eshg.rest.service.validation.ResponseBodyValidationAdvice;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnProperty(
    name = "de.eshg.rest.service.response-validation.enabled",
    havingValue = "true",
    matchIfMissing = true)
@Import(ResponseBodyValidationAdvice.class)
public class ResponseValidationAutoConfiguration {}
