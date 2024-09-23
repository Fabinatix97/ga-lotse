/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
public class FileContent extends BaseEntity {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private byte[] content;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(mappedBy = File_.FILE_CONTENT, optional = false)
  private File file;

  public byte[] getContent() {
    return content;
  }

  public void setContent(byte[] content) {
    this.content = content;
  }

  public File getFile() {
    return file;
  }
}
