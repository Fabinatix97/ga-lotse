/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.auditlog.AuditLogClientTestHelperApi;
import de.eshg.base.contact.api.SearchContactsResponse;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureToggle;
import de.eshg.base.gdpr.GdprCleanupJob;
import de.eshg.base.inventory.api.GetInventoryItemsResponse;
import de.eshg.base.keycloak.CitizenKeycloakClient;
import de.eshg.base.keycloak.MasterKeycloakProvisioning;
import de.eshg.base.notification.AuditLogNotificationJob;
import de.eshg.base.resource.api.GetResourcesResponse;
import de.eshg.base.testhelper.api.CitizenUserDto;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsRequest;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsResponse;
import de.eshg.base.testhelper.api.CreateSetupAdminRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.aggregation.spring.BusinessModulesConfigurationProperties;
import de.eshg.lib.auditlog.AuditLogTestHelperService;
import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.keycloak.Realm;
import de.eshg.lib.keycloak.UsernamePassword;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperController;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.api.RealmDto;
import de.eshg.testhelper.api.TestHelperLoginAsCitizenAccessCodeUserRequest;
import de.eshg.testhelper.api.TestHelperLoginRequest;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.collections4.CollectionUtils;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.FederatedIdentityRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnTestHelperEnabled
public class BaseTestHelperController extends TestHelperController
    implements BaseTestHelperApi, AuditLogClientTestHelperApi {

  private final BaseTestHelperService baseTestHelperService;
  private final BaseFeatureToggle baseFeatureToggle;
  private final MasterKeycloakProvisioning masterKeycloakProvisioning;
  private final AuditLogTestHelperService auditLogTestHelperService;
  private final BusinessModulesConfigurationProperties businessModulesConfigurationProperties;
  private final CitizenKeycloakClient citizenKeycloakClient;
  private final AuditLogNotificationJob auditLogNotificationJob;
  private final GdprCleanupJob gdprCleanupJob;

  public BaseTestHelperController(
      BaseTestHelperService baseTestHelperService,
      BaseFeatureToggle baseFeatureToggle,
      MasterKeycloakProvisioning masterKeycloakProvisioning,
      AuditLogTestHelperService auditLogTestHelperService,
      EnvironmentConfig environmentConfig,
      BusinessModulesConfigurationProperties businessModulesConfigurationProperties,
      CitizenKeycloakClient citizenKeycloakClient,
      AuditLogNotificationJob auditLogNotificationJob,
      GdprCleanupJob gdprCleanupJob) {
    super(baseTestHelperService, environmentConfig);
    this.baseTestHelperService = baseTestHelperService;
    this.baseFeatureToggle = baseFeatureToggle;
    this.masterKeycloakProvisioning = masterKeycloakProvisioning;
    this.auditLogTestHelperService = auditLogTestHelperService;
    this.businessModulesConfigurationProperties = businessModulesConfigurationProperties;
    this.citizenKeycloakClient = citizenKeycloakClient;
    this.auditLogNotificationJob = auditLogNotificationJob;
    this.gdprCleanupJob = gdprCleanupJob;
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
  public SearchContactsResponse populateDaycareContacts(PopulationRequest request) {
    return baseTestHelperService.populateDaycareContacts(request.numberOfEntitiesToPopulate());
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
  public UserDto createTemporaryUser(String group) {
    return baseTestHelperService.createTemporaryTestUser(group);
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
  public boolean isNewFeatureEnabled(BaseFeature featureEnabled) {
    return baseFeatureToggle.isNewFeatureEnabled(featureEnabled);
  }

  @Override
  public void disableNewFeature(BaseFeature featureToDisable) {
    baseFeatureToggle.disableNewFeature(featureToDisable);
  }

  @Override
  public void disableBusinessModule(BusinessModule businessModuleToDisable) {
    Object removedModule =
        businessModulesConfigurationProperties.getClients().remove(businessModuleToDisable);
    if (removedModule == null) {
      throw new BadRequestException("Business module was not enabled");
    }
  }

  @Override
  public void resetActivatedBusinessModules() {
    baseTestHelperService.resetProperties(businessModulesConfigurationProperties);
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
  public CitizenUserDto getIdpUser(String nameId) {
    UserRepresentation userRepresentation =
        citizenKeycloakClient
            .getUserResourceByName(nameId)
            .orElseThrow(() -> new NotFoundException("Unknown username"))
            .toRepresentation();

    // Hint: Implement in KeycloakUserApi instead if we need to make this available via UserApi
    // outside of test scope
    validateFederatedIdentityWithNameId(userRepresentation, nameId);

    return new CitizenUserDto(
        UUID.fromString(userRepresentation.getId()),
        sortedAttributes(userRepresentation.getRawAttributes()));
  }

  private static Map<String, List<String>> sortedAttributes(Map<String, List<String>> attributes) {
    if (attributes == null) {
      return null;
    }
    return attributes.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .collect(StreamUtil.toLinkedHashMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private static void validateFederatedIdentityWithNameId(
      UserRepresentation userRepresentation, String nameId) {
    List<FederatedIdentityRepresentation> federatedIdentities =
        userRepresentation.getFederatedIdentities();
    if (CollectionUtils.isEmpty(federatedIdentities)
        || federatedIdentities.stream()
            .map(FederatedIdentityRepresentation::getUserId)
            .noneMatch(nameId::equals)) {
      throw new BadRequestException("Requested user is not an IDP user");
    }
  }

  @Override
  public void runAuditLogArchivingJob() {
    auditLogTestHelperService.runAuditLogArchivingJob();
  }

  @Override
  public void runAuditlogNotificationJob() {
    auditLogNotificationJob.run();
  }

  @Override
  public void runGdprCleanupJob() {
    gdprCleanupJob.performGdprCleanup();
  }
}
