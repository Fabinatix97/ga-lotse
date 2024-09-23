/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.CsvBindByName;

public class MunicipalityDirectoryCsvEntry {
  @CsvBindByName(column = "Gemeindeschlüssel")
  private String municipalityKey;

  @CsvBindByName(column = "Gemeinde")
  private String municipality;

  @CsvBindByName(column = "Postleitzahl (von)")
  private String postalCodeFrom;

  @CsvBindByName(column = "Postleitzahl (bis)")
  private String postalCodeTo;

  public String municipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  public String municipalityKey() {
    return municipalityKey;
  }

  public void setMunicipalityKey(String municipalityKey) {
    this.municipalityKey = municipalityKey;
  }

  public String postalCodeFrom() {
    return postalCodeFrom;
  }

  public void setPostalCodeFrom(String postalCodeFrom) {
    this.postalCodeFrom = postalCodeFrom;
  }

  public String postalCodeTo() {
    return postalCodeTo;
  }

  public void setPostalCodeTo(String postalCodeTo) {
    this.postalCodeTo = postalCodeTo;
  }
}
