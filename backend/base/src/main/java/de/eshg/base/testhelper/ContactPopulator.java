/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.contact.ContactController;
import de.eshg.base.contact.api.AddPersonContactRequest;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.persistence.entity.InstitutionContactCategory;
import de.eshg.base.contact.persistence.repository.ContactRepository;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.util.List;
import net.datafaker.Faker;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnTestHelperEnabled
public class ContactPopulator extends AbstractContactPopulator {
  protected ContactPopulator(
      Clock clock,
      Environment environment,
      ContactController contactController,
      ContactRepository contactRepository) {
    super(clock, environment, contactController, contactRepository);
  }

  @Override
  protected ContactDto populate(
      int index, Faker faker, BasePopulator<ContactDto>.UniqueValueProvider uniqueValueProvider) {
    return faker.bool().bool()
        ? createPersonContact(faker)
        : createInstitutionContact(faker, randomCategorySupplier(faker));
  }

  private ContactDto createPersonContact(Faker faker) {
    String title = optional(faker, faker.university().degree());
    String firstName = optional(faker, faker.elderScrolls().firstName());
    String name = faker.elderScrolls().lastName();
    SalutationDto salutation = optional(faker, randomElement(faker, SalutationDto.values()));
    GenderDto gender = optional(faker, randomElement(faker, GenderDto.values()));
    String externalChatUsername = optional(faker, faker.cat().name());
    List<String> phoneNumbers = optional(faker, randomListOfPhoneNumbers(faker, 7));
    List<String> emailAddresses = optional(faker, randomListOfEmails(faker, 7));
    AddressDto contactAddress = optional(faker, createAddress(faker));
    AddressDto differentBillingAddress = optional(faker, createAddress(faker));
    return contactController.addContact(
        new AddPersonContactRequest(
            title,
            firstName,
            name,
            salutation,
            gender,
            externalChatUsername,
            phoneNumbers,
            emailAddresses,
            contactAddress,
            differentBillingAddress));
  }

  @Override
  protected long countExistingEntities() {
    return this.contactRepository.count()
        - this.contactRepository.countByCategory(InstitutionContactCategory.SCHOOL);
  }
}
