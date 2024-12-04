/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.resource.ResourceController;
import de.eshg.base.resource.api.AddResourceRequest;
import de.eshg.base.resource.api.ResourceDto;
import de.eshg.base.resource.api.ResourceTypeDto;
import de.eshg.base.resource.persistence.entity.Resource;
import de.eshg.base.resource.persistence.entity.Resource_;
import de.eshg.base.resource.persistence.repository.ResourceRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import java.util.List;
import net.datafaker.Faker;

@PopulatorComponent
public class ResourcePopulator extends BasePopulator<ResourceDto> {

  private final ResourceController resourceController;
  private final ResourceRepository resourceRepository;
  private static final List<String> labelNames =
      List.of("Begehung", "Masernschutz", "Einschulung", "Impfberatung");

  public ResourcePopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ResourceRepository resourceRepository,
      ResourceController resourceController) {
    super(properties, clock, getClassNameAsPropertyKey(Resource.class), environmentConfig);
    this.resourceRepository = resourceRepository;
    this.resourceController = resourceController;
  }

  @Override
  protected ResourceDto populate(int index, Faker faker, UniqueValueProvider uniqueValueProvider) {
    String makeAndModel =
        uniqueValueProvider.getUniqueFakerValue(faker.vehicle()::makeAndModel, Resource_.NAME);
    ResourceTypeDto type = randomElement(faker, ResourceTypeDto.values());
    String description = optional(faker, faker.starWars().quotes());
    String articleNumber = optional(faker, faker.idNumber().valid());
    List<String> labels = BasePopulator.randomElements(faker, labelNames);
    return resourceController.addResource(
        new AddResourceRequest(makeAndModel, description, articleNumber, type, labels));
  }

  @Override
  protected long countExistingEntities() {
    return this.resourceRepository.count();
  }
}
