/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.auditlog.SharedAuditLogTestHelperApi;
import de.eshg.base.contact.api.SearchContactsResponse;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.inventory.api.GetInventoryItemsResponse;
import de.eshg.base.keycloak.MasterKeycloakProvisioning;
import de.eshg.base.resource.api.GetResourcesResponse;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsRequest;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsResponse;
import de.eshg.base.testhelper.api.CreateSetupAdminRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.lib.keycloak.Realm;
import de.eshg.lib.keycloak.UsernamePassword;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.api.RealmDto;
import de.eshg.testhelper.api.TestHelperLoginAsCitizenAccessCodeUserRequest;
import de.eshg.testhelper.api.TestHelperLoginRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.io.IOException;
import org.keycloak.admin.client.resource.UserResource;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
public class BaseTestHelperController extends TestHelperController
    implements BaseTestHelperApi, SharedAuditLogTestHelperApi {

  private final BaseTestHelperService baseTestHelperService;
  private final BaseFeatureToggle baseFeatureToggle;
  private final MasterKeycloakProvisioning masterKeycloakProvisioning;
  private final AuditLogTestHelperService auditLogTestHelperService;

  public BaseTestHelperController(
      BaseTestHelperService baseTestHelperService,
      BaseFeatureToggle baseFeatureToggle,
      MasterKeycloakProvisioning masterKeycloakProvisioning,
      AuditLogTestHelperService auditLogTestHelperService,
      EnvironmentConfig environmentConfig) {
    super(baseTestHelperService, environmentConfig);
    this.baseTestHelperService = baseTestHelperService;
    this.baseFeatureToggle = baseFeatureToggle;
    this.masterKeycloakProvisioning = masterKeycloakProvisioning;
    this.auditLogTestHelperService = auditLogTestHelperService;
  }

  @Override
  public AccessToken login(TestHelperLoginRequest request) {
    return baseTestHelperService.login(
        new UsernamePassword(request.username(), request.password(), mapRealm(request.realm())));
  }

  @Override
  public AccessToken loginAsCitizenAccessCodeUser(
      TestHelperLoginAsCitizenAccessCodeUserRequest request) {
    return baseTestHelperService.loginAsCitizenAccessCodeUser(request.citizenUserId());
  }

  private static Realm mapRealm(RealmDto realm) {
    return switch (realm) {
      case EMPLOYEES -> Realm.EMPLOYEES;
      case CITIZENS -> Realm.CITIZENS;
    };
  }

  @Override
  public CreateCalendarTestEventsResponse createCalendarTestEvents(
      CreateCalendarTestEventsRequest request) {
    return baseTestHelperService.createCalendarTestEvents(request);
  }

  @Override
  public GetResourcesResponse populateResources(PopulationRequest request) {
    return baseTestHelperService.populateResources(request.numberOfEntitiesToPopulate());
  }

  @Override
  public GetInventoryItemsResponse populateInventory(PopulationRequest request) {
    return baseTestHelperService.populateInventory(request.numberOfEntitiesToPopulate());
  }

  @Override
  public SearchContactsResponse populateContacts(PopulationRequest request) {
    return baseTestHelperService.populateContacts(request.numberOfEntitiesToPopulate());
  }

  @Override
  public SearchContactsResponse populateSchoolContacts(PopulationRequest request) {
    return baseTestHelperService.populateSchoolContacts(request.numberOfEntitiesToPopulate());
  }

  @Override
  public SearchContactsResponse populateHealthDepartmentContacts(PopulationRequest request) {
    return baseTestHelperService.populateHealthDepartmentsContacts(
        request.numberOfEntitiesToPopulate());
  }

  @Override
  public void resetKeycloak() {
    baseTestHelperService.resetKeycloak();
  }

  @Override
  public void invalidateAllKeycloakSessions() {
    baseTestHelperService.invalidateAllKeycloakSessions();
  }

  @Override
  public UserDto createTemporaryUser() {
    return baseTestHelperService.createTemporaryTestUser();
  }

  @Override
  public void deleteKeycloakUser(String userName) {
    baseTestHelperService.deleteKeycloakUser(userName);
  }

  @Override
  public void enableNewFeature(BaseFeature featureToEnable) {
    baseFeatureToggle.enableNewFeature(featureToEnable);
  }

  @Override
  public void createSetupAdmin(CreateSetupAdminRequest request) {
    masterKeycloakProvisioning.initializeSetupAdmin(request.username(), request.emailAddress());
  }

  @Override
  public void deleteSetupAdmin(String userName) {
    masterKeycloakProvisioning
        .getKeycloakClient()
        .getUserResourceByName(userName)
        .ifPresent(UserResource::remove);
  }

  @Override
  public void clearAuditLogStorageDirectory() throws IOException {
    auditLogTestHelperService.clearAuditLogStorageDirectory();
  }

  @Override
  public void runArchivingJob() {
    auditLogTestHelperService.runArchivingJob();
  }
}
