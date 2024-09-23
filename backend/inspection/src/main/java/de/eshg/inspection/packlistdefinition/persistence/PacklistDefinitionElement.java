/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Table(indexes = @Index(columnList = "packlist_definition_revision_id"))
public class PacklistDefinitionElement extends GloballyUniqueEntityBase {

  @Min(0)
  private int position;

  private String text;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "packlist_definition_revision_id")
  private PacklistDefinitionRevision packlistDefinitionRevision;

  @Min(0)
  public int getPosition() {
    return position;
  }

  public void setPosition(@Min(0) int position) {
    this.position = position;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public PacklistDefinitionRevision getPacklistDefinitionRevision() {
    return packlistDefinitionRevision;
  }

  public void setPacklistDefinitionRevision(PacklistDefinitionRevision packlistDefinitionRevision) {
    this.packlistDefinitionRevision = packlistDefinitionRevision;
  }
}
