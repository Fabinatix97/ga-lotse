/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;
import java.util.UUID;

@Entity
public class ProphylaxisSession extends BaseEntityWithExternalId {

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private Instant dateAndTime;

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private UUID institutionId;

  public Instant getDateAndTime() {
    return dateAndTime;
  }

  public void setDateAndTime(Instant date) {
    this.dateAndTime = date;
  }

  public UUID getInstitutionId() {
    return institutionId;
  }

  public void setInstitutionId(UUID institutionId) {
    this.institutionId = institutionId;
  }
}
