/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableConfigurationProperties(ProgressEntryProperties.class)
@Import({
  ManualProgressEntryDeletionApprovalRequestHandler.class,
  ManualProgressEntryDeletionApprovalRequestNotificationService.class,
  ProgressEntryController.class,
  ProgressEntryService.class
})
public class ProgressEntryConfiguration {}
