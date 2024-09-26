/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DatabaseResetHelper;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.ResettableProperties;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class StiProtectionTestHelperService extends DefaultTestHelperService {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;

  public StiProtectionTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      CreateAppointmentTypeTask createAppointmentTypeTask) {
    super(databaseResetHelper, testRequestInterceptor, clock, populators, resettableProperties);
    this.createAppointmentTypeTask = createAppointmentTypeTask;
  }

  @Override
  public Instant reset() throws SQLException {
    Instant newInstant = super.reset();
    createAppointmentTypeTask.createAppointmentTypes();
    return newInstant;
  }
}
