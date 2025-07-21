/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.medicalregistry.MedicalRegistryController;
import de.eshg.medicalregistry.api.ApplicantAddressDto;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreateFullChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.CreateProfessionInformationDto;
import de.eshg.medicalregistry.api.EmploymentStatusDto;
import de.eshg.medicalregistry.api.EmploymentTypeDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;
import de.eshg.medicalregistry.api.ProfessionalTitleDto;
import de.eshg.medicalregistry.api.TypeOfFullChangeDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.repository.MedicalRegistryProcedureRepository;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import java.util.ArrayList;
import java.util.UUID;
import net.datafaker.Faker;

@PopulatorComponent
public class MedicalRegistryPopulator extends BasePopulator<UUID> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final MedicalRegistryController medicalRegistryProcedureController;
  private final MedicalRegistryProcedureRepository medicalRegistryProcedureRepository;

  public MedicalRegistryPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      MedicalRegistryController medicalRegistryProcedureController,
      MedicalRegistryProcedureRepository medicalRegistryProcedureRepository) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(MedicalRegistryProcedure.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.medicalRegistryProcedureController = medicalRegistryProcedureController;
    this.medicalRegistryProcedureRepository = medicalRegistryProcedureRepository;
  }

  @Override
  public ListWithTotalNumber<UUID> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected UUID populate(
      int index, Faker faker, BasePopulator<UUID>.UniqueValueProvider uniqueValueProvider) {

    return createBasePopulatedProcedure(faker);
  }

  private UUID createBasePopulatedProcedure(Faker faker) {
    CreateProcedureRequest createProcedureRequest =
        new CreateFullChangeRequest(
            BasePopulator.randomElement(faker, TypeOfFullChangeDto.values()),
            MedicalRegistryPopulator.applicant(faker),
            MedicalRegistryPopulator.professional(faker),
            MedicalRegistryPopulator.practice(faker),
            faker.random().nextBoolean(),
            faker.random().nextBoolean());

    return medicalRegistryProcedureController.createProcedure(
        createProcedureRequest, null, null, null, new ArrayList<>());
  }

  protected static CreatePracticeDto practice(Faker faker) {
    return new CreatePracticeDto(
        faker.company().name(),
        faker.internet().emailAddress(),
        faker.phoneNumber().phoneNumber(),
        new PracticeAddressDto(
            faker.address().streetName(),
            faker.address().buildingNumber(),
            faker.address().postcode(),
            faker.address().city()),
        faker.company().url(),
        faker.code().isbn13(),
        faker.code().isbn13(),
        faker.random().nextBoolean(),
        faker.company().bs());
  }

  protected static CreateProfessionInformationDto professional(Faker faker) {
    return new CreateProfessionInformationDto(
        BasePopulator.randomElement(faker, ProfessionalTitleDto.values()),
        faker.ancient().titan(),
        faker.ancient().god(),
        faker.ancient().hero(),
        faker.ancient().primordial(),
        faker.timeAndDate().birthday(),
        faker.team().creature() + " Authority",
        faker.regexify("\\d{9}"),
        BasePopulator.randomElement(faker, EmploymentTypeDto.values()),
        BasePopulator.randomElement(faker, EmploymentStatusDto.values()));
  }

  protected static CreateApplicantDto applicant(Faker faker) {
    return new CreateApplicantDto(
        faker.university().degree(),
        gender(faker),
        faker.name().firstName(),
        faker.name().lastName(),
        faker.timeAndDate().birthday(),
        faker.name().lastName(),
        faker.address().cityName(),
        faker.internet().emailAddress(),
        faker.phoneNumber().phoneNumber(),
        address(faker),
        BasePopulator.randomElement(faker, CountryCode.values()));
  }

  private static ApplicantAddressDto address(Faker faker) {
    return new ApplicantAddressDto(
        BasePopulator.randomElement(faker, CountryCode.values()),
        faker.address().streetName(),
        faker.address().buildingNumber(),
        faker.address().zipCode(),
        faker.address().cityName());
  }

  @Override
  protected long countExistingEntities() {
    return medicalRegistryProcedureRepository.count();
  }

  private static GenderDto gender(Faker faker) {
    return BasePopulator.randomElement(faker, GenderDto.values());
  }
}
