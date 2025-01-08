/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.filter;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

@AutoConfiguration
@PropertySource("classpath:/common-logbook.properties")
@Import({RequestLoggingFilter.class, ActiveRequestCounter.class, ActiveRequestCounterFilter.class})
public class RequestLoggingAutoConfiguration {}
