/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.GenderDto;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.dental.ChildController;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.api.CreateChildResponse;
import de.eshg.dental.api.ExaminationDto;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import de.eshg.testhelper.population.RequestContextFaker;
import java.time.Clock;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
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
    CreateChildResponse createChildResponse = childController.createChild(request);
    createRandomExaminations(faker, createChildResponse);
    return createChildResponse;
  }

  private void createRandomExaminations(Faker faker, CreateChildResponse createChildResponse) {
    int numberOfExaminations = faker.random().nextInt(0, 2);
    for (int i = 0; i < numberOfExaminations; i++) {
      childController.createExamination(createChildResponse.id(), randomExamination(faker));
    }
  }

  private ExaminationDto randomExamination(Faker faker) {
    return new ExaminationDto(
        LocalDate.now(clock).minusDays(faker.random().nextInt(350)), faker.medication().drugName());
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
        name.firstName(),
        name.lastName(),
        optional(faker, randomElement(faker, GenderDto.values()), 0.05),
        dateOfBirth,
        randomYear,
        groupName,
        randomSchool(faker));
  }

  @Override
  protected long countExistingEntities() {
    return this.childRepository.count();
  }
}
