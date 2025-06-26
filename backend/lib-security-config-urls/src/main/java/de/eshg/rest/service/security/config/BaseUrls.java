/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

public final class BaseUrls {

  public static final String STATISTICS = "/statistics";
  public static final String EVENT_METADATA_API = "/events/metadata";

  private BaseUrls() {}

  public static final class LibAppointmentBlock {
    public static final String APPOINTMENT_BLOCK_API = "/appointment-blocks";
    public static final String APPOINTMENT_TYPE_API = "/appointment-types";
    public static final String APPOINTMENT_STANDARD_DURATION_API =
        DepartmentInfoLibrary.CONFIGURATION_API + "/appointment-standard-duration";

    private LibAppointmentBlock() {}
  }

  public static final class Base {
    public static final String BULK_GET_URL_END = "/bulk-get";

    public static final String USER_API = "/users";
    public static final String USER_KEYS_URL = "/keys";
    public static final String USER_PUBLIC_KEYS_URL = "/public";

    public static final String FEATURE_TOGGLES_API = "/feature-toggles";

    public static final String USER_SELF_URL = "/self";
    public static final String USER_SELF_CHAT_ATTRIBUTES_URL = "/self/chat-attributes";
    public static final String CITIZEN_USER_API = "/citizen-users";
    public static final String CITIZEN_USER_SELF_URL = "/self";
    public static final String CITIZEN_ACCESS_CODE_USER_API = "/citizen-access-code-users";
    public static final String CALENDAR_API = "/calendars";
    public static final String CALENDAR_API_GLOBAL_CALENDAR_URL = "/global";
    public static final String CALENDAR_API_USER_CALENDAR_URL = "/user";
    public static final String CALENDAR_API_RESOURCE_CALENDAR_URL = "/resource";

    public static final String CALENDAR_EVENT_API_EVENT_URL = "/events";
    public static final String CALENDAR_EVENT_API_BUSINESS_MODULE_EVENT_URL =
        CALENDAR_EVENT_API_EVENT_URL + "/business_module";
    public static final String CALENDAR_EVENT_API_BASE_EVENT_URL =
        CALENDAR_EVENT_API_EVENT_URL + "/base_event";
    public static final String NOTIFICATION_API_BASE_URL = "/notification-aggregation";
    public static final String LABEL_API = "/labels";
    public static final String STREET_API = "/streets";
    public static final String PERSON_API = "/persons";
    public static final String PERSON_FILE_STATE_URL = "/centralfilestates";
    public static final String PERSON_EXTERNAL_DATA_SOURCE_URL = "/external-source";
    public static final String BUNDID_PERSON_LINK_API = "/bundid-person-link";
    public static final String BUNDID_SELF_USER_PERSON = "/self/person";
    public static final String INVENTORY_API = "/inventoryItems";
    public static final String INVENTORY_BOOKING_URL = "/booking";
    public static final String INVENTORY_RESTOCKING_URL = "/restocking";
    public static final String INVENTORY_CORRECTION_URL = "/correction";
    public static final String RESOURCES_API = "/resources";
    public static final String CONTACT_API = "/contacts";
    public static final String PUBLIC_DEPARTMENT_API = "/public/department";
    public static final String EMPLOYEE_DEPARTMENT_API = "/department";
    public static final String DEPARTMENT_API_INFO = "/info";
    public static final String DEPARTMENT_API_LOGO = "/logo";
    public static final String DEPARTMENT_API_PRIVACY_POLICY = "/privacy-policy";
    public static final String DEPARTMENT_API_PRIVACY_NOTICE = "/privacy-notice";
    public static final String DEPARTMENT_API_SECURITY_TXT = "/security-txt";
    public static final String DEPARTMENT_API_SECURITY_TXT_PGP_KEY = "/security-txt-public-key";
    public static final String DEPARTMENT_API_MARKDOWN = "/markdown";
    public static final String DEPARTMENT_API_MARKDOWN_CITIZEN =
        DEPARTMENT_API_MARKDOWN + "/citizen";
    public static final String DEPARTMENT_API_MARKDOWN_EMPLOYEE =
        DEPARTMENT_API_MARKDOWN + "/employee";
    public static final String DEPARTMENT_API_MARKDOWN_RELEASE_NOTES =
        DEPARTMENT_API_MARKDOWN + "/release-notes";
    public static final String ACCESSIBILITY_STATEMENT_MARKDOWN_CONFIG_API =
        "/accessibility-statement";
    public static final String ACKNOWLEDGEMENTS_MARKDOWN_CONFIG_API = "/acknowledgements";
    public static final String CONTACT_MARKDOWN_CONFIG_API = "/contact";
    public static final String IMPRINT_MARKDOWN_CONFIG_API = "/imprint";
    public static final String PRIVACY_POLICY_MARKDOWN_CONFIG_API = "/privacy-policy";
    public static final String LOGO_SVG_CONFIG_API = "/logo";
    public static final String CONFIGURATION_API_MARKDOWN_FILES_CITIZEN = "/markdown/citizen";
    public static final String CONFIGURATION_API_MARKDOWN_FILES_EMPLOYEE = "/markdown/employee";
    public static final String CONTACT_PARSE_VCARD_URL = "/parse-vcard";
    public static final String GDPR_PROCEDURE_API = "/gdpr-procedures";
    public static final String GDPR_PROCEDURE_CITIZEN_PORTAL_URL = "/citizen-portal";

    public static final class Gdpr {
      public static final String DOWNLOADS = "/{id}/downloads";
      public static final String DELETE_DOWNLOADS = "/{id}/delete-downloads";
      public static final String FILE_STATE_IDS = "/{id}/fileStateIds";
      public static final String BY_ID = "/{id}";
      public static final String DETAILS_PAGE = "/{id}/details-page";
      public static final String REPORT_DOCUMENT = "/{id}/report-document";
      public static final String MATTER_OF_CONCERN = "/{id}/matter-of-concern";
      public static final String REFRESH_STATUS = "/{id}/refresh-status";
      public static final String START_PROCEDURE = "/{id}/start-procedure";
      public static final String CANCEL_PROCEDURE = "/{id}/cancel-procedure";
      public static final String CLOSE_PROCEDURE = "/{id}/close-procedure";
      public static final String CENTRAL_FILE_DOWNLOAD_PACKAGE =
          "/{id}/central-file-download-package";

      private Gdpr() {}
    }

    public static final String FACILITY_API = "/facilities";
    public static final String FACILITY_FILE_STATE_URL = "/centralfilestates";
    public static final String FACILITY_EXTERNAL_DATA_SOURCE_URL = "/external-source";
    public static final String MUK_FACILITY_LINK_API = "/muk-facility-link";
    public static final String MUK_SELF_USER_FACILITY = "/self/facility";
    public static final String STREET_AUTOCOMPLETE_URL = "/autocomplete";
    public static final String POST_CODE_AND_CITY_URL = "/postcode-and-city";
    public static final String SELF_RECENT_PROCEDURES_API = "/recent-procedures";
    public static final String PROCEDURE_METRICS_API = "/procedure-metrics";
    public static final String TASK_METRICS_API = "/task-metrics";
    public static final String TASK_API = "/tasks";
    public static final String PUBLIC_CONFIG_API = "/public/config";
    public static final String ICD_10_CODES_API = "/icd10-codes";

    private Base() {}
  }

  public static final class Inspection {
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";
    public static final String OBJECT_TYPE_CONTROLLER = "/objecttypes";
    public static final String INSPECTION_TEST_DATA_CONTROLLER = "/test-data";
    public static final String INSPECTION_CONTROLLER = "/inspections";
    public static final String INSPECTION_GEO_CONTROLLER = INSPECTION_CONTROLLER + "/geo";
    public static final String FACILITY_CONTROLLER = "/facilities";
    public static final String CHECKLIST_CONTROLLER = "/checklists";
    public static final String CHECKLIST_DEFINITION_CONTROLLER =
        CHECKLIST_CONTROLLER + "/definitions";
    public static final String CHECKLIST_CONTROLLER_BASE_URL_CENTRAL_REPOSITORY =
        CHECKLIST_DEFINITION_CONTROLLER + "/central-repository";
    public static final String PACKLIST_CONTROLLER = "/packlists";
    public static final String PACKLIST_DEFINITION_CONTROLLER =
        PACKLIST_CONTROLLER + "/definitions";
    public static final String INSPECTION_IMPORT_CONTROLLER = "/import";

    private Inspection() {}
  }

  public static final class SchoolEntry {
    public static final String SCHOOL_ENTRY_CONTROLLER = "/school-entries";
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";
    public static final String CONFIG_CONTROLLER = "/config";
    public static final String SCHOOL_ENTRY_CITIZEN_CONTROLLER = "/citizen/auth";
    public static final String PUBLIC_CITIZEN_CONTROLLER = "/citizen/public";
    public static final String VALUE_EVALUATOR_CONTROLLER = "/value-evaluation";
    public static final String PROCEDURE_LABEL_CONTROLLER = "/school-entry-procedure-labels";
    public static final String COUNTRY_CODES_CONTROLLER = "/country-codes";
    public static final String IMPORT_CONTROLLER = "/import";

    private SchoolEntry() {}
  }

  public static final class TravelMedicine {
    public static final String INFORMATION_STATEMENT_TEMPLATE_CONTROLLER =
        "/information-statement-templates";
    public static final String MEDICAL_HISTORY_TEMPLATE_CONTROLLER = "/medical-history-templates";
    public static final String MEDICAL_HISTORY_CONTROLLER = "/medical-histories";
    public static final String VACCINE_CONTROLLER = "/vaccines";
    public static final String DISEASE_CONTROLLER = "/diseases";
    public static final String OTHER_SERVICE_TEMPLATE_CONTROLLER = "/other-service-templates";
    public static final String VACCINATION_CONSULTATION_CONTROLLER = "/vaccination-consultations";
    public static final String PROCEDURE_STEP_CONTROLLER = "/procedure-steps";
    public static final String UNUSED_BASE_INVENTORY_VACCINE_CONTROLLER =
        "/unused-inventory-vaccines";
    public static final String CITIZEN_PUBLIC_CONTROLLER = "/citizen/public";
    public static final String CITIZEN_AUTH_CONTROLLER = "/citizen/auth";
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";

    private TravelMedicine() {}
  }

  public static final class MeaslesProtection {
    public static final String PROCEDURE_CONTROLLER = "/protection-procedures";
    public static final String ORGANISATION_CONTROLLER = "/organisations";
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";

    private MeaslesProtection() {}
  }

  public static final class StiProtection {
    public static final String PROCEDURE_CONTROLLER = "/sti-procedures";
    public static final String CITIZEN_CONTROLLER = "/citizen/auth";
    public static final String CITIZEN_PUBLIC_CONTROLLER = "/citizen/public";

    private StiProtection() {}
  }

  public static final class MedsAbroad {
    public static final String PROCEDURE_CONTROLLER = "/meds-abroad-procedures";
    public static final String CITIZEN_PUBLIC_CONTROLLER = "/citizen/public";

    private MedsAbroad() {}
  }

  public static final class MedicalRegistry {
    public static final String MEDICAL_REGISTRY_CONTROLLER = "/medical-registry-entries";
    public static final String CITIZEN_PORTAL_ENDPOINT = "/public";
    public static final String MEDICAL_REGISTRY_IMPORT_CONTROLLER = "/import";
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";

    private MedicalRegistry() {}
  }

  public static final class Dental {
    public static final String CHILD_CONTROLLER = "/children";
    public static final String PROCEDURE_LABEL_CONTROLLER = "/dental-procedure-labels";
    public static final String PROPHYLAXIS_SESSION_CONTROLLER = "/prophylaxis-sessions";

    private Dental() {}
  }

  public static final class Statistics {
    public static final String EVALUATION_CONTROLLER = "/evaluation";
    public static final String RETRIEVE_DATA_URL = "/retrieve-data";
    public static final String ANALYSIS_URL = EVALUATION_CONTROLLER + "/analysis";
    public static final String REPORT_URL = EVALUATION_CONTROLLER + "/report";
    public static final String REPORT_SERIES_URL = EVALUATION_CONTROLLER + "/report-series";

    public static final String DATA_EXPORT_CONTROLLER = "/data-export";
    public static final String DATA_SOURCE_CONTROLLER = "/data-source";
    public static final String FILTER_TEMPLATE_CONTROLLER = "/filter-template";
    public static final String GEO_SHAPE_CONTROLLER = "/geo-shape";
    public static final String EVALUATION_TEMPLATE_CONTROLLER = "/evaluation-template";
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";
    public static final String CENTRAL_REPOSITORY_CONTROLLER = "/central-repository";

    private Statistics() {}
  }

  public static final class AuditLog {
    public static final String AUDIT_LOG_CONTROLLER = "/auditlog";

    private AuditLog() {}
  }

  public static final class ChatManagement {
    public static final String USER_SETTINGS_CONTROLLER = "/user-settings";
    public static final String USER_ACCOUNT_CONTROLLER = "/user-account";

    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";

    private ChatManagement() {}
  }

  public static final class ProcedureLibrary {
    public static final String PROCEDURES_API = "/procedures";
    public static final String PROGRESS_ENTRIES_API =
        PROCEDURES_API + "/{procedureId}/progress-entries";
    public static final String PROCEDURE_METRICS_API = "/procedure-metrics";
    public static final String FILES_API = "/files";
    public static final String INBOX_PROCEDURES_API = "/inbox-procedures";
    public static final String TASKS_API = "/tasks";
    public static final String TASK_METRICS_API = "/task-metrics";
    public static final String ARCHIVING_API = "/archiving";
    public static final String TASKS_TEAM_VIEW = TASKS_API + "/team-view";
    public static final String GDPR_VALIDATION_TASK_API = "/gdpr-validation-tasks";

    public static final class Gdpr {
      public static final String NOTIFICATION_BANNER = "/notification-banner";
      public static final String BY_GDPR_ID = "/{gdprProcedureId}";
      public static final String BUSINESS_PROCEDURES = "/{gdprProcedureId}/business-procedures";
      public static final String BUSINESS_PROCEDURE =
          "/{gdprProcedureId}/business-procedures/{businessProcedureId}";
      public static final String BUSINESS_PROCEDURE_DOWNLOAD_PACKAGE =
          "/{gdprProcedureId}/business-procedures/{businessProcedureId}/downloadPackage";
      public static final String DOWNLOAD_PACKAGES_INFO = "/{gdprProcedureId}/download-packages";
      public static final String DOWNLOAD_PACKAGE =
          "/{gdprProcedureId}/download-packages/{downloadId}";
      public static final String CLOSE_PROCEDURE = "/{gdprProcedureId}/close";

      private Gdpr() {}
    }

    private ProcedureLibrary() {}
  }

  public static final class ContactLibrary {
    public static final String CONTACT_EVENT_CALLBACK_API = "/contact-events";

    private ContactLibrary() {}
  }

  public static final class FourEyesLibrary {
    public static final String APPROVAL_REQUESTS_API = "/approval-requests";

    private FourEyesLibrary() {}
  }

  public static final class EditorLibrary {
    public static final String EDITOR_API = "/editor";
    public static final String TEXTBLOCK_API = "/textblocks";

    private EditorLibrary() {}
  }

  public static final class DepartmentInfoLibrary {
    public static final String CONFIGURATION_API = "/configuration";
  }

  public static final class OpenData {
    public static final String OPEN_DATA_CONTROLLER = "/open-documents";
    public static final String PUBLIC_CITIZEN_CONTROLLER = "/citizen/public";
    public static final String FEATURE_TOGGLES_CONTROLLER = "/feature-toggles";

    private OpenData() {}
  }

  public static final class OfficialMedicalService {
    public static final String EMPLOYEE_API = "/employee";
    public static final String CITIZEN_PUBLIC_API = "/citizen-public";
    public static final String CITIZEN_AUTH_API = "/citizen-auth";

    private OfficialMedicalService() {}
  }
}
