/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.inventory.InventoryController;
import de.eshg.base.inventory.api.AddInventoryItemRequest;
import de.eshg.base.inventory.api.InventoryItemDto;
import de.eshg.base.inventory.api.InventoryItemTypeDto;
import de.eshg.base.inventory.persistence.entity.InventoryItem;
import de.eshg.base.inventory.persistence.entity.InventoryItem_;
import de.eshg.base.inventory.persistence.repository.InventoryRepository;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.util.List;
import net.datafaker.Faker;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class InventoryPopulator extends BasePopulator<InventoryItemDto> {
  private final InventoryController inventoryController;
  private final InventoryRepository inventoryRepository;
  private static final List<String> labelNames =
      List.of("Begehung", "Masernschutz", "Einschulung", "Impfberatung");

  public InventoryPopulator(
      Clock clock,
      Environment environment,
      InventoryController inventoryController,
      InventoryRepository inventoryRepository,
      EnvironmentConfig environmentConfig) {
    super(clock, environment, getClassNameAsPropertyKey(InventoryItem.class), environmentConfig);
    this.inventoryController = inventoryController;
    this.inventoryRepository = inventoryRepository;
  }

  @Override
  protected InventoryItemDto populate(
      int index,
      Faker faker,
      BasePopulator<InventoryItemDto>.UniqueValueProvider uniqueValueProvider) {
    return inventoryController.addInventoryItem(
        new AddInventoryItemRequest(
            uniqueValueProvider.getUniqueFakerValue(
                faker.appliance()::equipment, InventoryItem_.NAME),
            randomElement(faker, InventoryItemTypeDto.values()),
            optional(faker, faker.lorem().paragraph(2)),
            optional(faker, faker.idNumber().valid()),
            randomElements(faker, labelNames),
            faker.random().nextInt(1000),
            faker.random().nextInt(1000)));
  }

  @Override
  protected long countExistingEntities() {
    return inventoryRepository.count();
  }
}
