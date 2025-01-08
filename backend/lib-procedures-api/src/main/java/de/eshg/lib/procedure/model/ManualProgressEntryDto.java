/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.cronn.commons.lang.SetUtils;
import de.eshg.lib.foureyes.model.ApprovalRequestEntityDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

@Schema(name = ManualProgressEntryDto.SCHEMA_NAME, allOf = ProgressEntryDto.class)
@JsonTypeName(ManualProgressEntryDto.SCHEMA_NAME)
public final class ManualProgressEntryDto extends ProgressEntryDto
    implements ApprovalRequestEntityDto, KeyDocumentAwareProgressEntryDto {
  public static final String SCHEMA_NAME = "ManualProgressEntry";

  @NotNull private ManualProgressEntryTypeDto manualProgressEntryType;
  private String note;
  private String keyDocumentType;
  private Integer keyDocumentVersion;
  @NotNull private boolean locked;

  @NotNull private UUID createdBy;
  private String createdByUserFirstName;
  private String createdByUserLastName;

  public ManualProgressEntryTypeDto getManualProgressEntryType() {
    return manualProgressEntryType;
  }

  public void setManualProgressEntryType(ManualProgressEntryTypeDto manualProgressEntryType) {
    this.manualProgressEntryType = manualProgressEntryType;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  @Override
  public String getKeyDocumentType() {
    return keyDocumentType;
  }

  public void setKeyDocumentType(String keyDocumentType) {
    this.keyDocumentType = keyDocumentType;
  }

  @Override
  public Integer getKeyDocumentVersion() {
    return keyDocumentVersion;
  }

  public void setKeyDocumentVersion(Integer keyDocumentVersion) {
    this.keyDocumentVersion = keyDocumentVersion;
  }

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  @Override
  public UUID getRelatedUserId() {
    return getCreatedBy();
  }

  @Override
  public void setRelatedUserFirstName(String relatedUserFirstName) {
    setCreatedByUserFirstName(relatedUserFirstName);
  }

  @Override
  public void setRelatedUserLastName(String relatedUserLastName) {
    setCreatedByUserLastName(relatedUserLastName);
  }

  public String getCreatedByUserFirstName() {
    return createdByUserFirstName;
  }

  public void setCreatedByUserFirstName(String createdByUserFirstName) {
    this.createdByUserFirstName = createdByUserFirstName;
  }

  public String getCreatedByUserLastName() {
    return createdByUserLastName;
  }

  public void setCreatedByUserLastName(String createdByUserLastName) {
    this.createdByUserLastName = createdByUserLastName;
  }

  @Override
  public Set<UUID> getResolvableUserIds() {
    return SetUtils.orderedSet(getRelatedUserId());
  }
}
