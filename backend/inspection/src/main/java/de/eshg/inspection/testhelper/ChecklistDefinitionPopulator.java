/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionRepository;
import de.eshg.persistence.TransactionHelper;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import net.datafaker.Faker;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class ChecklistDefinitionPopulator extends BasePopulator<ChecklistDefinitionDto> {

  private final ChecklistDefinitionTestDataProvider cldTestDataProvider;
  private final ChecklistDefinitionRepository cldRepository;
  private final TransactionHelper transactionHelper;

  protected ChecklistDefinitionPopulator(
      Clock clock,
      Environment environment,
      ChecklistDefinitionTestDataProvider cldTestDataProvider,
      ChecklistDefinitionRepository cldRepository,
      TransactionHelper transactionHelper,
      EnvironmentConfig environmentConfig) {
    super(clock, environment, "checklist_definition", environmentConfig);
    this.cldTestDataProvider = cldTestDataProvider;
    this.cldRepository = cldRepository;
    this.transactionHelper = transactionHelper;
  }

  @Override
  protected ChecklistDefinitionDto populate(
      int index,
      Faker faker,
      BasePopulator<ChecklistDefinitionDto>.UniqueValueProvider uniqueValueProvider) {
    return transactionHelper.executeInTransaction(() -> cldTestDataProvider.createTestCLD(index));
  }

  @Override
  protected long countExistingEntities() {
    return cldRepository.count();
  }
}
