/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.CsvBindByName;
import de.eshg.base.street.csv.opencsv.CsvWritePosition;

public class MunicipalityDirectoryCsvEntry {
  @CsvBindByName(column = "Gemeindeschlüssel")
  @CsvWritePosition(0)
  private String municipalityKey;

  @CsvBindByName(column = "Gemeinde")
  @CsvWritePosition(1)
  private String municipality;

  @CsvBindByName(column = "Postleitzahl (von)")
  @CsvWritePosition(2)
  private String postalCodeFrom;

  @CsvBindByName(column = "Postleitzahl (bis)")
  @CsvWritePosition(3)
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
