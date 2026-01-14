/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.validation.constraints.DateOfBirth;
import de.eshg.validation.constraints.EmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(name = "CreateApplicant")
public class CreateApplicantDto {
  private @Size(min = 1, max = 119) String title;
  private @NotNull GenderDto gender;
  private @NotNull @Size(min = 1, max = 80) String firstName;
  private @NotNull @Size(min = 1, max = 120) String lastName;
  private @NotNull @DateOfBirth(
      message =
          "Das Alter muss mindestens {minAgeInclusive} und darf höchstens {maxAgeInclusive} Jahre betragen")
  LocalDate dateOfBirth;
  private @Size(min = 1, max = 40) String nameAtBirth;
  private @NotNull @Size(min = 1, max = 50) String placeOfBirth;
  private @EmailAddressConstraint String emailAddress;
  private @NotNull @Size(min = 1, max = 23) String phoneNumber;
  private @NotNull @Valid ApplicantAddressDto address;
  private @NotNull CountryCode nationality;

  public CreateApplicantDto() {}

  public CreateApplicantDto(
      String title,
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String nameAtBirth,
      String placeOfBirth,
      String emailAddress,
      String phoneNumber,
      ApplicantAddressDto address,
      CountryCode nationality) {
    this.title = title;
    this.gender = gender;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.nameAtBirth = nameAtBirth;
    this.placeOfBirth = placeOfBirth;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.nationality = nationality;
  }

  public CreateApplicantDto(
      GenderDto gender,
      String firstName,
      String lastName,
      LocalDate dateOfBirth,
      String placeOfBirth,
      String phoneNumber,
      ApplicantAddressDto address,
      CountryCode nationality) {
    this(
        null,
        gender,
        firstName,
        lastName,
        dateOfBirth,
        null,
        placeOfBirth,
        null,
        phoneNumber,
        address,
        nationality);
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public GenderDto getGender() {
    return gender;
  }

  public void setGender(GenderDto gender) {
    this.gender = gender;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public String getNameAtBirth() {
    return nameAtBirth;
  }

  public void setNameAtBirth(String nameAtBirth) {
    this.nameAtBirth = nameAtBirth;
  }

  public String getPlaceOfBirth() {
    return placeOfBirth;
  }

  public void setPlaceOfBirth(String placeOfBirth) {
    this.placeOfBirth = placeOfBirth;
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

  public ApplicantAddressDto getAddress() {
    return address;
  }

  public void setAddress(ApplicantAddressDto address) {
    this.address = address;
  }

  public CountryCode getNationality() {
    return nationality;
  }

  public void setNationality(CountryCode nationality) {
    this.nationality = nationality;
  }
}
