/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;

@Entity
@Table(indexes = {@Index(columnList = "dataTransmitterPseudonymId")})
@Inheritance(strategy = InheritanceType.JOINED)
public class GdprFacility extends IdentificationData {
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String name;

  @OneToOne(cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprFacilityAddress contactAddress;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String emailAddress;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String dataTransmitterPseudonymId;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public GdprFacilityAddress getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(GdprFacilityAddress contactAddress) {
    this.contactAddress = contactAddress;
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

  public String getDataTransmitterPseudonymId() {
    return dataTransmitterPseudonymId;
  }

  public void setDataTransmitterPseudonymId(String dataTransmitterPseudonymId) {
    this.dataTransmitterPseudonymId = dataTransmitterPseudonymId;
  }
}
