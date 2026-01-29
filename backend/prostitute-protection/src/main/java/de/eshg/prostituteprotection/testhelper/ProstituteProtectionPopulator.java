/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.testhelper;

import static de.eshg.base.util.ClassNameUtil.getClassNameAsPropertyKey;

import de.eshg.prostituteprotection.ProstituteProtectionController;
import de.eshg.prostituteprotection.api.AppointmentBookingTypeDto;
import de.eshg.prostituteprotection.api.ConsultationDto;
import de.eshg.prostituteprotection.api.ConsultationTypeDto;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.LanguageDto;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.rest.service.security.CurrentUserHelper;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import net.datafaker.Faker;

@PopulatorComponent
public class ProstituteProtectionPopulator
    extends BasePopulator<CreateProstituteProtectionProcedureResponse> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final ProstituteProtectionController prostituteProtectionController;
  private final ProstituteProtectionProcedureRepository prostituteProtectionRepository;

  protected ProstituteProtectionPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      ProstituteProtectionController prostituteProtectionController,
      ProstituteProtectionProcedureRepository prostituteProtectionRepository) {
    super(
        properties,
        clock,
        getClassNameAsPropertyKey(ProstituteProtectionProcedure.class),
        environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.prostituteProtectionController = prostituteProtectionController;
    this.prostituteProtectionRepository = prostituteProtectionRepository;
  }

  @Override
  protected CreateProstituteProtectionProcedureResponse populate(
      int index,
      Faker faker,
      ProstituteProtectionPopulator.UniqueValueProvider uniqueValueProvider) {

    Duration start =
        Duration.ofDays(faker.random().nextInt(10)).plusHours(faker.random().nextInt(24));

    CreateProstituteProtectionProcedureRequest request =
        new CreateProstituteProtectionProcedureRequest(
            faker.artist().name(),
            faker.phoneNumber().phoneNumber(),
            List.of(randomElement(faker, LanguageDto.values())),
            ConsultationTypeDto.INITIAL,
            CurrentUserHelper.getCurrentUserId(),
            AppointmentBookingTypeDto.USER_DEFINED,
            clock.instant().plus(start),
            randomElement(faker, List.of(15, 30, 45, 60)));

    CreateProstituteProtectionProcedureResponse procedure =
        prostituteProtectionController.createProcedure(request);
    updateProstituteProtectionConsultation(procedure.id(), faker);

    return procedure;
  }

  private void updateProstituteProtectionConsultation(UUID procedureId, Faker faker) {
    ConsultationDto currentConsultation =
        prostituteProtectionController.getConsultation(procedureId);

    ConsultationDto updateConsultationRequest =
        new ConsultationDto(
            currentConsultation.version(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            faker.bool().bool(),
            randomElement(faker, LanguageDto.values()),
            true,
            faker.name().firstName(),
            faker.name().lastName());
    prostituteProtectionController.updateConsultation(procedureId, updateConsultationRequest);
  }

  @Override
  public ListWithTotalNumber<CreateProstituteProtectionProcedureResponse> populate(
      int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  @Override
  protected long countExistingEntities() {
    return prostituteProtectionRepository.count();
  }
}
