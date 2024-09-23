/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.persistence;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Table(indexes = @Index(columnList = "object_type_id"))
public class PacklistDefinition extends GloballyUniqueEntityBase {

  /** The name of the packlist definition is always the name of the most recent revision. */
  @Column(nullable = false)
  @NotNull
  @NotBlank
  private String name;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PacklistDefinitionRevision_.PACKLIST_DEFINITION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(PacklistDefinitionRevision_.REVISION)
  private final List<PacklistDefinitionRevision> revisions = new ArrayList<>();

  // We need this in order to ensure that the version number will also be increased with each new
  // revision
  @Column(nullable = false)
  @NotNull
  private int mostRecentRevisionNumber;

  @NotNull
  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE},
      fetch = FetchType.LAZY)
  @JoinColumn(name = "object_type_id")
  private ObjectType objectType;

  public ObjectType getObjectType() {
    return objectType;
  }

  public void setObjectType(ObjectType objectType) {
    this.objectType = objectType;
  }

  public List<PacklistDefinitionRevision> getRevisions() {
    return revisions;
  }

  public int getMostRecentRevisionNumber() {
    return mostRecentRevisionNumber;
  }

  public void setMostRecentRevisionNumber(int mostRecentRevisionNumber) {
    this.mostRecentRevisionNumber = mostRecentRevisionNumber;
  }

  public @NotNull @NotBlank String getName() {
    return name;
  }

  public void setName(@NotNull @NotBlank String name) {
    this.name = name;
  }

  public void addNewRevision(PacklistDefinitionRevision revision) {
    name = revision.getName();
    revision.setPacklistDefinition(this);
    revisions.add(revision);
    mostRecentRevisionNumber++;
  }
}
