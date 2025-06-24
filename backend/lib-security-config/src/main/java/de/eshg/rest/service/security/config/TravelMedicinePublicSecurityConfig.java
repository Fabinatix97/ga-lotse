/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class TravelMedicinePublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  TravelMedicinePublicSecurityConfig() {
    super("travel-medicine");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN, true);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN, ModuleLeaderRole.TRAVEL_MEDICINE_LEADER);
    grantAccessToConfiguration();
    grantAccessToStatistics(EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN);

    requestMatchers(
            BaseUrls.TravelMedicine.CITIZEN_PUBLIC_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.FEATURE_TOGGLES_CONTROLLER + "/**")
        .permitAll();

    requestMatchers(BaseUrls.TravelMedicine.CITIZEN_AUTH_CONTROLLER + "/**")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER);

    requestMatchers(
            GET,
            BaseUrls.TravelMedicine.INFORMATION_STATEMENT_TEMPLATE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.VACCINE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.DISEASE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.OTHER_SERVICE_TEMPLATE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.VACCINATION_CONSULTATION_CONTROLLER + "/{procedureId}/**",
            BaseUrls.TravelMedicine.PROCEDURE_STEP_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.PROCEDURE_ARCHIVE, EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN);
    requestMatchers(
            BaseUrls.TravelMedicine.INFORMATION_STATEMENT_TEMPLATE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.MEDICAL_HISTORY_TEMPLATE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.MEDICAL_HISTORY_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.VACCINE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.DISEASE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.OTHER_SERVICE_TEMPLATE_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.VACCINATION_CONSULTATION_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.PROCEDURE_STEP_CONTROLLER + "/**",
            BaseUrls.TravelMedicine.UNUSED_BASE_INVENTORY_VACCINE_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**",
            BaseUrls.EditorLibrary.EDITOR_API + "/**",
            BaseUrls.EditorLibrary.TEXTBLOCK_API + "/**")
        .hasRole(EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN);
  }
}
