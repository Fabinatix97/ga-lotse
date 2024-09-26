/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.eshg.base.util.CountryCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "eshg.department")
public record DepartmentConfiguration(
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

  public DepartmentConfiguration(
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
    this.name = name;
    this.abbreviation = abbreviation;
    this.street = street;
    this.houseNumber = houseNumber;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.phoneNumber = phoneNumber;
    this.homepage = homepage;
    this.email = email;
    this.latitude = latitude;
    this.longitude = longitude;
    this.securityTxt = securityTxt;
    this.securityTxtPublicKey = securityTxtPublicKey;
    this.logo = logo;
    this.streetDirectory = streetDirectory;
    this.municipalityDirectory = municipalityDirectory;

    assertIsReadable(logo, "Department logo");
    assertIsReadable(securityTxt, "Department security txt");
    assertIsReadable(securityTxtPublicKey, "Department security txt public key");
    assertIsReadable(streetDirectory, "Department street directory");
    assertIsReadable(municipalityDirectory, "Department municipality directory");
  }

  private static void assertIsReadable(Resource resource, String resourceName) {
    if (resource != null) {
      Assert.isTrue(
          resource.isReadable(), "%s file must exist and be readable.".formatted(resourceName));
    }
  }
}
