/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.contact.ContactController;
import de.eshg.base.contact.api.AddInstitutionContactRequest;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import de.eshg.base.contact.api.InstitutionContactSubCategoryDto;
import de.eshg.base.contact.persistence.entity.Contact;
import de.eshg.base.contact.persistence.repository.ContactRepository;
import de.eshg.lib.common.CountryCode;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.PopulationProperties;
import java.time.Clock;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import net.datafaker.Faker;

public abstract class AbstractContactPopulator extends BasePopulator<ContactDto> {

  protected final ContactController contactController;
  protected final ContactRepository contactRepository;

  protected AbstractContactPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ContactController contactController,
      ContactRepository contactRepository) {
    super(properties, clock, getClassNameAsPropertyKey(Contact.class), environmentConfig);
    this.contactController = contactController;
    this.contactRepository = contactRepository;
  }

  protected ContactDto createInstitutionContact(
      Faker faker, Supplier<InstitutionContactCategoryDto> categorySupplier) {
    String name = faker.beer().brand();
    InstitutionContactCategoryDto category = categorySupplier.get();
    InstitutionContactSubCategoryDto subCategory = randomSubCategory(faker, category);
    List<String> phoneNumbers = optional(faker, randomListOfPhoneNumbers(7));
    List<String> emailAddresses = optional(faker, randomListOfEmails(7));
    AddressDto contactAddress =
        switch (category) {
          case SCHOOL, DAYCARE, HEALTH_DEPARTMENT -> createDomesticAddress(faker);
          case null, default -> createAddress(faker);
        };
    AddressDto differentBillingAddress = optional(faker, createAddress());
    return contactController.addContact(
        new AddInstitutionContactRequest(
            name,
            category,
            subCategory,
            phoneNumbers,
            emailAddresses,
            contactAddress,
            differentBillingAddress));
  }

  protected static Supplier<InstitutionContactCategoryDto> randomCategorySupplier(Faker faker) {
    List<InstitutionContactCategoryDto> values =
        Arrays.stream(InstitutionContactCategoryDto.values())
            .filter(Predicate.not(InstitutionContactCategoryDto.SCHOOL::equals))
            .filter(Predicate.not(InstitutionContactCategoryDto.HEALTH_DEPARTMENT::equals))
            .filter(Predicate.not(InstitutionContactCategoryDto.DAYCARE::equals))
            .toList();
    return () -> optional(faker, randomElement(values));
  }

  private static InstitutionContactSubCategoryDto randomSubCategory(
      Faker faker, InstitutionContactCategoryDto category) {
    List<InstitutionContactSubCategoryDto> suitableSubCategories =
        InstitutionContactSubCategoryDto.getSubCategoriesByParentCategory(category);
    if (suitableSubCategories.isEmpty()) {
      return null;
    }
    return optional(faker, randomElement(suitableSubCategories));
  }

  protected Function<Faker, AddressDto> createAddress() {
    return faker -> createAddress(faker);
  }

  protected AddressDto createAddress(Faker faker) {
    return faker.bool().bool() ? createDomesticAddress(faker) : createPostboxAddress(faker);
  }

  private DomesticAddressDto createDomesticAddress(Faker faker) {
    CountryCode country = randomCountry(faker);
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
    CountryCode country = randomCountry(faker);
    String city = faker.dungeonsAndDragons().cities();
    String postalCode = faker.address().postcode();
    String differentName = optional(faker, faker.fullMetalAlchemist().character());
    String postbox = faker.address().mailBox();
    return new PostboxAddressDto(country, city, postalCode, differentName, postbox);
  }
}
