/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Table(
    uniqueConstraints =
        @UniqueConstraint(
            name = "uk_packlist_definition_revision",
            columnNames = {"packlist_definition_id", "revision"}))
public class PacklistDefinitionRevision extends GloballyUniqueEntityBase {
  @Column(nullable = false)
  @NotNull
  private String name;

  private String description;

  @Column(nullable = false)
  @NotNull
  private Instant validFrom;

  @Column private Instant validTo;

  @Column(nullable = false)
  @NotNull
  private UUID modifiedBy;

  @Column(nullable = false)
  @NotNull
  @Min(1)
  private int revision;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PacklistDefinitionElement_.PACKLIST_DEFINITION_REVISION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(PacklistDefinitionElement_.POSITION)
  private final List<PacklistDefinitionElement> elements = new ArrayList<>();

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "packlist_definition_id")
  private PacklistDefinition packlistDefinition;

  public @NotNull String getName() {
    return name;
  }

  public void setName(@NotNull String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public @NotNull Instant getValidFrom() {
    return validFrom;
  }

  public void setValidFrom(@NotNull Instant validFrom) {
    this.validFrom = validFrom;
  }

  public Instant getValidTo() {
    return validTo;
  }

  public void setValidTo(Instant validTo) {
    this.validTo = validTo;
  }

  public @NotNull UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(@NotNull UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  @NotNull
  @Min(1)
  public int getRevision() {
    return revision;
  }

  public void setRevision(@NotNull @Min(1) int revision) {
    this.revision = revision;
  }

  public List<PacklistDefinitionElement> getElements() {
    return elements;
  }

  public PacklistDefinition getPacklistDefinition() {
    return packlistDefinition;
  }

  public void setPacklistDefinition(PacklistDefinition packlistDefinition) {
    this.packlistDefinition = packlistDefinition;
  }

  public void addElement(PacklistDefinitionElement element) {
    element.setPacklistDefinitionRevision(this);
    element.setPosition(this.elements.size());
    this.elements.add(element);
  }

  public void addElements(Collection<PacklistDefinitionElement> elements) {
    for (PacklistDefinitionElement element : elements) {
      addElement(element);
    }
  }
}
