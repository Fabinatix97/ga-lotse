/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config;

import static de.eshg.lib.editor.spring.EditorLibraryPrivateSecurityConfig.EDITOR_ACCESS_ROLE;
import static de.eshg.lib.editor.spring.EditorLibraryPrivateSecurityConfig.TEXTBLOCK_ACCESS_ROLE;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InspectionEditorConfiguration {

  @Bean(name = EDITOR_ACCESS_ROLE)
  EmployeePermissionRole editorAccessRole() {
    return EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT;
  }

  @Bean(name = TEXTBLOCK_ACCESS_ROLE)
  EmployeePermissionRole textblockAccessRole() {
    return EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT;
  }
}
