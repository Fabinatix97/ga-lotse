/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"child_id", "prophylaxis_session_id"}),
    indexes = @Index(columnList = "prophylaxis_session_id"))
public class Examination extends BaseEntityWithExternalId {

  @ManyToOne(optional = false)
  @JoinColumn(name = "child_id")
  private Child child;

  @ManyToOne(optional = false)
  @JoinColumn(name = "prophylaxis_session_id")
  private ProphylaxisSession prophylaxisSession;

  private String note;

  public Child getChild() {
    return child;
  }

  public void setChild(Child child) {
    this.child = child;
  }

  public ProphylaxisSession getProphylaxisSession() {
    return prophylaxisSession;
  }

  public void setProphylaxisSession(ProphylaxisSession prophylaxisSession) {
    this.prophylaxisSession = prophylaxisSession;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
