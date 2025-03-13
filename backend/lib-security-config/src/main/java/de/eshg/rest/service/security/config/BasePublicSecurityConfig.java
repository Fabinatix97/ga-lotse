/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.*;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.config.BaseUrls.Base;
import de.eshg.rest.service.security.config.BaseUrls.Base.Gdpr;
import org.springframework.stereotype.Component;

@Component
public final class BasePublicSecurityConfig extends AbstractPublicSecurityConfiguration {

  BasePublicSecurityConfig() {
    super("base");
    calendarsAndEvents();
    users();
    citizenUsers();
    mukFacilityLinks();
    bundIdPersonLinks();
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
    icd10codes();
  }

  private void citizenUsers() {
    requestMatchers(GET, BaseUrls.Base.CITIZEN_USER_API + "/self").permitAll();
  }

  private void mukFacilityLinks() {
    requestMatchers(GET, BaseUrls.Base.MUK_FACILITY_LINK_API + BaseUrls.Base.MUK_SELF_USER_FACILITY)
        .hasRole(CitizenPermissionRole.MUK_USER);
    requestMatchers(POST, BaseUrls.Base.MUK_FACILITY_LINK_API)
        .hasRole(EmployeePermissionRole.BASE_MUK_FACILITY_LINK_WRITE);
  }

  private void bundIdPersonLinks() {
    requestMatchers(
            GET, BaseUrls.Base.BUNDID_PERSON_LINK_API + BaseUrls.Base.BUNDID_SELF_USER_PERSON)
        .hasRole(CitizenPermissionRole.BUND_ID_USER);
    requestMatchers(POST, BaseUrls.Base.BUNDID_PERSON_LINK_API)
        .hasRole(EmployeePermissionRole.BASE_BUND_ID_PERSON_LINK_WRITE);
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
        .hasAnyRole(
            EmployeePermissionRole.BASE_PERSONS_READ, EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(GET, BaseUrls.Base.PERSON_API + "/centralfilestates/*/diff")
        .hasRole(EmployeePermissionRole.BASE_PERSONS_READ);
    requestMatchers(POST, BaseUrls.Base.PERSON_API + "/reference/*/update")
        .hasAnyRole(
            EmployeePermissionRole.BASE_PERSONS_WRITE,
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
  }

  private void facilities() {
    requestMatchers(GET, BaseUrls.Base.FACILITY_API)
        .hasAnyRole(
            EmployeePermissionRole.BASE_FACILITIES_READ,
            EmployeePermissionRole.PROCEDURE_ARCHIVE,
            EmployeePermissionRole.PROCEDURE_ARCHIVE_ADMIN);
    requestMatchers(GET, BaseUrls.Base.FACILITY_API + "/centralfilestates/*/diff")
        .hasRole(EmployeePermissionRole.BASE_FACILITIES_READ);
    requestMatchers(POST, BaseUrls.Base.FACILITY_API + "/reference/*/update")
        .hasAnyRole(
            EmployeePermissionRole.BASE_FACILITIES_WRITE,
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
  }

  private void gdpr() {
    requestMatchers(GET, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.CENTRAL_FILE_DOWNLOAD_PACKAGE)
        .hasAnyRole(
            EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ,
            CitizenPermissionRole.BUND_ID_USER,
            CitizenPermissionRole.MUK_USER);
    gdprOnlinePortal();
    gdprEmployee();
  }

  private void gdprOnlinePortal() {
    requestMatchers(
            GET,
            BaseUrls.Base.GDPR_PROCEDURE_API
                + BaseUrls.Base.GDPR_PROCEDURE_CITIZEN_PORTAL_URL
                + "/self/linked-gdpr-procedures")
        .hasAnyRole(CitizenPermissionRole.BUND_ID_USER, CitizenPermissionRole.MUK_USER);

    requestMatchers(
            POST,
            BaseUrls.Base.GDPR_PROCEDURE_API + BaseUrls.Base.GDPR_PROCEDURE_CITIZEN_PORTAL_URL)
        .hasAnyRole(CitizenPermissionRole.BUND_ID_USER, CitizenPermissionRole.MUK_USER);
  }

  private void gdprEmployee() {
    requestMatchers(GET, BaseUrls.Base.GDPR_PROCEDURE_API)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ);
    requestMatchers(GET, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.DETAILS_PAGE)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ);
    requestMatchers(GET, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.REPORT_DOCUMENT)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_READ);

    requestMatchers(PUT, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.MATTER_OF_CONCERN)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);

    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.BY_ID)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.REFRESH_STATUS)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.START_PROCEDURE)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.CANCEL_PROCEDURE)
        .hasRole(EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE);
    requestMatchers(POST, BaseUrls.Base.GDPR_PROCEDURE_API + Gdpr.CLOSE_PROCEDURE)
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
    requestMatchers(GET, BaseUrls.Base.CONTACT_API + "/{id}")
        .hasAnyRole(
            EmployeePermissionRole.BASE_CONTACTS_READ,
            CitizenPermissionRole.ACCESS_CODE_USER,
            EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(GET, BaseUrls.Base.CONTACT_API + "/**")
        .hasAnyRole(
            EmployeePermissionRole.BASE_CONTACTS_READ, EmployeePermissionRole.PROCEDURE_ARCHIVE);
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
        .hasAnyRole(
            EmployeePermissionRole.BASE_INVENTORY_READ, EmployeePermissionRole.PROCEDURE_ARCHIVE);
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
        .hasAnyRole(
            EmployeePermissionRole.BASE_RESOURCES_READ, EmployeePermissionRole.PROCEDURE_ARCHIVE);
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
    requestMatchers(GET, BaseUrls.Base.USER_API + "/self/keys/**")
        .hasRole(EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS);
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
    requestMatchers(
            GET, BaseUrls.Base.DEPARTMENT_API + BaseUrls.Base.DEPARTMENT_API_SECURITY_TXT_PGP_KEY)
        .permitAll();
    requestMatchers(GET, BaseUrls.Base.DEPARTMENT_API + BaseUrls.Base.DEPARTMENT_API_PRIVACY_POLICY)
        .permitAll();
    requestMatchers(GET, BaseUrls.Base.DEPARTMENT_API + BaseUrls.Base.DEPARTMENT_API_PRIVACY_NOTICE)
        .permitAll();
  }

  private void features() {
    requestMatchers(GET, BaseUrls.Base.FEATURE_TOGGLES_API).permitAll();
  }

  private void config() {
    requestMatchers(GET, BaseUrls.Base.PUBLIC_CONFIG_API).permitAll();
  }

  private void icd10codes() {
    requestMatchers(GET, Base.ICD_10_CODES_API).permitAll();
    requestMatchers(POST, Base.ICD_10_CODES_API).permitAll();
  }
}
