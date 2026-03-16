/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.lib.assessment.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public class Source extends BaseEntityWithExternalId {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String title;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String author;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String link;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getLink() {
    return link;
  }

  public void setLink(String link) {
    this.link = link;
  }
}
