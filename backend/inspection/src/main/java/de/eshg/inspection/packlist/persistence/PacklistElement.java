/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlist.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionElement;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
    indexes = {
      @Index(columnList = "packlist_definition_element_id"),
      @Index(columnList = "packlist_id")
    })
public class PacklistElement extends GloballyUniqueEntityBase {
  @Min(0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private int position;

  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean isChecked;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "packlist_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Packlist packlist;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "packlist_definition_element_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private PacklistDefinitionElement packlistDefinitionElement;

  @Min(0)
  public int getPosition() {
    return position;
  }

  public void setPosition(@Min(0) int position) {
    this.position = position;
  }

  @NotNull
  public boolean isChecked() {
    return isChecked;
  }

  public void setChecked(@NotNull boolean checked) {
    isChecked = checked;
  }

  public Packlist getPacklist() {
    return packlist;
  }

  public void setPacklist(Packlist packlist) {
    this.packlist = packlist;
  }

  public PacklistDefinitionElement getPacklistDefinitionElement() {
    return packlistDefinitionElement;
  }

  public void setPacklistDefinitionElement(PacklistDefinitionElement packlistDefinitionElement) {
    this.packlistDefinitionElement = packlistDefinitionElement;
  }
}
