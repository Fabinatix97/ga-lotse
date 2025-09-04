/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.config.domain.Initializable;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class AppointmentBlockDefaultAvailabilityConfig extends BaseEntity implements Initializable {

  @NotNull private boolean initialized = false;

  @NotNull private boolean availableForCitizen = true;

  @NotNull private boolean availableForBulkBooking = true;

  @Override
  public boolean isInitialized() {
    return initialized;
  }

  @Override
  public void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public boolean getAvailableForCitizen() {
    return availableForCitizen;
  }

  public void setAvailableForCitizen(boolean availableForCitizen) {
    this.availableForCitizen = availableForCitizen;
  }

  public boolean getAvailableForBulkBooking() {
    return availableForBulkBooking;
  }

  public void setAvailableForBulkBooking(boolean availableForBulkBooking) {
    this.availableForBulkBooking = availableForBulkBooking;
  }
}
