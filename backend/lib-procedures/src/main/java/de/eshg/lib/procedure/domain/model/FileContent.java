/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.domain.model.HasFileContent;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
public class FileContent extends BaseEntity implements HasFileContent {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private byte[] content;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(mappedBy = File_.FILE_CONTENT, optional = false)
  private File file;

  public byte[] getContent() {
    return content;
  }

  @Override
  public String getFileName() {
    return getFile() != null ? getFile().getFileName() : null;
  }

  public void setContent(byte[] content) {
    this.content = content;
  }

  public File getFile() {
    return file;
  }

  public FileContent copy() {
    FileContent copy = new FileContent();
    copy.content = content;
    return copy;
  }
}
