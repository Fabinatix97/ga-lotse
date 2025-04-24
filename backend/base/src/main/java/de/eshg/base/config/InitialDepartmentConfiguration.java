/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "eshg.department")
record InitialDepartmentConfiguration(
    @NotNull Resource logo,
    @NotNull Resource securityTxt,
    @NotNull Resource securityTxtPublicKey,
    @NotNull Resource streetDirectory,
    @NotNull Resource municipalityDirectory,
    @NotNull Resource citizenPortalAccessibilityStatementMarkdownDe,
    @NotNull Resource employeePortalAccessibilityStatementMarkdownDe,
    @NotNull Resource acknowledgementsMarkdownDe,
    @NotNull Resource contactMarkdownDe,
    @NotNull Resource imprintMarkdownDe,
    @NotNull Resource citizenPortalPrivacyPolicyMarkdownDe,
    @NotNull Resource employeePortalPrivacyPolicyMarkdownDe) {
  InitialDepartmentConfiguration {
    assertIsReadable(logo, "Department logo");
    assertIsReadable(securityTxt, "Department security txt");
    assertIsReadable(securityTxtPublicKey, "Department security txt public key");
    assertIsReadable(streetDirectory, "Department street directory");
    assertIsReadable(municipalityDirectory, "Department municipality directory");
    assertIsReadable(
        citizenPortalAccessibilityStatementMarkdownDe,
        "Department citizen portal accessibility markdown (de)");
    assertIsReadable(
        employeePortalAccessibilityStatementMarkdownDe,
        "Department employee portal accessibility markdown (de)");
    assertIsReadable(acknowledgementsMarkdownDe, "Acknowledgements markdown (de)");
    assertIsReadable(contactMarkdownDe, "Department contact markdown (de)");
    assertIsReadable(imprintMarkdownDe, "Department imprint markdown (de)");
    assertIsReadable(
        citizenPortalPrivacyPolicyMarkdownDe, "Department citizen portal privacy markdown (de)");
    assertIsReadable(
        employeePortalPrivacyPolicyMarkdownDe, "Department employee portal privacy markdown (de)");
  }
}
