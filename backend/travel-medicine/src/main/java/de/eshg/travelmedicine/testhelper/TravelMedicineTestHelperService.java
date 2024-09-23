/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.DatabaseResetHelper;
import de.eshg.testhelper.DefaultTestHelperService;
import de.eshg.testhelper.ResettableProperties;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.travelmedicine.medicalhistorytemplate.persistence.CreateMedicalHistoryTemplateTask;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class TravelMedicineTestHelperService extends DefaultTestHelperService {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;
  private final CreateMedicalHistoryTemplateTask createMedicalHistoryTemplateTask;

  public TravelMedicineTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      CreateAppointmentTypeTask createAppointmentTypeTask,
      CreateMedicalHistoryTemplateTask createMedicalHistoryTemplateTask) {
    super(databaseResetHelper, testRequestInterceptor, clock, populators, resettableProperties);
    this.createAppointmentTypeTask = createAppointmentTypeTask;
    this.createMedicalHistoryTemplateTask = createMedicalHistoryTemplateTask;
  }

  @Override
  public Instant reset() throws SQLException {
    Instant newInstant = super.reset();
    createAppointmentTypeTask.createAppointmentTypes();
    createMedicalHistoryTemplateTask.createMedicalHistoryTemplate();
    return newInstant;
  }
}
