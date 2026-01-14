/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.checklistdefinition.api.ChecklistDefinitionDto;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionRepository;
import de.eshg.persistence.TransactionHelper;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import net.datafaker.Faker;

@PopulatorComponent
public class ChecklistDefinitionPopulator extends BasePopulator<ChecklistDefinitionDto> {

  private final ChecklistDefinitionTestDataProvider cldTestDataProvider;
  private final ChecklistDefinitionRepository cldRepository;
  private final TransactionHelper transactionHelper;

  protected ChecklistDefinitionPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ChecklistDefinitionTestDataProvider cldTestDataProvider,
      ChecklistDefinitionRepository cldRepository,
      TransactionHelper transactionHelper) {
    super(properties, clock, "checklist_definition", environmentConfig);
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
