/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.testhelper;

import de.eshg.base.contact.api.SearchContactsResponse;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.inventory.api.GetInventoryItemsResponse;
import de.eshg.base.resource.api.GetResourcesResponse;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsRequest;
import de.eshg.base.testhelper.api.CreateCalendarTestEventsResponse;
import de.eshg.base.testhelper.api.CreateSetupAdminRequest;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.common.BusinessModule;
import de.eshg.testhelper.AccessToken;
import de.eshg.testhelper.LoginProvider;
import de.eshg.testhelper.TestHelperApi;
import de.eshg.testhelper.api.PopulationRequest;
import de.eshg.testhelper.api.TestHelperLoginAsCitizenAccessCodeUserRequest;
import de.eshg.testhelper.api.TestHelperLoginRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(TestHelperApi.BASE_URL)
public interface BaseTestHelperApi extends TestHelperApi, LoginProvider {

  @Override
  @PostExchange("/login")
  AccessToken login(@Valid @RequestBody TestHelperLoginRequest request);

  @PostExchange("/login-citizen-access-code-user")
  AccessToken loginAsCitizenAccessCodeUser(
      @Valid @RequestBody TestHelperLoginAsCitizenAccessCodeUserRequest request);

  @PostExchange("/create-calendar-test-events")
  CreateCalendarTestEventsResponse createCalendarTestEvents(
      @Valid @RequestBody CreateCalendarTestEventsRequest request);

  @PostExchange("/population/resources")
  GetResourcesResponse populateResources(@Valid @RequestBody PopulationRequest request);

  @PostExchange("/population/inventory")
  GetInventoryItemsResponse populateInventory(@Valid @RequestBody PopulationRequest request);

  @PostExchange("/population/contacts")
  SearchContactsResponse populateContacts(@Valid @RequestBody PopulationRequest request);

  @PostExchange("/population/contacts/schools")
  SearchContactsResponse populateSchoolContacts(@Valid @RequestBody PopulationRequest request);

  @PostExchange("/population/contacts/health-departments")
  SearchContactsResponse populateHealthDepartmentContacts(
      @Valid @RequestBody PopulationRequest request);

  @PostExchange("/keycloak/reset")
  void resetKeycloak();

  @DeleteExchange("/keycloak/sessions")
  void invalidateAllKeycloakSessions();

  @PostExchange("/keycloak/user/create-temporary")
  UserDto createTemporaryUser();

  @DeleteExchange("/keycloak/user/{userName}")
  void deleteKeycloakUser(@PathVariable("userName") String userName);

  @PostExchange("/enabled-new-features/{featureToEnable}")
  void enableNewFeature(@PathVariable("featureToEnable") BaseFeature featureToEnable);

  @PostExchange("/disable-new-features/{featureToDisable}")
  void disableNewFeature(@PathVariable("featureToDisable") BaseFeature featureToDisable);

  @DeleteExchange("/business-modules/{businessModuleToDisable}")
  void disableBusinessModule(
      @PathVariable("businessModuleToDisable") BusinessModule businessModuleToDisable);

  @PostExchange("/setup-admin")
  void createSetupAdmin(@Valid @RequestBody CreateSetupAdminRequest request);

  @DeleteExchange("/setup-admin/{userName}")
  void deleteSetupAdmin(@PathVariable("userName") String userName);
}
