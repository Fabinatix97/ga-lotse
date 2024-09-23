/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.common.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotNull;
import java.sql.Blob;
import java.sql.Types;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@DataSensitivity(SensitivityLevel.PROTECTED)
public class MediaFileContent extends BaseEntity {

  @Lob
  @JdbcTypeCode(Types.BINARY)
  @NotNull
  private Blob file;

  public Blob getFile() {
    return file;
  }

  public void setFile(Blob file) {
    this.file = file;
  }
}
