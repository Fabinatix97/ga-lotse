/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate;
import de.eshg.travelmedicine.template.informationstatementtemplate.persistence.entity.InformationStatementTemplate_;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PreRemove;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class Disease extends GloballyUniqueEntityBase {

  @Column(nullable = false, unique = true)
  private String name;

  @ManyToMany(fetch = FetchType.LAZY, mappedBy = InformationStatementTemplate_.DISEASES)
  private final Set<InformationStatementTemplate> informationStatementTemplates = new HashSet<>();

  @Column(precision = 8, scale = 2)
  @PositiveOrZero
  private BigDecimal estimatedFee;

  @Column(nullable = false)
  private boolean visibleToCitizenPortal = true;

  @NotNull @Column @CreatedDate private Instant createdAt;

  @NotNull @Column @LastModifiedDate private Instant modifiedAt;

  public Disease() {}

  public Disease(UUID id, String name, BigDecimal estimatedFee, boolean visibleToCitizenPortal) {
    this.id = id;
    this.name = name;
    this.estimatedFee = estimatedFee;
    this.visibleToCitizenPortal = visibleToCitizenPortal;
  }

  @PreRemove
  private void removeTemplateAssociations() {
    for (InformationStatementTemplate template : this.informationStatementTemplates) {
      template.getDiseases().remove(this);
    }
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public BigDecimal getEstimatedFee() {
    return estimatedFee;
  }

  public void setEstimatedFee(BigDecimal estimatedFee) {
    this.estimatedFee = estimatedFee;
  }

  public boolean isVisibleToCitizenPortal() {
    return visibleToCitizenPortal;
  }

  public void setVisibleToCitizenPortal(boolean visibleToCitizenPortal) {
    this.visibleToCitizenPortal = visibleToCitizenPortal;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }
}
