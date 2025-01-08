/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.medicalhistory;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import de.eshg.travelmedicine.document.api.DocumentContentDto;
import java.util.List;

public class MedicalHistoryPdfParameters {
  private static final String TITLE =
      "Reisemedizinische Beratung und Impfungen für In- und Ausland";

  private final GetDepartmentInfoResponse departmentInfo;
  private final DepartmentLogo departmentLogo;

  private final String firstName;
  private final String lastName;
  private final String street;
  private final String houseNumber;
  private final String postalCode;
  private final String city;
  private final String dateOfBirth;
  private final String phoneNumber;
  private final String emailAddress;

  private final String travelDate;
  private final String travelType;
  private final String travelDestinations;
  private final String travelDuration;

  private final DocumentContentDto documentContent;

  public MedicalHistoryPdfParameters(
      GetDepartmentInfoResponse departmentInfo,
      DepartmentLogo departmentLogo,
      String firstName,
      String lastName,
      String street,
      String houseNumber,
      String postalCode,
      String city,
      String dateOfBirth,
      String phoneNumber,
      String emailAddress,
      String travelDate,
      String travelType,
      List<CountryCode> travelDestinations,
      String travelDuration,
      DocumentContentDto documentContent) {
    this.departmentInfo = departmentInfo;
    this.departmentLogo = departmentLogo;
    this.firstName = firstName;
    this.lastName = lastName;
    this.street = street;
    this.houseNumber = houseNumber;
    this.postalCode = postalCode;
    this.city = city;
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.emailAddress = emailAddress;
    this.travelDate = travelDate;
    this.travelType = travelType;
    this.travelDestinations =
        String.join(", ", travelDestinations.stream().map(CountryCode::getCountryName).toList());
    this.travelDuration = travelDuration;
    this.documentContent = documentContent;
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfo;
  }

  public DepartmentLogo getDepartmentLogo() {
    return departmentLogo;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getStreet() {
    return street;
  }

  public String getHouseNumber() {
    return houseNumber;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public String getCity() {
    return city;
  }

  public String getDateOfBirth() {
    return dateOfBirth;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public String getEmailAddress() {
    return emailAddress;
  }

  public String getTravelDate() {
    return travelDate;
  }

  public String getTravelType() {
    return travelType;
  }

  public String getTravelDestinations() {
    return travelDestinations;
  }

  public String getTravelDuration() {
    return travelDuration;
  }

  public DocumentContentDto getDocumentContent() {
    return documentContent;
  }

  public String getTitle() {
    return TITLE;
  }

  public String getFileName() {
    return "anamnesebogen-%s.pdf".formatted(getLastName().toLowerCase());
  }
}
