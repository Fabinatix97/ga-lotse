/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import de.eshg.base.contact.ContactApi;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.ContactFilterParameters;
import de.eshg.base.contact.api.ContactTypeDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.PopulationProperties;
import java.time.Clock;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import net.datafaker.Faker;

public abstract class DentalPopulator<R> extends BasePopulator<R> {

  protected final ContactApi contactApi;
  protected final BaseTestHelperApi baseTestHelperApi;

  protected DentalPopulator(
      PopulationProperties properties,
      Clock clock,
      String entityNameInPropertyKey,
      EnvironmentConfig environmentConfig,
      ContactApi contactApi,
      BaseTestHelperApi baseTestHelperApi) {
    super(properties, clock, entityNameInPropertyKey, environmentConfig);
    this.contactApi = contactApi;
    this.baseTestHelperApi = baseTestHelperApi;
  }

  UUID randomSchoolOrDaycare(Faker faker) {
    List<ContactDto> contacts =
        contactApi
            .getContacts(
                new ContactFilterParameters(
                    null,
                    null,
                    ContactTypeDto.INSTITUTION,
                    Set.of(
                        InstitutionContactCategoryDto.SCHOOL,
                        InstitutionContactCategoryDto.DAYCARE),
                    null,
                    null,
                    null,
                    null))
            .elements();
    if (contacts.isEmpty()) {
      contacts = baseTestHelperApi.populateSchoolContacts(new PopulationRequest(10)).elements();
    }

    return BasePopulator.randomElement(faker, contacts).id();
  }
}
