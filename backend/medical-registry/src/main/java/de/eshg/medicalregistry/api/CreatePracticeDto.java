/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(name = "CreatePractice")
public class CreatePracticeDto {

  @NotNull
  @Size(min = 1, max = 300)
  private String name;

  @NotNull @MandatoryEmailAddressConstraint private String emailAddress;

  @NotNull
  @Size(min = 1, max = 23)
  private String phoneNumber;

  @NotNull @Valid private PracticeAddressDto address;

  @Size(min = 6, max = 254)
  private String website;

  @Pattern(regexp = "\\d+")
  private String institutionIdentifier;

  @Pattern(regexp = "\\d+")
  private String establishmentNumber;

  @NotNull Boolean healthInsuranceAuthorization;
  private String openingHours;

  public CreatePracticeDto() {}

  public CreatePracticeDto(
      String name,
      String emailAddress,
      String phoneNumber,
      PracticeAddressDto address,
      boolean healthInsuranceAuthorization) {
    this(
        name,
        emailAddress,
        phoneNumber,
        address,
        null,
        null,
        null,
        healthInsuranceAuthorization,
        null);
  }

  public CreatePracticeDto(
      String name,
      String emailAddress,
      String phoneNumber,
      PracticeAddressDto address,
      String website,
      String institutionIdentifier,
      String establishmentNumber,
      boolean healthInsuranceAuthorization,
      String openingHours) {
    this.name = name;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.website = website;
    this.institutionIdentifier = institutionIdentifier;
    this.establishmentNumber = establishmentNumber;
    this.healthInsuranceAuthorization = healthInsuranceAuthorization;
    this.openingHours = openingHours;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmailAddress() {
    return emailAddress;
  }

  public void setEmailAddress(String emailAddress) {
    this.emailAddress = emailAddress;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public PracticeAddressDto getAddress() {
    return address;
  }

  public void setAddress(PracticeAddressDto address) {
    this.address = address;
  }

  public String getWebsite() {
    return website;
  }

  public void setWebsite(String website) {
    this.website = website;
  }

  public String getInstitutionIdentifier() {
    return institutionIdentifier;
  }

  public void setInstitutionIdentifier(String institutionIdentifier) {
    this.institutionIdentifier = institutionIdentifier;
  }

  public String getEstablishmentNumber() {
    return establishmentNumber;
  }

  public void setEstablishmentNumber(String establishmentNumber) {
    this.establishmentNumber = establishmentNumber;
  }

  public Boolean getHealthInsuranceAuthorization() {
    return healthInsuranceAuthorization;
  }

  public void setHealthInsuranceAuthorization(Boolean healthInsuranceAuthorization) {
    this.healthInsuranceAuthorization = healthInsuranceAuthorization;
  }

  public String getOpeningHours() {
    return openingHours;
  }

  public void setOpeningHours(String openingHours) {
    this.openingHours = openingHours;
  }
}
