/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.contact.ContactController;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.persistence.entity.InstitutionContactCategory;
import de.eshg.base.contact.persistence.repository.ContactRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import net.datafaker.Faker;

@PopulatorComponent
public class HealthDepartmentContactPopulator extends AbstractContactPopulator {
  protected HealthDepartmentContactPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ContactController contactController,
      ContactRepository contactRepository) {
    super(properties, clock, environmentConfig, contactController, contactRepository);
  }

  @Override
  protected ContactDto populate(
      int index, Faker faker, BasePopulator<ContactDto>.UniqueValueProvider uniqueValueProvider) {
    return createInstitutionContact(faker, () -> InstitutionContactCategoryDto.HEALTH_DEPARTMENT);
  }

  @Override
  protected long countExistingEntities() {
    return this.contactRepository.countByCategory(InstitutionContactCategory.HEALTH_DEPARTMENT);
  }
}
