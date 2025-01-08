/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence.element;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@DiscriminatorValue(value = ReportElementType.ElementType.IMAGES)
public class ReportElementImages extends ReportElement {
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @ElementCollection
  @CollectionTable(
      name = "report_element_image",
      joinColumns = @JoinColumn(name = "report_element_id"))
  @Column(name = "image_id", nullable = false)
  @Size(min = 0)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private List<UUID> imageChecklistElementIds = new ArrayList<>();

  @Override
  public ReportElementType getType() {
    return ReportElementType.IMAGES;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public List<UUID> getImageChecklistElementIds() {
    return imageChecklistElementIds;
  }
}
