/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.document.generator.department.DepartmentLogo;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

public class HealthInsuranceCertificatePdfParameters {
  private static final String TITLE = "Bescheinigung zur Vorlage bei der Krankenkasse";
  private static final String SUBTITLE =
      "Kosten pro Schutzimpfung gemäß GOÄ (2, 3-fach) und Impfstoffkosten bzw. Kosten für jede Leistung bzw. Untersuchung";

  private final GetDepartmentInfoResponse departmentInfo;
  private final DepartmentLogo departmentLogo;

  private final String salutation;
  private final String firstName;
  private final String lastName;

  private final String street;
  private final String houseNumber;
  private final String addressAddition;
  private final String postalCode;
  private final String city;
  private final String country;

  private final String dateOfBirth;

  private final String travelDate;
  private final String travelType;
  private final List<String> travelDestinations;
  private final String travelDuration;

  private final List<PdfServiceParameters> pdfServiceParameters;

  private final BigDecimal serviceTotalCost;

  public HealthInsuranceCertificatePdfParameters(
      GetDepartmentInfoResponse departmentInfo,
      DepartmentLogo departmentLogo,
      String salutation,
      String firstName,
      String lastName,
      String street,
      String houseNumber,
      String addressAddition,
      String postalCode,
      String city,
      String country,
      String dateOfBirth,
      String travelDate,
      String travelType,
      List<CountryCode> travelDestinations,
      String travelDuration,
      List<PdfServiceParameters> pdfServiceParameters) {
    this.departmentInfo = departmentInfo;
    this.departmentLogo = departmentLogo;
    this.salutation = salutation;
    this.firstName = firstName;
    this.lastName = lastName;
    this.street = street;
    this.houseNumber = houseNumber;
    this.addressAddition = addressAddition;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.dateOfBirth = dateOfBirth;
    this.travelDate = travelDate;
    this.travelType = travelType;
    this.travelDestinations = travelDestinations.stream().map(CountryCode::getCountryName).toList();
    this.travelDuration = travelDuration;
    this.pdfServiceParameters = pdfServiceParameters;
    this.serviceTotalCost =
        pdfServiceParameters.stream()
            .map(PdfServiceParameters::getFee)
            .reduce(BigDecimal::add)
            .orElse(BigDecimal.ZERO);
  }

  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfo;
  }

  public DepartmentLogo getDepartmentLogo() {
    return departmentLogo;
  }

  public String getSalutation() {
    return salutation;
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

  public String getAddressAddition() {
    return addressAddition;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public String getCity() {
    return city;
  }

  public String getCountry() {
    return country;
  }

  public String getDateOfBirth() {
    return dateOfBirth;
  }

  public String getTravelDate() {
    return travelDate;
  }

  public String getTravelType() {
    return travelType;
  }

  public List<String> getTravelDestinations() {
    return travelDestinations;
  }

  public String getTravelDuration() {
    return travelDuration;
  }

  public List<PdfServiceParameters> getPdfServiceParameters() {
    return pdfServiceParameters;
  }

  public String getServiceTotalCost() {
    return NumberFormat.getCurrencyInstance(Locale.GERMANY).format(serviceTotalCost);
  }

  public String getTitle() {
    return TITLE;
  }

  public String getSubTitle() {
    return SUBTITLE;
  }
}
