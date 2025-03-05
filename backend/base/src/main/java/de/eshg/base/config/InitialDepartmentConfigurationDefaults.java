/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import de.eshg.lib.common.CountryCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "eshg.department")
record InitialDepartmentConfigurationDefaults(
    @NotBlank String name,
    @NotBlank String abbreviation,
    @NotBlank String street,
    @NotBlank String houseNumber,
    @NotBlank String postalCode,
    @NotBlank String city,
    @NotNull CountryCode country,
    @NotBlank String phoneNumber,
    @NotBlank String homepage,
    @NotBlank String email,
    @NotNull Double latitude,
    @NotNull Double longitude,
    @NotNull Resource logo,
    @NotNull Resource securityTxt,
    @NotNull Resource securityTxtPublicKey,
    @NotNull Resource streetDirectory,
    @NotNull Resource municipalityDirectory) {

  InitialDepartmentConfigurationDefaults {
    assertIsReadable(logo, "Department logo");
    assertIsReadable(securityTxt, "Department security txt");
    assertIsReadable(securityTxtPublicKey, "Department security txt public key");
    assertIsReadable(streetDirectory, "Department street directory");
    assertIsReadable(municipalityDirectory, "Department municipality directory");
  }
}
