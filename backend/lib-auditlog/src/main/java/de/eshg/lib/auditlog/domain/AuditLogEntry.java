/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog.domain;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OrderBy;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@NamedEntityGraph(
    name = "AuditLogEntry.additionalData",
    attributeNodes = @NamedAttributeNode("additionalData"))
public class AuditLogEntry extends SequencedBaseEntity {

  @CreatedDate
  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PUBLIC)
  private Instant createdAt;

  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PUBLIC)
  private String category;

  @Column(nullable = false)
  @DataSensitivity(value = SensitivityLevel.PUBLIC)
  private String function;

  @DataSensitivity(value = SensitivityLevel.SENSITIVE)
  @ElementCollection
  @OrderBy("additional_data_key ASC")
  private Map<String, String> additionalData = new LinkedHashMap<>();

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getFunction() {
    return function;
  }

  public void setFunction(String function) {
    this.function = function;
  }

  public Map<String, String> getAdditionalData() {
    return additionalData;
  }

  public void setAdditionalData(Map<String, String> additionalData) {
    this.additionalData = additionalData;
  }
}
