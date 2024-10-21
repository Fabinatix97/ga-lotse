/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.common.persistence;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;

@Entity
@DataSensitivity(SensitivityLevel.PROTECTED)
@JsonIgnoreProperties("mediaFiles")
public class MediaFileContent extends BaseEntity {

  @Lob
  @JdbcTypeCode(Types.BINARY)
  @NotNull
  private Blob file;

  @OneToMany(
      mappedBy = MediaFile_.FILE_CONTENT,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      cascade = CascadeType.PERSIST)
  @OrderBy
  private final List<MediaFile> mediaFiles = new ArrayList<>();

  public Blob getFile() {
    return file;
  }

  public void setFile(Blob file) {
    this.file = file;
  }

  public List<MediaFile> getMediaFiles() {
    return mediaFiles;
  }

  public byte[] getAllBytes() {
    try {
      return file.getBinaryStream().readAllBytes();
    } catch (IOException | SQLException e) {
      throw new RuntimeException(e);
    }
  }
}
