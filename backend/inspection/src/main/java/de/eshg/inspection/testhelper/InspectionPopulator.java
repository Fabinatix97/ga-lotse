/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper;

import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.persistence.TransactionHelper;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import de.eshg.testhelper.population.PopulateWithAccessTokenHelper;
import de.eshg.testhelper.population.PopulationProperties;
import de.eshg.testhelper.population.PopulatorComponent;
import de.eshg.testhelper.population.RequestContextFaker;
import java.time.Clock;
import net.datafaker.Faker;
import org.springframework.transaction.PlatformTransactionManager;

@PopulatorComponent
public class InspectionPopulator extends BasePopulator<InspectionDto> {

  private final PopulateWithAccessTokenHelper populateWithAccessTokenHelper;
  private final FacilityRepository facilityRepository;
  private final FacilityTestDataProvider facilityTestDataProvider;
  private final InspectionTestDataProvider inspectionTestDataProvider;
  private final PlatformTransactionManager platformTransactionManager;

  protected InspectionPopulator(
      PopulationProperties properties,
      Clock clock,
      EnvironmentConfig environmentConfig,
      PopulateWithAccessTokenHelper populateWithAccessTokenHelper,
      FacilityRepository facilityRepository,
      FacilityTestDataProvider facilityTestDataProvider,
      InspectionTestDataProvider inspectionTestDataProvider,
      @SuppressWarnings("unused") // Used to define a dependency
          ChecklistDefinitionPopulator checklistDefinitionPopulator,
      PlatformTransactionManager platformTransactionManager) {
    super(properties, clock, "inspection", environmentConfig);
    this.populateWithAccessTokenHelper = populateWithAccessTokenHelper;
    this.facilityRepository = facilityRepository;
    this.facilityTestDataProvider = facilityTestDataProvider;
    this.inspectionTestDataProvider = inspectionTestDataProvider;
    this.platformTransactionManager = platformTransactionManager;
  }

  @Override
  public ListWithTotalNumber<InspectionDto> populate(int numberOfEntitiesToPopulate) {
    return populateWithAccessTokenHelper.doWithAccessToken(
        () ->
            new TransactionHelper(platformTransactionManager)
                .executeInTransaction(
                    () -> populateWithAuthentication(numberOfEntitiesToPopulate)));
  }

  @Override
  protected InspectionDto populate(
      int index,
      Faker faker,
      BasePopulator<InspectionDto>.UniqueValueProvider uniqueValueProvider) {
    InspectionDto response = facilityTestDataProvider.createTestFacilityAndStartInsp(index);
    RequestContextFaker.withFakedRequestContextIfNecessary(
        () -> {
          inspectionTestDataProvider.prepareTestInspection(response.externalId(), faker, index);
          return null;
        });
    return response;
  }

  @Override
  protected long countExistingEntities() {
    // For index 0, we create a facility without an inspection, so we should count the facilities
    // instead of the actual inspections.
    return facilityRepository.count();
  }
}
