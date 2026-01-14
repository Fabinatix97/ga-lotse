/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.domain.model.BaseEntity_;
import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class AccessRestriction extends GenericEntity<Long> {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Id
  private Long id;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = BaseEntity_.ID)
  @MapsId
  private MeaslesProtectionProcedure procedure;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private LocalDate restrictionIssuedDate;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private LocalDate restrictionStartDate;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private LocalDate restrictionTerminationDate;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      mappedBy = AccessRestrictionLetter_.ACCESS_RESTRICTION)
  @OrderBy
  private final List<AccessRestrictionLetter> letters = new ArrayList<>();

  /** The progress entry to track the creation of this access restriction */
  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToOne(optional = false, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  private SystemProgressEntry progressEntry;

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public MeaslesProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(MeaslesProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public LocalDate getRestrictionIssuedDate() {
    return restrictionIssuedDate;
  }

  public void setRestrictionIssuedDate(LocalDate restrictionIssuedDate) {
    this.restrictionIssuedDate = restrictionIssuedDate;
  }

  public LocalDate getRestrictionStartDate() {
    return restrictionStartDate;
  }

  public void setRestrictionStartDate(LocalDate restrictionStartDate) {
    this.restrictionStartDate = restrictionStartDate;
  }

  public LocalDate getRestrictionTerminationDate() {
    return restrictionTerminationDate;
  }

  public void setRestrictionTerminationDate(LocalDate restrictionTerminationDate) {
    this.restrictionTerminationDate = restrictionTerminationDate;
  }

  public List<AccessRestrictionLetter> getLetters() {
    return letters;
  }

  public void addLetter(AccessRestrictionLetter letter) {
    this.letters.add(letter);
  }

  public SystemProgressEntry getProgressEntry() {
    return progressEntry;
  }

  public void setProgressEntry(SystemProgressEntry progressEntry) {
    this.progressEntry = progressEntry;
  }
}
