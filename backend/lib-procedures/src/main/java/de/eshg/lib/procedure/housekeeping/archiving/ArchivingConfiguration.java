/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.housekeeping.archiving;

import de.eshg.lib.procedure.domain.specification.ArchivableProceduresSpecifications;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableConfigurationProperties(ArchivingProperties.class)
@Import({ArchivingJob.class, ArchivableProceduresSpecifications.class, ArchivingController.class})
public class ArchivingConfiguration {}
