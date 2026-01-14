/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import org.springframework.data.domain.Persistable;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Entity
@Table(
    name = "versioned_entry_metadata",
    indexes = {
      @Index(
          name = "idx_versioned_entry_metadata_deleted_module_name_object_name",
          columnList = "deleted,moduleName,objectName")
    },
    uniqueConstraints = {@UniqueConstraint(columnNames = {"id", "version"})})
public class VersionedEntryMetadata implements Persistable<IdVersionPK> {
  @EmbeddedId private IdVersionPK pk;

  /** The hierarchy is {moduleName}/{objectName}/{category} */
  @Column(nullable = false)
  @NotNull
  private String moduleName;

  /**
   * @see #moduleName
   */
  @Column(nullable = false)
  @NotNull
  private String objectName;

  /**
   * @see #moduleName
   */
  @Column(nullable = false)
  @NotNull
  private String category;

  @Column(nullable = false)
  @NotNull
  private String name;

  /** a string of comma-separated tags */
  @Column(nullable = false)
  @NotNull
  private String tags = "";

  @Column private String description;

  @Column private String changeLog;

  @Column private String contact;

  /** the naturalId of the actor who created this version of the entry (e.g. "eshg.fr.landesamt") */
  @Column(nullable = false)
  @NotNull
  private String createdBy;

  @Column(nullable = false)
  @NotNull
  private Instant createdAt;

  @Column(nullable = false)
  @NotNull
  private boolean deleted = false;

  @Column private String deletedBy;

  @Column private Instant deletedAt;

  /** The media type of the content (e.g. application/json or image/png) */
  @Column(nullable = false)
  @NotNull
  private String contentType;

  // On this side, we do not want a OneToOne to the content, because 1. Hibernate does not support
  // lazy one-to-one relationships, so retrieving the metadata would also load potentially huge
  // content and 2. when you want to get the content, you need metadata and the content anyway

  public IdVersionPK getPk() {
    return pk;
  }

  public void setPk(IdVersionPK pk) {
    this.pk = pk;
  }

  public String getModuleName() {
    return moduleName;
  }

  public void setModuleName(String module) {
    this.moduleName = module;
  }

  public String getObjectName() {
    return objectName;
  }

  public void setObjectName(String object) {
    this.objectName = object;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<String> getTags() {
    if (tags.isEmpty()) {
      return List.of();
    }
    return Arrays.asList(tags.split(","));
  }

  public void setTags(List<String> tags) {
    if (tags == null || tags.isEmpty()) {
      this.tags = "";
      return;
    }

    String[] sortedTags = tags.toArray(new String[] {});
    Arrays.sort(sortedTags);
    this.tags = String.join(",", sortedTags);
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getChangeLog() {
    return changeLog;
  }

  public void setChangeLog(String changeLog) {
    this.changeLog = changeLog;
  }

  public String getContact() {
    return contact;
  }

  public void setContact(String contact) {
    this.contact = contact;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
  }

  public String getDeletedBy() {
    return deletedBy;
  }

  public void setDeletedBy(String deletedBy) {
    this.deletedBy = deletedBy;
  }

  public Instant getDeletedAt() {
    return deletedAt;
  }

  public void setDeletedAt(Instant deletedAt) {
    this.deletedAt = deletedAt;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  @Override
  public IdVersionPK getId() {
    return getPk();
  }

  /**
   * User are only allowed to create new versions of an existing entry, not update them. As a
   * result, every entity should be seen as new. The only exception to that are the {@code delete*}
   * fields, which can only be set via custom repository methods, and not via an entity. <br>
   * <br>
   *
   * <p><b>Example that shows why this is necessary:</b>
   *
   * <p>Alice and Bob both start creating a new version based on version 4 of the entry with id
   * 4242. Alice is first, so version 5 now exists for the id 4242. If isNew() is false, then the
   * request of Bob would be recognized as an update to the existing version and thus overwrite the
   * entry. When isNew() is true instead, Bob's request will result in a data integrity violation.
   *
   * @return true (always)
   */
  @Override
  public boolean isNew() {
    return true;
  }
}
