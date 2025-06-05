/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.database;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import java.util.UUID;

@Entity
public class MedsAbroadProcedure
    extends Procedure<MedsAbroadProcedure, MedsAbroadTask, Person, Facility>
    implements EntityWithAppointment {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  boolean certificatePaid;

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Appointment appointment;

  @Column(unique = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private UUID calendarEventId;

  public boolean isCertificatePaid() {
    return certificatePaid;
  }

  public void setCertificatePaid(boolean certificatePaid) {
    this.certificatePaid = certificatePaid;
  }

  @Override
  public Appointment getAppointment() {
    return this.appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public UUID getCalendarEventId() {
    return calendarEventId;
  }

  public void setCalendarEventId(UUID calendarEventId) {
    this.calendarEventId = calendarEventId;
  }

  @Transient
  public Person getPerson() {
    return getRelatedPersons().stream().collect(StreamUtil.toSingleElement());
  }

  @Transient
  public UUID getCentralFilePersonId() {
    return getPerson().getCentralFileStateId();
  }

  @Transient
  public void setCentralFilePersonId(UUID personId) {
    getPerson().setCentralFileStateId(personId);
  }
}
