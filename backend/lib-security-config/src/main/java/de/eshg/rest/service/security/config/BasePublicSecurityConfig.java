/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.*;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.stereotype.Component;

@Component
public final class BasePublicSecurityConfig extends AbstractPublicSecurityConfiguration {

  BasePublicSecurityConfig() {
    super("base");
    calendarsAndEvents();
    users();
    notifications();
    inventory();
    resources();
    contacts();
    gdpr();
    facilities();
    persons();
    labels();
    streets();
    proceduresAndTasks();
    department();
    features();
    config();
  }

  private void proceduresAndTasks() {
    requestMatchers(BaseUrls.Base.RECENT_PROCEDURE_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_PROCEDURES_READ);
    requestMatchers(BaseUrls.Base.PROCEDURE_CONFIG_API + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(BaseUrls.Base.TASK_API + "/**").hasRole(EmployeePermissionRole.BASE_TASKS_READ);
    requestMatchers(BaseUrls.Base.PROCEDURE_METRICS_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_PROCEDURE_METRICS_READ);
    requestMatchers(BaseUrls.Base.TASK_METRICS_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_PROCEDURE_METRICS_READ);
  }

  private void streets() {
    requestMatchers(GET, BaseUrls.Base.STREET_API + BaseUrls.Base.STREET_AUTOCOMPLETE_URL)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }

  private void labels() {
    requestMatchers(GET, BaseUrls.Base.LABEL_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_LABELS_READ);
  }

  private void persons() {
    requestMatchers(GET, BaseUrls.Base.PERSON_API)
        .hasRole(EmployeePermissionRole.BASE_PERSONS_READ);
    requestMatchers(GET, BaseUrls.Base.PERSON_API + "/centralfilestates/*/diff")
        .hasRole(EmployeePermissionRole.BASE_PERSONS_READ);
  }

  private void facilities() {
    requestMatchers(GET, BaseUrls.Base.FACILITY_API)
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_READ);
  }

  private void gdpr() {
    requestMatchers(GET, BaseUrls.Base.GDPR_PROCEDURE_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ);
    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
  }

  private void contacts() {
    requestMatchers(
            POST,
            BaseUrls.Base.CONTACT_API,
            BaseUrls.Base.CONTACT_API + BaseUrls.Base.CONTACT_PARSE_VCARD_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_CONTACTS_WRITE);
    requestMatchers(PUT, BaseUrls.Base.CONTACT_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_CONTACTS_WRITE);
    requestMatchers(GET, BaseUrls.Base.CONTACT_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_CONTACTS_READ);
  }

  private void inventory() {
    requestMatchers(
            POST,
            BaseUrls.Base.INVENTORY_API,
            BaseUrls.Base.INVENTORY_API + "/*" + BaseUrls.Base.INVENTORY_CORRECTION_URL,
            BaseUrls.Base.INVENTORY_API + "/*" + BaseUrls.Base.INVENTORY_RESTOCKING_URL)
        .hasRole(EmployeePermissionRole.BASE_INVENTORY_ADMINISTRATE);
    requestMatchers(PUT, BaseUrls.Base.INVENTORY_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_INVENTORY_ADMINISTRATE);
    requestMatchers(GET, BaseUrls.Base.INVENTORY_API, BaseUrls.Base.INVENTORY_API + "/*")
        .hasRole(EmployeePermissionRole.BASE_INVENTORY_READ);
    requestMatchers(
            GET, BaseUrls.Base.INVENTORY_API + "/*" + BaseUrls.Base.INVENTORY_BOOKING_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_INVENTORY_READ);
  }

  private void resources() {
    requestMatchers(POST, BaseUrls.Base.RESOURCES_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_RESOURCES_WRITE);
    requestMatchers(PATCH, BaseUrls.Base.RESOURCES_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_RESOURCES_WRITE);
    requestMatchers(GET, BaseUrls.Base.RESOURCES_API + "/**")
        .hasRole(EmployeePermissionRole.BASE_RESOURCES_READ);
  }

  private void calendarsAndEvents() {
    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API + BaseUrls.Base.CALENDAR_EVENT_API_BASE_EVENT_URL + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(
            PUT,
            BaseUrls.Base.CALENDAR_API + BaseUrls.Base.CALENDAR_EVENT_API_BASE_EVENT_URL + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(
            DELETE,
            BaseUrls.Base.CALENDAR_API + BaseUrls.Base.CALENDAR_EVENT_API_BASE_EVENT_URL + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);

    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_EVENT_API_BUSINESS_MODULE_EVENT_URL
                + "/**")
        .hasRole(EmployeePermissionRole.BASE_CALENDAR_BUSINESS_EVENTS_WRITE);
    requestMatchers(
            PUT,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_EVENT_API_BUSINESS_MODULE_EVENT_URL
                + "/**")
        .hasRole(EmployeePermissionRole.BASE_CALENDAR_BUSINESS_EVENTS_WRITE);
    requestMatchers(
            DELETE,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_EVENT_API_BUSINESS_MODULE_EVENT_URL
                + "/**")
        .hasRole(EmployeePermissionRole.BASE_CALENDAR_BUSINESS_EVENTS_WRITE);

    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_EVENT_API_EVENT_URL
                + "/blocking/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_EVENT_API_EVENT_URL
                + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_API_USER_CALENDAR_URL
                + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API
                + BaseUrls.Base.CALENDAR_API_RESOURCE_CALENDAR_URL
                + BaseUrls.Base.BULK_GET_URL_END)
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(GET, BaseUrls.Base.CALENDAR_API + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);

    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API + BaseUrls.Base.CALENDAR_API_GLOBAL_CALENDAR_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_GLOBAL_CALENDARS_WRITE);
    requestMatchers(
            POST,
            BaseUrls.Base.CALENDAR_API + BaseUrls.Base.CALENDAR_API_RESOURCE_CALENDAR_URL + "/**")
        .hasRole(EmployeePermissionRole.BASE_RESOURCES_WRITE);
  }

  private void users() {
    requestMatchers(
            GET,
            BaseUrls.Base.USER_API + "/*",
            BaseUrls.Base.USER_API + "/*/profile",
            BaseUrls.Base.USER_API + "/self/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(PUT, BaseUrls.Base.USER_API + "/self/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(DELETE, BaseUrls.Base.USER_API + "/self/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(POST, BaseUrls.Base.USER_API + "/self/keys")
        .hasRole(EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS);
    requestMatchers(POST, BaseUrls.Base.USER_API + "/self/active-sessions/invalidate")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
    requestMatchers(POST, BaseUrls.Base.USER_API + "/suggest")
        .hasAnyRole(
            EmployeePermissionRole.INSPECTION_LEADER,
            EmployeePermissionRole.INSPECTION_LANDESAMT_LEADER,
            EmployeePermissionRole.SCHOOL_ENTRY_LEADER,
            EmployeePermissionRole.TRAVEL_MEDICINE_LEADER,
            EmployeePermissionRole.MEASLES_PROTECTION_LEADER,
            EmployeePermissionRole.STATISTICS_LEADER,
            EmployeePermissionRole.STI_PROTECTION_LEADER);
  }

  private void notifications() {
    requestMatchers(BaseUrls.Base.NOTIFICATION_API_BASE_URL + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }

  private void department() {
    requestMatchers(GET, BaseUrls.Base.DEPARTMENT_API + BaseUrls.Base.DEPARTMENT_API_INFO)
        .permitAll();
    requestMatchers(GET, BaseUrls.Base.DEPARTMENT_API + BaseUrls.Base.DEPARTMENT_API_LOGO)
        .permitAll();
    requestMatchers(GET, BaseUrls.Base.DEPARTMENT_API + BaseUrls.Base.DEPARTMENT_API_SECURITY_TXT)
        .permitAll();
  }

  private void features() {
    requestMatchers(GET, BaseUrls.Base.FEATURE_TOGGLES_API + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }

  private void config() {
    requestMatchers(GET, BaseUrls.Base.CONFIG_API + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }
}
