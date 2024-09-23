/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeConfig;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class CreateAppointmentTypeTask {
  private final AppointmentTypeRepository appointmentTypeRepository;
  private final Map<AppointmentType, Duration> defaultAppointmentTypeConfiguration;
  private final TransactionHelper transactionHelper;

  public CreateAppointmentTypeTask(
      AppointmentTypeRepository appointmentTypeRepository,
      AppointmentBlockProperties appointmentBlockProperties,
      TransactionHelper transactionHelper) {
    this.appointmentTypeRepository = appointmentTypeRepository;
    this.defaultAppointmentTypeConfiguration =
        appointmentBlockProperties.getDefaultAppointmentTypeConfiguration();
    this.transactionHelper = transactionHelper;
  }

  @PostConstruct
  public void createAppointmentTypes() {
    transactionHelper.executeInTransaction(
        () -> {
          defaultAppointmentTypeConfiguration.forEach(
              (appointmentType, defaultDuration) -> {
                if (!appointmentTypeRepository.existsByAppointmentType(appointmentType)) {
                  int standardDuration = Math.toIntExact(defaultDuration.toMinutes());
                  AppointmentTypeConfig appointmentTypeConfig = new AppointmentTypeConfig();
                  appointmentTypeConfig.setAppointmentType(appointmentType);
                  appointmentTypeConfig.setStandardDurationInMinutes(standardDuration);
                  appointmentTypeRepository.save(appointmentTypeConfig);
                }
              });
        });
  }
}
