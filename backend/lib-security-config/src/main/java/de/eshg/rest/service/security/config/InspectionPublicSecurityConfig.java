/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.*;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.rest.service.security.config.BaseUrls.Inspection;
import org.springframework.stereotype.Component;

@Component
public final class InspectionPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  InspectionPublicSecurityConfig() {
    super("inspection");

    //
    // Note that the order of request matchers is very important! Put the most specific
    // matchers first. For example, first match for `/checklists/definitions/**` with
    // specific rights, then for `/checklists/**` with a lesser right.
    //

    objectType();
    checklistDefinitionCentralRepository();
    checklistDefinition();
    procedure();
    editor();
    inspectionTestData();
    features();
    importer();

    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT, ModuleLeaderRole.INSPECTION_LEADER);
  }

  private void objectType() {
    requestMatchers(GET, BaseUrls.Inspection.OBJECT_TYPE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_OBJECTTYPES_READ);
    requestMatchers(BaseUrls.Inspection.OBJECT_TYPE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_OBJECTTYPES_WRITE);
  }

  private void checklistDefinitionCentralRepository() {
    requestMatchers(DELETE, Inspection.CHECKLIST_CONTROLLER_BASE_URL_CENTRAL_REPOSITORY + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_DELETE);
    requestMatchers(GET, Inspection.CHECKLIST_CONTROLLER_BASE_URL_CENTRAL_REPOSITORY + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_READ);
    requestMatchers(Inspection.CHECKLIST_CONTROLLER_BASE_URL_CENTRAL_REPOSITORY + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE);
  }

  private void checklistDefinition() {
    requestMatchers(GET, BaseUrls.Inspection.CHECKLIST_DEFINITION_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_READ);
    requestMatchers(
            BaseUrls.Inspection.CHECKLIST_DEFINITION_CONTROLLER + "/**",
            BaseUrls.Inspection.INSPECTION_TEST_DATA_CONTROLLER
                + "/checklists/definitions/test-data")
        .hasRole(EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_WRITE);
  }

  private void procedure() {
    requestMatchers(
            GET,
            BaseUrls.Inspection.INSPECTION_CONTROLLER + "/{id}/**",
            BaseUrls.Inspection.CHECKLIST_CONTROLLER + "/**",
            BaseUrls.Inspection.PACKLIST_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT,
            EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(
            BaseUrls.Inspection.INSPECTION_CONTROLLER + "/**",
            BaseUrls.Inspection.FACILITY_CONTROLLER + "/**",
            BaseUrls.Inspection.CHECKLIST_CONTROLLER + "/**",
            BaseUrls.Inspection.PACKLIST_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT);
  }

  private void editor() {
    requestMatchers(GET, BaseUrls.EditorLibrary.EDITOR_API + "/**")
        .hasAnyRole(
            EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT,
            EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(BaseUrls.EditorLibrary.EDITOR_API + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT);
    requestMatchers(BaseUrls.EditorLibrary.TEXTBLOCK_API + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT);
    requestMatchers(BaseUrls.Inspection.PACKLIST_DEFINITION_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT);
  }

  private void inspectionTestData() {
    requestMatchers(Inspection.INSPECTION_TEST_DATA_CONTROLLER + "/inspections/test-data")
        .hasRole(EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT);
  }

  private void features() {
    requestMatchers(GET, BaseUrls.Inspection.FEATURE_TOGGLES_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }

  private void importer() {
    requestMatchers(GET, Inspection.INSPECTION_IMPORT_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_IMPORT);
    requestMatchers(POST, Inspection.INSPECTION_IMPORT_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.INSPECTION_IMPORT);
  }
}
