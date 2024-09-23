/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.objecttype.persistence.CreateObjectTypeTask;
import de.eshg.testhelper.*;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@ConditionalOnTestHelperEnabled
@Service
public class InspectionTestHelperService extends DefaultTestHelperService {

  private final CreateObjectTypeTask createObjectTypeTask;

  public InspectionTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      CreateObjectTypeTask createObjectTypeTask) {
    super(databaseResetHelper, testRequestInterceptor, clock, populators, resettableProperties);
    this.createObjectTypeTask = createObjectTypeTask;
  }

  @Override
  public Instant reset() throws SQLException {
    Instant newInstant = super.reset();
    createObjectTypeTask.createObjectTypes();
    return newInstant;
  }
}
