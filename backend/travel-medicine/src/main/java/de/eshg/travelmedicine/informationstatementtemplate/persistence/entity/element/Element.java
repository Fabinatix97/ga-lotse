/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(indexes = @Index(columnList = "information_statement_id"))
@DataSensitivity(SensitivityLevel.PUBLIC)
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "element_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Element extends GloballyUniqueEntityBase {
  @Column(nullable = false)
  @NotNull
  @Min(0)
  private int position;

  @Column(nullable = false)
  @NotNull
  private boolean editable;

  @Column(nullable = false)
  @NotNull
  private boolean moveable;

  @Column(nullable = false)
  @NotNull
  private boolean deletable;

  public abstract ElementType getType();

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public boolean isEditable() {
    return editable;
  }

  public void setEditable(boolean editable) {
    this.editable = editable;
  }

  public boolean isMoveable() {
    return moveable;
  }

  public void setMoveable(boolean moveable) {
    this.moveable = moveable;
  }

  public boolean isDeletable() {
    return deletable;
  }

  public void setDeletable(boolean deletable) {
    this.deletable = deletable;
  }
}
