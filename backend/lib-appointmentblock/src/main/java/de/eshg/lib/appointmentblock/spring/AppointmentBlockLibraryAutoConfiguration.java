/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.spring;

import de.eshg.lib.appointmentblock.AppointmentBlockAvailabilityConfigController;
import de.eshg.lib.appointmentblock.AppointmentBlockAvailabilityService;
import de.eshg.lib.appointmentblock.AppointmentBlockController;
import de.eshg.lib.appointmentblock.AppointmentBlockDefaultAvailabilityController;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.appointmentblock.AppointmentBlockViewService;
import de.eshg.lib.appointmentblock.client.CalendarClient;
import de.eshg.lib.appointmentblock.contact.AppointmentBlockLibraryContactsMergedHandler;
import de.eshg.lib.appointmentblock.testhelper.AppointmentBlockGroupsPopulator;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnProperty(
    name = "de.eshg.lib.appointmentblock.autoconfiguration-enabled",
    havingValue = "true",
    matchIfMissing = true)
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@EnableConfigurationProperties(AppointmentBlockProperties.class)
@Import({
  AppointmentBlockController.class,
  AppointmentBlockService.class,
  AppointmentBlockViewService.class,
  AppointmentBlockSlotUtil.class,
  AppointmentBlockValidator.class,
  CalendarClient.class,
  AppointmentBlockGroupsPopulator.class,
  AppointmentBlockLibraryContactsMergedHandler.class,
  AppointmentBlockAvailabilityService.class,
  AppointmentBlockDefaultAvailabilityController.class,
  AppointmentBlockAvailabilityConfigController.class
})
public class AppointmentBlockLibraryAutoConfiguration {}
