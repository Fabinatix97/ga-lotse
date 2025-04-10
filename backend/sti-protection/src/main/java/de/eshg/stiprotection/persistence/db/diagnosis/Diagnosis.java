/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.diagnosis;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class Diagnosis extends GenericEntity<Long> {

  @Id
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Long id;

  @MapsId
  @OneToOne(optional = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private StiProtectionProcedure procedure;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String results;

  @ElementCollection
  @CollectionTable(
      name = "medications",
      joinColumns = @JoinColumn(name = "procedure_id", nullable = false))
  @OrderColumn
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private List<Medication> medications;

  @ElementCollection(fetch = FetchType.EAGER)
  @Column(name = "icd10_code", nullable = false)
  @OrderColumn
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private List<String> icd10Codes = new ArrayList<>();

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Set<TestType> testTypes;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String otherTestTypeName;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String generalRemarks;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean resultsCommunicated;

  @Override
  public Long getId() {
    return this.id;
  }

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public String getResults() {
    return results;
  }

  public void setResults(String results) {
    this.results = results;
  }

  public List<Medication> getMedications() {
    return medications;
  }

  public void setMedications(List<Medication> medications) {
    this.medications = medications;
  }

  public String getOtherTestTypeName() {
    return otherTestTypeName;
  }

  public void setTestTypes(Set<TestType> testTypes) {
    this.testTypes = testTypes;
  }

  public Set<TestType> getTestTypes() {
    return testTypes;
  }

  public void setOtherTestTypeName(String otherTestTypeName) {
    this.otherTestTypeName = otherTestTypeName;
  }

  public String getGeneralRemarks() {
    return generalRemarks;
  }

  public void setGeneralRemarks(String generalRemarks) {
    this.generalRemarks = generalRemarks;
  }

  public Boolean getResultsCommunicated() {
    return resultsCommunicated;
  }

  public void setResultsCommunicated(Boolean resultsCommunicated) {
    this.resultsCommunicated = resultsCommunicated;
  }

  public List<String> getIcd10Codes() {
    return icd10Codes;
  }

  public void setIcd10Codes(List<String> icd10Codes) {
    this.icd10Codes = icd10Codes;
  }
}
