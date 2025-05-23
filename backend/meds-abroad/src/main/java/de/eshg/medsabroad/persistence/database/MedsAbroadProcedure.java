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
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import java.util.UUID;

@Entity
public class MedsAbroadProcedure
    extends Procedure<MedsAbroadProcedure, MedsAbroadTask, Person, Facility>
    implements EntityWithAppointment {

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Appointment appointment;

  @Override
  public Appointment getAppointment() {
    return this.appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  @Transient
  public UUID getCentralFilePersonId() {
    return getRelatedPersons().stream()
        .map(Person::getCentralFileStateId)
        .collect(StreamUtil.toSingleElement());
  }
}
