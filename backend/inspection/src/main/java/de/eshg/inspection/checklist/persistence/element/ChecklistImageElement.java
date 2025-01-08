/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.persistence.element;

import de.eshg.inspection.checklistdefinition.api.ChecklistElementType;
import de.eshg.inspection.checklistdefinition.api.ChecklistElementType.ElementType;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue(value = ElementType.IMAGE)
public class ChecklistImageElement extends ChecklistElement {

  @OneToMany(
      mappedBy = ChecklistImage_.CHECKLIST_IMAGE_ELEMENT,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  private final List<ChecklistImage> images = new ArrayList<>();

  @Override
  public ChecklistElementType getType() {
    return ChecklistElementType.IMAGE;
  }

  @Override
  public ChecklistElement getCopy() {
    ChecklistImageElement copiedElement = new ChecklistImageElement();
    images.forEach(
        sourceImage -> {
          ChecklistImage copiedImage = sourceImage.getCopy();
          copiedImage.setChecklistImageElement(copiedElement);
          copiedElement.getImages().add(copiedImage);
        });
    return enrichCopy(copiedElement);
  }

  @Override
  public String getValueForKey(String elementKey) {
    return switch (elementKey) {
      case "images" ->
          images.stream()
              .map(ChecklistImage::getImageFile)
              .filter(MediaFile::isNotDeleted)
              .map(MediaFile::getFileExternalId)
              .toList()
              .toString();
      default -> getCommonValueForKey(elementKey);
    };
  }

  public List<ChecklistImage> getImages() {
    return images;
  }

  public void addImage(MediaFile mediaFile) {
    checkIllegalModification();
    ChecklistImage checklistImage = new ChecklistImage();
    checklistImage.setImageFile(mediaFile);
    checklistImage.setChecklistImageElement(this);
    images.add(checklistImage);
  }
}
