/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.util.Assert;

@Entity
public class StiProtectionProcedure
    extends Procedure<StiProtectionProcedure, StiProtectionTask, Person, Facility>
    implements EntityWithAppointment {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private Concern concern;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      mappedBy = MedicalHistory_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private MedicalHistory medicalHistory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST)
  private Appointment appointment;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      cascade = CascadeType.PERSIST,
      mappedBy = UserDefinedAppointment_.PROCEDURE)
  private UserDefinedAppointment userDefinedAppointment;

  @Transient
  public Person getPerson() {
    Assert.isTrue(getRelatedPersons().size() == 1, "There should be exactly one related person");
    return getRelatedPersons().getFirst();
  }

  public Concern getConcern() {
    return concern;
  }

  public void setConcern(Concern concern) {
    this.concern = concern;
  }

  public MedicalHistory getMedicalHistory() {
    return medicalHistory;
  }

  public void setMedicalHistory(MedicalHistory medicalHistory) {
    if (medicalHistory == null) {
      if (this.medicalHistory != null) {
        this.medicalHistory.setProcedure(null);
      }
    } else {
      medicalHistory.setProcedure(this);
    }
    this.medicalHistory = medicalHistory;
  }

  public Appointment getAppointment() {
    return appointment;
  }

  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public UserDefinedAppointment getUserDefinedAppointment() {
    return userDefinedAppointment;
  }

  public void setUserDefinedAppointment(UserDefinedAppointment userDefinedAppointment) {
    if (userDefinedAppointment == null) {
      if (this.userDefinedAppointment != null) {
        this.userDefinedAppointment.setProcedure(null);
      }
    } else {
      userDefinedAppointment.setProcedure(this);
    }
    this.userDefinedAppointment = userDefinedAppointment;
  }
}
