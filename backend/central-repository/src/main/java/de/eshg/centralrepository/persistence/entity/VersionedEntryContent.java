/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.persistence.entity;

import static jakarta.persistence.CascadeType.PERSIST;
import static jakarta.persistence.CascadeType.REMOVE;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import java.sql.Blob;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Entity
public class VersionedEntryContent {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(
      optional = false,
      cascade = {PERSIST, REMOVE},
      orphanRemoval = true)
  private VersionedEntryMetadata metadata;

  /** The content will be stored in this, or if not JSON, in the other content field. */
  @Column
  @JdbcTypeCode(SqlTypes.JSON)
  private String contentJson;

  @Column @Lob private Blob contentBinary;

  public VersionedEntryContent(VersionedEntryMetadata metadata, Blob contentBinary) {
    this.contentBinary = contentBinary;
    this.metadata = metadata;
  }

  public VersionedEntryContent(VersionedEntryMetadata metadata, String contentJson) {
    this.contentJson = contentJson;
    this.metadata = metadata;
  }

  public VersionedEntryContent() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public VersionedEntryMetadata getMetadata() {
    return metadata;
  }

  public void setMetadata(VersionedEntryMetadata entry) {
    this.metadata = entry;
  }

  public String getContentJson() {
    return contentJson;
  }

  public void setContentJson(String json) {
    contentBinary = null;
    contentJson = json;
  }

  public Blob getContentBinary() {
    return contentBinary;
  }

  public void setContentBinary(Blob binary) {
    contentJson = null;
    contentBinary = binary;
  }
}
