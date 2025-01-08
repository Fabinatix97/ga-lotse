/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import de.eshg.base.street.StreetDirectory;
import de.eshg.base.street.csv.opencsv.CsvWritePosition;

public class StreetDirectoryCsvEntry implements StreetDirectory.EntryFields {
  @CsvBindByName(column = "Straßennummer")
  @CsvWritePosition(0)
  private String streetNumber;

  @CsvCustomBindByName(column = "Straßenname", converter = StreetNameConverter.class)
  @CsvWritePosition(1)
  private final StreetName streetName = new StreetName();

  @CsvBindByName(column = "Folge")
  @CsvWritePosition(2)
  private String evenOddSequence;

  @CsvBindByName(column = "Hausnr. (von)")
  @CsvWritePosition(3)
  private String houseNumberFrom;

  @CsvBindByName(column = "Zusatz zur Hausnr (von)")
  @CsvWritePosition(4)
  private String houseNumberFromAddition;

  @CsvBindByName(column = "Hausnr. (bis)")
  @CsvWritePosition(5)
  private String houseNumberTo;

  @CsvBindByName(column = "Zusatz zur Hausnr (bis)")
  @CsvWritePosition(6)
  private String houseNumberToAddition;

  @CsvBindByName(column = "Ortsbezirk")
  @CsvWritePosition(7)
  private String localDistrict;

  @CsvBindByName(column = "Stadtteil Name")
  @CsvWritePosition(8)
  private String districtName;

  @CsvBindByName(column = "Stadtbezirk")
  @CsvWritePosition(9)
  private String cityDistrict;

  @CsvBindByName(column = "Stadtbezirksvorst")
  @CsvWritePosition(10)
  private String cityDistrictPrefecture;

  @CsvBindByName(column = "Schiedsleutebezirk")
  @CsvWritePosition(11)
  private String arbitratorsDistrict;

  @CsvBindByName(column = "Sozialrathaus Name")
  @CsvWritePosition(12)
  private String socialTownHallName;

  @CsvBindByName(column = "Polizeirevier")
  @CsvWritePosition(13)
  private String policeStation;

  @CsvBindByName(column = "Postleitzahl")
  @CsvWritePosition(14)
  private String postalCode;

  public String streetNumber() {
    return streetNumber;
  }

  public void setStreetNumber(String streetNumber) {
    this.streetNumber = streetNumber;
  }

  public String streetName() {
    return streetName.getStreetName();
  }

  public void setStreetName(String streetName) {
    this.streetName.setStreetName(streetName);
  }

  public boolean isUnofficial() {
    return streetName.isUnofficial();
  }

  public void setUnofficial(boolean unofficial) {
    streetName.setUnofficial(unofficial);
  }

  public String evenOddSequence() {
    return evenOddSequence;
  }

  public void setEvenOddSequence(String evenOddSequence) {
    this.evenOddSequence = evenOddSequence;
  }

  public String houseNumberFrom() {
    return houseNumberFrom;
  }

  public void setHouseNumberFrom(String houseNumberFrom) {
    this.houseNumberFrom = houseNumberFrom;
  }

  public String houseNumberFromAddition() {
    return houseNumberFromAddition;
  }

  public void setHouseNumberFromAddition(String houseNumberFromAddition) {
    this.houseNumberFromAddition = houseNumberFromAddition;
  }

  public String houseNumberTo() {
    return houseNumberTo;
  }

  public void setHouseNumberTo(String houseNumberTo) {
    this.houseNumberTo = houseNumberTo;
  }

  public String houseNumberToAddition() {
    return houseNumberToAddition;
  }

  public void setHouseNumberToAddition(String houseNumberToAddition) {
    this.houseNumberToAddition = houseNumberToAddition;
  }

  public String localDistrict() {
    return localDistrict;
  }

  public void setLocalDistrict(String localDistrict) {
    this.localDistrict = localDistrict;
  }

  public String districtName() {
    return districtName;
  }

  public void setDistrictName(String districtName) {
    this.districtName = districtName;
  }

  public String cityDistrict() {
    return cityDistrict;
  }

  public void setCityDistrict(String cityDistrict) {
    this.cityDistrict = cityDistrict;
  }

  public String cityDistrictPrefecture() {
    return cityDistrictPrefecture;
  }

  public void setCityDistrictPrefecture(String cityDistrictPrefecture) {
    this.cityDistrictPrefecture = cityDistrictPrefecture;
  }

  public String arbitratorsDistrict() {
    return arbitratorsDistrict;
  }

  public void setArbitratorsDistrict(String arbitratorsDistrict) {
    this.arbitratorsDistrict = arbitratorsDistrict;
  }

  public String socialTownHallName() {
    return socialTownHallName;
  }

  public void setSocialTownHallName(String socialTownHallName) {
    this.socialTownHallName = socialTownHallName;
  }

  public String policeStation() {
    return policeStation;
  }

  public void setPoliceStation(String policeStation) {
    this.policeStation = policeStation;
  }

  public String postalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }
}
