/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class ProphylaxisSession extends BaseEntityWithExternalId {

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private Instant dateAndTime;

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private UUID institutionId;

  @DataSensitivity(PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ProphylaxisType type;

  @DataSensitivity(PSEUDONYMIZED)
  @Column(nullable = false)
  private String groupName;

  @DataSensitivity(PROTECTED)
  @OneToMany(
      orphanRemoval = true,
      cascade = CascadeType.PERSIST,
      mappedBy = Examination_.PROPHYLAXIS_SESSION)
  @OrderBy
  @BatchSize(size = 100)
  private final List<Examination> examinations = new ArrayList<>();

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

  public ProphylaxisType getType() {
    return type;
  }

  public void setType(ProphylaxisType type) {
    this.type = type;
  }

  public String getGroupName() {
    return groupName;
  }

  public void setGroupName(String groupName) {
    this.groupName = groupName;
  }

  public List<Examination> getExaminations() {
    return examinations;
  }

  public void addExamination(Examination examination) {
    this.examinations.add(examination);
    examination.setProphylaxisSession(this);
  }
}
