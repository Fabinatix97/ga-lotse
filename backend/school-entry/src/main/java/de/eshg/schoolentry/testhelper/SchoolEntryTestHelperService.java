/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.testhelper;

import de.eshg.lib.procedure.housekeeping.archiving.ArchivingJob;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.testhelper.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class SchoolEntryTestHelperService extends DefaultTestHelperService {

  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final ArchivingJob<SchoolEntryProcedure> archivingJob;

  protected SchoolEntryTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      List<TestHelperServiceResetAction> resetActions,
      EnvironmentConfig environmentConfig,
      ArchivingJob<SchoolEntryProcedure> archivingJob) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        resetActions,
        environmentConfig);
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.archivingJob = archivingJob;
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

  public void runArchivingJob() {
    archivingJob.run();
  }
}
