/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.informationstatementtemplate.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.disease.persistence.entity.Disease;
import de.eshg.travelmedicine.informationstatementtemplate.persistence.entity.element.Element;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@DataSensitivity(SensitivityLevel.PUBLIC)
public class InformationStatementTemplate extends GloballyUniqueEntityBase {

  @NotNull @Column private String name;

  @NotNull @Column private String title;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "information_statement_templates_to_diseases",
      joinColumns = {
        @JoinColumn(
            name = "information_statement_id",
            foreignKey = @ForeignKey(name = "fk_information_statement"))
      },
      inverseJoinColumns = {
        @JoinColumn(name = "disease_id", foreignKey = @ForeignKey(name = "fk_disease"))
      })
  @NotNull
  private Set<Disease> diseases = new HashSet<>();

  @NotNull
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private InformationStatementTemplateState state;

  @OneToMany(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @JoinColumn(name = "information_statement_id", nullable = false)
  @OrderBy("position")
  private final List<Element> elements = new ArrayList<>();

  @NotNull @Column @CreatedDate private Instant createdAt;

  @NotNull @Column @LastModifiedDate private Instant modifiedAt;

  @Column private UUID modifiedBy;

  public InformationStatementTemplate() {}

  public InformationStatementTemplate(
      String name,
      String title,
      InformationStatementTemplateState state,
      UUID modifiedBy,
      Set<Disease> diseases) {
    this.name = name;
    this.title = title;
    this.state = state;
    this.modifiedBy = modifiedBy;
    this.diseases = diseases;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public InformationStatementTemplateState getState() {
    return state;
  }

  public void setState(InformationStatementTemplateState state) {
    this.state = state;
  }

  public List<Element> getElements() {
    return elements;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  public Set<Disease> getDiseases() {
    return diseases;
  }

  public void setDiseases(Set<Disease> diseases) {
    this.diseases = diseases;
  }
}
