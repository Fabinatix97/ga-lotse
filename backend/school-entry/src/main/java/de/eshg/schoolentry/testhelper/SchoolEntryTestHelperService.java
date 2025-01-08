/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import de.eshg.lib.appointmentblock.persistence.CreateAppointmentTypeTask;
import de.eshg.schoolentry.domain.model.Icd10Code;
import de.eshg.schoolentry.domain.model.Icd10Group;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.population.CreateLabelsTask;
import de.eshg.testhelper.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class SchoolEntryTestHelperService extends DefaultTestHelperService {

  private final CreateAppointmentTypeTask createAppointmentTypeTask;
  private final CreateLabelsTask createLabelsTask;
  private final Icd10CodeTestHelper icd10CodeTestHelper;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;

  protected SchoolEntryTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      CreateAppointmentTypeTask createAppointmentTypeTask,
      CreateLabelsTask createLabelsTask,
      Icd10CodeTestHelper icd10CodeTestHelper,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      EnvironmentConfig environmentConfig) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        environmentConfig);
    this.createAppointmentTypeTask = createAppointmentTypeTask;
    this.createLabelsTask = createLabelsTask;
    this.icd10CodeTestHelper = icd10CodeTestHelper;
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
  }

  @Override
  public Instant reset() throws Exception {
    Instant instant = super.reset();
    createAppointmentTypeTask.createAppointmentTypes();
    createLabelsTask.createLabels();
    icd10CodeTestHelper.repopulateIcd10CodesIfNecessary();
    return instant;
  }

  @Override
  protected String[] getTablesToExclude() {
    return new String[] {Icd10Code.TABLE_NAME, Icd10Group.TABLE_NAME};
  }

  public UUID getCitizenUserId(UUID procedureId) {
    SchoolEntryProcedure schoolEntryProcedure =
        schoolEntryProcedureRepository.findByExternalId(procedureId).orElseThrow();
    return schoolEntryProcedure.getCitizenUserId();
  }

  public void clearCitizenUserId(UUID procedureId) {
    environmentConfig.assertIsNotProduction();
    schoolEntryProcedureRepository.clearCitizenUserId(procedureId);
  }

  public List<UUID> getIdsOfClosedProcedures() {
    return schoolEntryProcedureRepository.findExternalIdsOfClosedProcedures();
  }
}
