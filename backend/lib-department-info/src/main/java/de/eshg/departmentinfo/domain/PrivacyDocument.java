/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.domain;

import static jakarta.persistence.CascadeType.PERSIST;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.util.Optional;
import org.springframework.util.Assert;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class PrivacyDocument extends BaseEntity {

  @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = PERSIST, orphanRemoval = true)
  private Document de;

  @Column(nullable = false)
  private int deFileSizeBytes;

  @OneToOne(fetch = FetchType.LAZY, cascade = PERSIST, orphanRemoval = true)
  private Document en;

  @Column private Integer enFileSizeBytes;

  public Document getDe() {
    return de;
  }

  public int getDeFileSizeBytes() {
    return deFileSizeBytes;
  }

  public Document getEn() {
    return en;
  }

  public Integer getEnFileSizeBytes() {
    return enFileSizeBytes;
  }

  public void updateDe(byte[] deFileContent) {
    Assert.state(deFileContent != null, "Set deFileContent must not be null");
    de = new Document();
    de.setContent(deFileContent);
    deFileSizeBytes = deFileContent.length;
  }

  public void updateDe(Document document) {
    updateDe(document.getContent());
  }

  public void updateEn(byte[] enFileContent) {
    if (enFileContent == null) {
      en = null;
      enFileSizeBytes = null;
    } else {
      en = new Document();
      en.setContent(enFileContent);
      enFileSizeBytes = enFileContent.length;
    }
  }

  public void updateEn(Document document) {
    updateEn(Optional.ofNullable(document).map(Document::getContent).orElse(null));
  }
}
