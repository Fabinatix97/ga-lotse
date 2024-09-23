/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.contact.ContactController;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.persistence.entity.InstitutionContactCategory;
import de.eshg.base.contact.persistence.repository.ContactRepository;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import net.datafaker.Faker;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class SchoolContactPopulator extends AbstractContactPopulator {
  protected SchoolContactPopulator(
      Clock clock,
      Environment environment,
      ContactController contactController,
      ContactRepository contactRepository) {
    super(clock, environment, contactController, contactRepository);
  }

  @Override
  protected ContactDto populate(
      int index, Faker faker, BasePopulator<ContactDto>.UniqueValueProvider uniqueValueProvider) {
    return createInstitutionContact(faker, () -> InstitutionContactCategoryDto.SCHOOL);
  }

  @Override
  protected long countExistingEntities() {
    return this.contactRepository.countByCategory(InstitutionContactCategory.SCHOOL);
  }
}
