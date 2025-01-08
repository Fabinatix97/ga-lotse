/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public abstract class MedicalHistory extends GenericEntity<Long> {

  @Id private Long id;

  @MapsId
  @OneToOne(fetch = FetchType.LAZY)
  private StiProtectionProcedure procedure;

  // General

  private String examinationReason;

  private String currentSymptoms;

  private LocalDate contactToClarifyDate;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private RelationshipModel relationshipModel;

  // Examinations

  @AttributeOverrides({
    @AttributeOverride(name = "hepA", column = @Column(name = "examination_hep_a")),
    @AttributeOverride(name = "hepB", column = @Column(name = "examination_hep_b")),
    @AttributeOverride(name = "hepC", column = @Column(name = "examination_hep_c")),
    @AttributeOverride(name = "hiv", column = @Column(name = "examination_hiv")),
    @AttributeOverride(name = "syphilis", column = @Column(name = "examination_syphilis")),
    @AttributeOverride(name = "gonorrhea", column = @Column(name = "examination_gonorrhea")),
    @AttributeOverride(name = "chlamydia", column = @Column(name = "examination_chlamydia")),
  })
  @Embedded
  private Examination examinations;

  // Previous Diseases

  @AttributeOverrides({
    @AttributeOverride(name = "hepA", column = @Column(name = "previous_illnesses_hep_a")),
    @AttributeOverride(name = "hepB", column = @Column(name = "previous_illnesses_hep_b")),
    @AttributeOverride(name = "hepC", column = @Column(name = "previous_illnesses_hep_c")),
    @AttributeOverride(name = "hiv", column = @Column(name = "previous_illnesses_hiv")),
    @AttributeOverride(name = "syphilis", column = @Column(name = "previous_illnesses_syphilis")),
    @AttributeOverride(name = "gonorrhea", column = @Column(name = "previous_illnesses_gonorrhea")),
    @AttributeOverride(name = "chlamydia", column = @Column(name = "previous_illnesses_chlamydia")),
    @AttributeOverride(name = "other", column = @Column(name = "previous_illnesses_other")),
  })
  @Embedded
  private PreviousIllness previousIllnesses;

  // Orientation and Contact

  @Embedded private RiskContact riskContacts;

  // Prevention

  @Embedded private Prevention prevention;

  // Risk Factors

  @Embedded private RiskFactor riskFactors;

  // Comments

  private String additionalComments;

  // Getter and Setters

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  // General

  public String getExaminationReason() {
    return examinationReason;
  }

  public void setExaminationReason(String examinationReason) {
    this.examinationReason = examinationReason;
  }

  public String getCurrentSymptoms() {
    return currentSymptoms;
  }

  public void setCurrentSymptoms(String currentSymptoms) {
    this.currentSymptoms = currentSymptoms;
  }

  public LocalDate getContactToClarifyDate() {
    return contactToClarifyDate;
  }

  public void setContactToClarifyDate(LocalDate contactToClarifyDate) {
    this.contactToClarifyDate = contactToClarifyDate;
  }

  public RelationshipModel getRelationshipModel() {
    return relationshipModel;
  }

  public void setRelationshipModel(RelationshipModel relationshipModel) {
    this.relationshipModel = relationshipModel;
  }

  // Examinations

  public Examination getExaminations() {
    return examinations;
  }

  public void setExaminations(Examination examinations) {
    this.examinations = examinations;
  }

  // Previous Diseases

  public PreviousIllness getPreviousIllnesses() {
    return previousIllnesses;
  }

  public void setPreviousIllnesses(PreviousIllness previousIllnesses) {
    this.previousIllnesses = previousIllnesses;
  }

  // Orientation and Contact

  public RiskContact getRiskContacts() {
    return riskContacts;
  }

  public void setRiskContacts(RiskContact riskContacts) {
    this.riskContacts = riskContacts;
  }

  // Prevention

  public Prevention getPrevention() {
    return prevention;
  }

  public void setPrevention(Prevention prevention) {
    this.prevention = prevention;
  }

  // Risk Factors

  public RiskFactor getRiskFactors() {
    return riskFactors;
  }

  public void setRiskFactors(RiskFactor riskFactors) {
    this.riskFactors = riskFactors;
  }

  // Comments

  public String getAdditionalComments() {
    return additionalComments;
  }

  public void setAdditionalComments(String additionalComments) {
    this.additionalComments = additionalComments;
  }
}
