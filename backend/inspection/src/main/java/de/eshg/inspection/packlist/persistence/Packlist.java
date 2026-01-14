/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    indexes = {@Index(columnList = "packlist_revision_id"), @Index(columnList = "inspection_id")})
public class Packlist extends GloballyUniqueEntityBase {

  @Min(0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private int position;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "packlist_revision_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private PacklistDefinitionRevision packlistDefinitionRevision;

  @NotNull
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "inspection_id", nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection inspection;

  @NotNull
  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PacklistElement_.PACKLIST,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(PacklistElement_.POSITION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<PacklistElement> elements = new ArrayList<>();

  public PacklistDefinitionRevision getPacklistDefinitionRevision() {
    return packlistDefinitionRevision;
  }

  public void setPacklistDefinitionRevision(PacklistDefinitionRevision packlistDefinitionVersion) {
    this.packlistDefinitionRevision = packlistDefinitionVersion;
  }

  @Min(0)
  public int getPosition() {
    return position;
  }

  public void setPosition(@Min(0) int position) {
    this.position = position;
  }

  public @NotNull Inspection getInspection() {
    return inspection;
  }

  public void setInspection(@NotNull Inspection inspection) {
    this.inspection = inspection;
  }

  public @NotNull List<PacklistElement> getElements() {
    return elements;
  }

  public void addElement(PacklistElement element) {
    element.setPosition(this.elements.size());
    element.setPacklist(this);
    this.elements.add(element);
  }
}
