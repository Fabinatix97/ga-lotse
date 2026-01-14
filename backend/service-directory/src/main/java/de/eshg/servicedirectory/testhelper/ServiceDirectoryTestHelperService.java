/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.testhelper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.libservicedirectoryadminapi.api.GetEntitiesResponse;
import de.eshg.libservicedirectoryadminapi.api.orgunit.OrgUnitDto;
import de.eshg.libservicedirectoryadminapi.api.staging.CommitResponseDto;
import de.eshg.libservicedirectoryadminapi.api.staging.StagedEntityDto;
import de.eshg.libservicedirectoryadminapi.api.testhelper.OrgUnitPopulationResponse;
import de.eshg.servicedirectory.ServiceDirectoryCommitService;
import de.eshg.servicedirectory.ServiceDirectoryReadService;
import de.eshg.servicedirectory.common.AdminNameHolder;
import de.eshg.testhelper.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.interception.TestRequestInterceptor;
import de.eshg.testhelper.population.BasePopulator;
import de.eshg.testhelper.population.ListWithTotalNumber;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@ConditionalOnTestHelperEnabled
public class ServiceDirectoryTestHelperService extends DefaultTestHelperService {

  private final OrgUnitPopulator orgUnitPopulator;
  private final ServiceDirectoryCommitService serviceDirectoryCommitService;
  private final ServiceDirectoryReadService serviceDirectoryReadService;

  protected ServiceDirectoryTestHelperService(
      DatabaseResetHelper databaseResetHelper,
      TestRequestInterceptor testRequestInterceptor,
      Clock clock,
      List<BasePopulator<?>> populators,
      List<ResettableProperties> resettableProperties,
      OrgUnitPopulator orgUnitPopulator,
      ServiceDirectoryCommitService serviceDirectoryCommitService,
      ServiceDirectoryReadService serviceDirectoryReadService,
      List<TestHelperServiceResetAction> resetActions,
      EnvironmentConfig environmentConfig) {
    super(
        databaseResetHelper,
        testRequestInterceptor,
        clock,
        populators,
        resettableProperties,
        resetActions,
        environmentConfig);
    this.orgUnitPopulator = orgUnitPopulator;
    this.serviceDirectoryCommitService = serviceDirectoryCommitService;
    this.serviceDirectoryReadService = serviceDirectoryReadService;
  }

  @Transactional
  public OrgUnitPopulationResponse populateOrgUnits(
      int numberOfEntitiesToPopulate, boolean generateCertificates) {
    environmentConfig.assertIsNotProduction();
    ListWithTotalNumber<OrgUnitDto> result =
        orgUnitPopulator.populate(numberOfEntitiesToPopulate, generateCertificates);

    return new OrgUnitPopulationResponse(result.entities());
  }

  public CommitResponseDto commitStaged() {
    environmentConfig.assertIsNotProduction();
    String backup = AdminNameHolder.getAdminName();
    AdminNameHolder.setAdminName("test-helper");

    CommitResponseDto result;
    try {
      result = serviceDirectoryCommitService.commitStaged(backup, null);
    } finally {
      AdminNameHolder.setAdminName(backup);
    }

    return result;
  }

  public CommitResponseDto commitAllStaged() {
    environmentConfig.assertIsNotProduction();
    Set<String> authors = getAuthorsOfStagedEntities();

    return authors.stream()
        .map(user -> serviceDirectoryCommitService.commitStaged(user, null))
        .reduce(combineCommitResponses())
        .orElseThrow();
  }

  private Set<String> getAuthorsOfStagedEntities() {
    GetEntitiesResponse entities = serviceDirectoryReadService.getAllEntities();
    return Stream.of(
            entities.stagedOrgUnits().stream().map(StagedEntityDto::author),
            entities.stagedActors().stream().map(StagedEntityDto::author),
            entities.stagedRules().stream().map(StagedEntityDto::author))
        .flatMap(Function.identity())
        .collect(Collectors.toSet());
  }

  private BinaryOperator<CommitResponseDto> combineCommitResponses() {
    return (a, b) ->
        new CommitResponseDto(
            merge(a.actors(), b.actors()),
            merge(a.deletedActors(), b.deletedActors()),
            merge(a.orgUnits(), b.orgUnits()),
            merge(a.deletedOrgUnits(), b.deletedOrgUnits()),
            merge(a.rules(), b.rules()),
            merge(a.deletedRules(), b.deletedRules()));
  }

  private <K, V> Map<K, V> merge(Map<K, V> a, Map<K, V> b) {
    return Stream.concat(a.entrySet().stream(), b.entrySet().stream())
        .collect(StreamUtil.toLinkedHashMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private <T> List<T> merge(List<T> a, List<T> b) {
    return Stream.concat(a.stream(), b.stream()).toList();
  }
}
