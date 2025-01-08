/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@MappedSuperclass
public abstract class RelatedFacility<ProcedureT extends Procedure<ProcedureT, ?, ?, ?>>
    extends SequencedBaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ManyToOne(optional = false)
  @JoinColumn(name = "procedure_id")
  private ProcedureT procedure;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false, unique = true)
  private UUID centralFileStateId;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private FacilityType facilityType;

  public RelatedFacility() {}

  protected RelatedFacility(FacilityType facilityType) {
    this.facilityType = facilityType;
  }

  public ProcedureT getProcedure() {
    return procedure;
  }

  public void setProcedure(ProcedureT procedure) {
    this.procedure = procedure;
  }

  public UUID getCentralFileStateId() {
    return centralFileStateId;
  }

  public void setCentralFileStateId(UUID centralFileStateId) {
    this.centralFileStateId = centralFileStateId;
  }

  public FacilityType getFacilityType() {
    return facilityType;
  }

  public void setFacilityType(FacilityType facilityType) {
    this.facilityType = facilityType;
  }
}
