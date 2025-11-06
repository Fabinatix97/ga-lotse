/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class SchoolEntryMeaslesVaccinationStatus extends BaseEntity {

  @JoinColumn(nullable = false)
  @OneToOne
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Person person;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID polytuneRequestId;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant polytuneRequestTime;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant lastUpdate;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Boolean vaccinationComplete;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Integer mmr;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Boolean vaccinationPassPresented;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean measlesContraIndication;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean measlesContraIndicationIsPermanent;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private LocalDate measlesContraIndicationUntil;

  public Person getPerson() {
    return person;
  }

  public void setPerson(Person person) {
    this.person = person;
  }

  public UUID getPolytuneRequestId() {
    return polytuneRequestId;
  }

  public void setPolytuneRequestId(UUID polytuneRequestId) {
    this.polytuneRequestId = polytuneRequestId;
  }

  public Instant getPolytuneRequestTime() {
    return polytuneRequestTime;
  }

  public void setPolytuneRequestTime(Instant polytuneRequestTime) {
    this.polytuneRequestTime = polytuneRequestTime;
  }

  public Instant getLastUpdate() {
    return lastUpdate;
  }

  public void setLastUpdate(Instant fetched) {
    this.lastUpdate = fetched;
  }

  public Boolean getVaccinationComplete() {
    return vaccinationComplete;
  }

  public void setVaccinationComplete(Boolean vaccinationComplete) {
    this.vaccinationComplete = vaccinationComplete;
  }

  public Integer getMmr() {
    return mmr;
  }

  public void setMmr(Integer mmr) {
    this.mmr = mmr;
  }

  public Boolean getVaccinationPassPresented() {
    return vaccinationPassPresented;
  }

  public void setVaccinationPassPresented(Boolean vaccinationPassPresented) {
    this.vaccinationPassPresented = vaccinationPassPresented;
  }

  public Boolean getMeaslesContraIndication() {
    return measlesContraIndication;
  }

  public void setMeaslesContraIndication(Boolean measlesContraIndication) {
    this.measlesContraIndication = measlesContraIndication;
  }

  public Boolean getMeaslesContraIndicationIsPermanent() {
    return measlesContraIndicationIsPermanent;
  }

  public void setMeaslesContraIndicationIsPermanent(Boolean measlesContraIndicationIsPermanent) {
    this.measlesContraIndicationIsPermanent = measlesContraIndicationIsPermanent;
  }

  public LocalDate getMeaslesContraIndicationUntil() {
    return measlesContraIndicationUntil;
  }

  public void setMeaslesContraIndicationUntil(LocalDate measlesContraIndicationUntil) {
    this.measlesContraIndicationUntil = measlesContraIndicationUntil;
  }
}
