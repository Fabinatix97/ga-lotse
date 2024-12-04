/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.objecttype.persistence.CreateObjectTypeTask;
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
public class InspectionTestHelperService extends DefaultTestHelperService {

  private final CreateObjectTypeTask createObjectTypeTask;
  private final ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider;

  public InspectionTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      CreateObjectTypeTask createObjectTypeTask,
      EnvironmentConfig environmentConfig,
      ChecklistDefinitionTestDataProvider checklistDefinitionTestDataProvider) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        environmentConfig);
    this.createObjectTypeTask = createObjectTypeTask;
    this.checklistDefinitionTestDataProvider = checklistDefinitionTestDataProvider;
  }

  @Override
  public Instant reset() throws Exception {
    Instant newInstant = super.reset();
    createObjectTypeTask.createObjectTypes();
    checklistDefinitionTestDataProvider.clearTestCLDs();
    return newInstant;
  }
}
