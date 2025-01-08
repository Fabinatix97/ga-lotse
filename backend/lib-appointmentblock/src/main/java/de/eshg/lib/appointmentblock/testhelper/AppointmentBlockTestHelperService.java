/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.testhelper.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class AppointmentBlockTestHelperService extends DefaultTestHelperService {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;

  public AppointmentBlockTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      CreateAppointmentTypeTask createAppointmentTypeTask,
      EnvironmentConfig environmentConfig) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        environmentConfig);
    this.createAppointmentTypeTask = createAppointmentTypeTask;
  }

  @Override
  public Instant reset() throws Exception {
    Instant newInstant = super.reset();
    createAppointmentTypeTask.createAppointmentTypes();
    return newInstant;
  }
}
