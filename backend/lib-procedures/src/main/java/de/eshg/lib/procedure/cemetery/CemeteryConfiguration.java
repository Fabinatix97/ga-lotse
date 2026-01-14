/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.cemetery;

import de.eshg.lib.procedure.housekeeping.cemetery.CemeteryHousekeeping;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableConfigurationProperties(CemeteryProperties.class)
@Import({CemeteryService.class, CemeteryHousekeeping.class})
public class CemeteryConfiguration {}
