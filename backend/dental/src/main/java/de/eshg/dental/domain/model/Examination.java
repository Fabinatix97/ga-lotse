/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.model;

import de.cronn.reflection.util.PropertyUtils;
import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.beans.PropertyDescriptor;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

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

  @OneToOne(
      optional = true,
      fetch = FetchType.EAGER,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @JoinColumn(nullable = true)
  private ExaminationResult result;

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

  public ExaminationResult getResult() {
    return result;
  }

  public void setResult(ExaminationResult result) {
    if (result != null) {
      result.setExamination(this);
    }
    this.result = result;
  }

  public boolean hasResult() {
    return result != null;
  }

  public Instant getDateAndTime() {
    return getProphylaxisSession().getDateAndTime();
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .anyMatch(Objects::nonNull);
  }

  public Stream<PropertyDescriptor> getPropertiesToValidate() {
    List<PropertyDescriptor> propertiesToIgnore =
        List.of(
            PropertyUtils.getPropertyDescriptor(Examination.class, Examination::getId),
            PropertyUtils.getPropertyDescriptor(Examination.class, Examination::getChild),
            PropertyUtils.getPropertyDescriptor(
                Examination.class, Examination::getProphylaxisSession));

    return PropertyUtils.getPropertyDescriptors(Examination.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }
}
