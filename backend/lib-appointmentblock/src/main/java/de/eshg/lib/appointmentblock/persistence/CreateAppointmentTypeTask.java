/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeConfig;
import de.eshg.lib.appointmentblock.spring.AppointmentBlockProperties;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CreateAppointmentTypeTask {

  private static final Logger log = LoggerFactory.getLogger(CreateAppointmentTypeTask.class);

  private final AppointmentTypeRepository appointmentTypeRepository;
  private final TransactionHelper transactionHelper;
  private final AppointmentBlockProperties appointmentBlockProperties;

  public CreateAppointmentTypeTask(
      AppointmentTypeRepository appointmentTypeRepository,
      AppointmentBlockProperties appointmentBlockProperties,
      TransactionHelper transactionHelper) {
    this.appointmentTypeRepository = appointmentTypeRepository;
    this.transactionHelper = transactionHelper;
    this.appointmentBlockProperties = appointmentBlockProperties;
  }

  @PostConstruct
  public void createAppointmentTypes() {
    transactionHelper.executeInTransaction(
        () ->
            appointmentBlockProperties
                .getDefaultAppointmentTypeConfiguration()
                .forEach(
                    (appointmentType, defaultDuration) -> {
                      int standardDuration = Math.toIntExact(defaultDuration.toMinutes());
                      Optional<AppointmentTypeConfig> config =
                          appointmentTypeRepository.findByAppointmentType(appointmentType);

                      if (config.isEmpty()) {
                        createAppointmentTypeConfig(appointmentType, standardDuration);
                      } else if (appointmentBlockProperties
                          .isOverwriteAppointmentTypeConfigurationWithProperties()) {
                        updateAppointmentTypeConfig(config.get(), standardDuration);
                      }
                    }));
  }

  private void createAppointmentTypeConfig(
      AppointmentType appointmentType, int standardDurationInMinutes) {
    AppointmentTypeConfig appointmentTypeConfig = new AppointmentTypeConfig();
    appointmentTypeConfig.setAppointmentType(appointmentType);
    appointmentTypeConfig.setStandardDurationInMinutes(standardDurationInMinutes);
    appointmentTypeRepository.save(appointmentTypeConfig);
  }

  private static void updateAppointmentTypeConfig(
      AppointmentTypeConfig config, int standardDurationInMinutes) {
    log.info(
        "Updated appointment type configuration for type {} from {} to {} minutes",
        config.getAppointmentType(),
        config.getStandardDurationInMinutes(),
        standardDurationInMinutes);
    config.setStandardDurationInMinutes(standardDurationInMinutes);
  }
}
