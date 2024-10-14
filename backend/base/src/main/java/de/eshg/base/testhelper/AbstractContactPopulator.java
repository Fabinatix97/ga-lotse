/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.contact.ContactController;
import de.eshg.base.contact.api.AddInstitutionContactRequest;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.persistence.entity.Contact;
import de.eshg.base.contact.persistence.repository.ContactRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import java.time.Clock;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.function.Supplier;
import net.datafaker.Faker;
import org.springframework.core.env.Environment;

public abstract class AbstractContactPopulator extends BasePopulator<ContactDto> {

  protected final ContactController contactController;
  protected final ContactRepository contactRepository;

  protected AbstractContactPopulator(
      Clock clock,
      Environment environment,
      ContactController contactController,
      ContactRepository contactRepository,
      EnvironmentConfig environmentConfig) {
    super(clock, environment, getClassNameAsPropertyKey(Contact.class), environmentConfig);
    this.contactController = contactController;
    this.contactRepository = contactRepository;
  }

  protected ContactDto createInstitutionContact(
      Faker faker, Supplier<InstitutionContactCategoryDto> categorySupplier) {
    String name = faker.beer().brand();
    InstitutionContactCategoryDto category = categorySupplier.get();
    List<String> phoneNumbers = optional(faker, randomListOfPhoneNumbers(faker, 7));
    List<String> emailAddresses = optional(faker, randomListOfEmails(faker, 7));
    AddressDto contactAddress = createAddress(faker);
    AddressDto differentBillingAddress = optional(faker, createAddress(faker));
    return contactController.addContact(
        new AddInstitutionContactRequest(
            name, category, phoneNumbers, emailAddresses, contactAddress, differentBillingAddress));
  }

  protected static Supplier<InstitutionContactCategoryDto> randomCategorySupplier(Faker faker) {
    List<InstitutionContactCategoryDto> values =
        Arrays.stream(InstitutionContactCategoryDto.values())
            .filter(Predicate.not(InstitutionContactCategoryDto.SCHOOL::equals))
            .toList();
    return () -> optional(faker, randomElement(faker, values));
  }

  protected AddressDto createAddress(Faker faker) {
    return faker.bool().bool() ? createDomesticAddress(faker) : createPostboxAddress(faker);
  }

  private DomesticAddressDto createDomesticAddress(Faker faker) {
    CountryCodeDto country = randomElement(faker, CountryCodeDto.values());
    String city = faker.address().city();
    String postalCode = faker.address().postcode();
    String differentName = optional(faker, faker.fullMetalAlchemist().character());
    String street = faker.address().streetName();
    String houseNumber = optional(faker, faker.address().streetAddressNumber());
    String addressAddition = optional(faker, faker.address().secondaryAddress());
    return new DomesticAddressDto(
        country, city, postalCode, differentName, street, houseNumber, addressAddition);
  }

  private PostboxAddressDto createPostboxAddress(Faker faker) {
    CountryCodeDto country = randomElement(faker, CountryCodeDto.values());
    String city = faker.dungeonsAndDragons().cities();
    String postalCode = faker.address().postcode();
    String differentName = optional(faker, faker.fullMetalAlchemist().character());
    String postbox = faker.address().mailBox();
    return new PostboxAddressDto(country, city, postalCode, differentName, postbox);
  }
}
