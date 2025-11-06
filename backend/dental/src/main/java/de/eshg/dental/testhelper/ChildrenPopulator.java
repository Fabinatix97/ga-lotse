/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;
import static de.eshg.dental.mapper.BooleanWithUnknownMapper.mapToBooleanWithUnknownDto;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.dental.ChildController;
import de.eshg.dental.api.ChildDetailsDto;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.CreateChildResponse;
import de.eshg.dental.api.FluoridationConsentDto;
import de.eshg.dental.api.UpdateChildRequest;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import de.eshg.testhelper.population.RequestContextFaker;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import net.datafaker.Faker;
import net.datafaker.providers.base.Name;

@PopulatorComponent
public class ChildrenPopulator extends DentalPopulator<CreateChildResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final ChildController childController;
  private final ChildRepository childRepository;

  public ChildrenPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      ContactApi contactApi,
      BaseTestHelperApi baseTestHelperApi,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      ChildController childController,
      ChildRepository childRepository) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(Child.class),
        environmentConfig,
        contactApi,
        baseTestHelperApi);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.childController = RequestContextFaker.withFakedRequestContextsIfNecessary(childController);
    this.childRepository = childRepository;
  }

  @Override
  public ListWithTotalNumber<CreateChildResponse> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected CreateChildResponse populate(
      int index, Faker faker, ChildrenPopulator.UniqueValueProvider uniqueValueProvider) {
    CreateChildRequest request = randomChild(faker);
    int numberOfPastYears = faker.number().numberBetween(0, 3);
    for (int i = numberOfPastYears; i > 0; i--) {
      Year yearInPast = Year.of(request.year() - i);
      CreateChildRequest requestForPast = withNewYear(request, yearInPast);
      UUID childId = childController.createChild(requestForPast).id();
      updateChild(childId, faker);
    }

    CreateChildResponse child = childController.createChild(request);
    updateChild(child.id(), faker);

    return child;
  }

  private void updateChild(UUID childId, Faker faker) {
    ChildDetailsDto childDetails = childController.getChild(childId);
    childController.updateChild(
        childId,
        new UpdateChildRequest(
            childDetails.version(),
            childDetails.groupName(),
            childDetails.getCurrentInstitution().id(),
            randomFluoridationConsent(faker, childDetails.year())));
  }

  private FluoridationConsentDto randomFluoridationConsent(Faker faker, int year) {
    Boolean consented = optional(faker, faker.bool().bool());
    if (consented == null) {
      return null;
    }

    Boolean hasAllergy = consented ? optional(faker, false) : optional(faker, faker.bool().bool());
    LocalDate dateOfConsent =
        LocalDate.of(year - 1, 1, 1).plusDays(faker.number().numberBetween(1, 350));

    return new FluoridationConsentDto(
        dateOfConsent, mapToBooleanWithUnknownDto(consented), hasAllergy);
  }

  private CreateChildRequest randomChild(Faker faker) {
    Name name = faker.name();
    LocalDate dateOfBirth =
        LocalDate.now(clock).minusYears(5).minusDays(faker.random().nextInt(400));

    Integer randomYear =
        faker
            .random()
            .nextInt(Year.now(clock).minusYears(2).getValue(), Year.now(clock).getValue());

    String groupName = faker.random().nextInt(1, 4) + randomElement(faker, List.of("a", "b", "c"));

    return new CreateChildRequest(
        null,
        name.title(),
        optional(faker, randomElement(SalutationDto.values()), 0.9),
        name.firstName(),
        name.lastName(),
        optional(faker, randomElement(GenderDto.values()), 0.05),
        dateOfBirth,
        optional(faker, faker.name().lastName(), 0.95),
        optional(faker, faker.address().city(), 0.5),
        optional(faker, BasePopulator::randomCountry, 0.5),
        optional(faker, randomListOfEmails(1), 0.4),
        optional(faker, randomListOfPhoneNumbers(1), 0.4),
        optional(faker, BasePopulator::randomAddress, 0.3),
        null,
        randomYear,
        groupName,
        randomSchoolOrDaycare(faker));
  }

  @Override
  protected long countExistingEntities() {
    return this.childRepository.count();
  }

  private static CreateChildRequest withNewYear(CreateChildRequest original, Year newYear) {
    return new CreateChildRequest(
        original.referenceId(),
        original.title(),
        original.salutation(),
        original.firstName(),
        original.lastName(),
        original.gender(),
        original.dateOfBirth(),
        original.nameAtBirth(),
        original.placeOfBirth(),
        original.countryOfBirth(),
        original.emailAddresses(),
        original.phoneNumbers(),
        original.contactAddress(),
        null,
        newYear.getValue(),
        original.groupName(),
        original.institutionId());
  }
}
