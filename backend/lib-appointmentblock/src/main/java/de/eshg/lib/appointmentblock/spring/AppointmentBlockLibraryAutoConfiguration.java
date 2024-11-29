/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.spring;

import de.eshg.lib.appointmentblock.AppointmentBlockController;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.AppointmentBlockValidator;
import de.eshg.lib.appointmentblock.AppointmentTypeController;
import de.eshg.lib.appointmentblock.AppointmentTypeService;
import de.eshg.lib.appointmentblock.client.CalendarClient;
import de.eshg.lib.appointmentblock.contact.AppointmentBlockLibraryContactsMergedHandler;
import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
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
  AppointmentBlockSlotUtil.class,
  AppointmentBlockValidator.class,
  AppointmentTypeController.class,
  AppointmentTypeService.class,
  CalendarClient.class,
  CreateAppointmentTypeTask.class,
  AppointmentBlockGroupsPopulator.class,
  AppointmentBlockLibraryContactsMergedHandler.class
})
public class AppointmentBlockLibraryAutoConfiguration {}
