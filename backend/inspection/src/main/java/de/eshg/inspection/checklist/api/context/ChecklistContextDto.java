/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.context;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Schema(name = "CLContext")
public class ChecklistContextDto { // This is a ChecklistDefinitionVersion entity
  private @NotNull UUID id;
  private @NotNull UUID defId;
  private @NotNull String name;
  private String description;
  private Instant validFrom;
  private Instant validTo;
  private @NotNull boolean expandable;
  private @NotNull boolean deleted;
  private @NotNull boolean published;
  private Instant lastModified;
  private @NotNull int version;
  private Integer repositoryVersion;
  private @NotNull @Valid List<ChecklistSectionContextDto> sections;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getDefId() {
    return defId;
  }

  public void setDefId(UUID defId) {
    this.defId = defId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Instant getValidFrom() {
    return validFrom;
  }

  public void setValidFrom(Instant validFrom) {
    this.validFrom = validFrom;
  }

  public Instant getValidTo() {
    return validTo;
  }

  public void setValidTo(Instant validTo) {
    this.validTo = validTo;
  }

  public boolean isExpandable() {
    return expandable;
  }

  public void setExpandable(boolean expandable) {
    this.expandable = expandable;
  }

  public boolean isDeleted() {
    return deleted;
  }

  public void setDeleted(boolean deleted) {
    this.deleted = deleted;
  }

  public boolean isPublished() {
    return published;
  }

  public void setPublished(boolean published) {
    this.published = published;
  }

  public Instant getLastModified() {
    return lastModified;
  }

  public void setLastModified(Instant lastModified) {
    this.lastModified = lastModified;
  }

  public int getVersion() {
    return version;
  }

  public void setVersion(int version) {
    this.version = version;
  }

  public Integer getRepositoryVersion() {
    return repositoryVersion;
  }

  public void setRepositoryVersion(Integer repositoryVersion) {
    this.repositoryVersion = repositoryVersion;
  }

  public List<ChecklistSectionContextDto> getSections() {
    return sections;
  }

  public void setSections(List<ChecklistSectionContextDto> sections) {
    this.sections = sections;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ChecklistContextDto that = (ChecklistContextDto) o;
    return expandable == that.expandable
        && deleted == that.deleted
        && published == that.published
        && version == that.version
        && Objects.equals(id, that.id)
        && Objects.equals(defId, that.defId)
        && Objects.equals(name, that.name)
        && Objects.equals(description, that.description)
        && Objects.equals(validFrom, that.validFrom)
        && Objects.equals(validTo, that.validTo)
        && Objects.equals(lastModified, that.lastModified)
        && Objects.equals(repositoryVersion, that.repositoryVersion)
        && Objects.equals(sections, that.sections);
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        id,
        defId,
        name,
        description,
        validFrom,
        validTo,
        expandable,
        deleted,
        published,
        lastModified,
        version,
        repositoryVersion,
        sections);
  }

  @Override
  public String toString() {
    return "ChecklistContextDto{"
        + "id="
        + id
        + ", defId="
        + defId
        + ", name='"
        + name
        + '\''
        + ", description='"
        + description
        + '\''
        + ", validFrom="
        + validFrom
        + ", validTo="
        + validTo
        + ", expandable="
        + expandable
        + ", deleted="
        + deleted
        + ", published="
        + published
        + ", lastModified="
        + lastModified
        + ", version="
        + version
        + ", repositoryVersion="
        + repositoryVersion
        + ", sections="
        + sections
        + '}';
  }
}
