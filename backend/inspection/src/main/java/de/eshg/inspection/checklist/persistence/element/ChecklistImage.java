/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@DataSensitivity(SensitivityLevel.PROTECTED)
@Table(indexes = @Index(columnList = "checklist_image_element_id"))
public class ChecklistImage extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "checklist_image_element_id")
  private ChecklistImageElement checklistImageElement;

  @OneToOne(
      cascade = {CascadeType.PERSIST},
      orphanRemoval = true)
  @NotNull
  private MediaFile imageFile;

  public ChecklistImage getCopy() {
    ChecklistImage copiedElement = new ChecklistImage();
    copiedElement.setImageFile(imageFile.getCopy());
    return copiedElement;
  }

  public ChecklistImageElement getChecklistImageElement() {
    return checklistImageElement;
  }

  public void setChecklistImageElement(final ChecklistImageElement checklistImageElement) {
    this.checklistImageElement = checklistImageElement;
  }

  public MediaFile getImageFile() {
    return imageFile;
  }

  public void setImageFile(final MediaFile imageFile) {
    this.imageFile = imageFile;
  }
}
