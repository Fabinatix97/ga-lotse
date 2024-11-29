/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement;
import de.eshg.travelmedicine.document.informationstatement.persistence.entity.InformationStatement_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class VaccinationConsultation
    extends Procedure<VaccinationConsultation, VaccinationConsultationTask, Person, Facility> {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CreatedByUserType createdBy;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private TravelType travelType;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @NotNull
  @ElementCollection
  @OrderColumn
  private List<CountryCode> travelDestinations;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  private LocalDate travelStartDate;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  @Positive
  private Integer travelTimeAmount;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private TravelTimeUnit travelTimeUnit;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  private UUID citizenUserId;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToMany(
      mappedBy = ProcedureStep_.VACCINATION_CONSULTATION,
      cascade = {CascadeType.REMOVE})
  @OrderBy
  @BatchSize(size = 100)
  private final List<ProcedureStep> procedureSteps = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToMany(
      mappedBy = VcService_.VACCINATION_CONSULTATION,
      cascade = {CascadeType.REMOVE})
  @OrderBy
  @BatchSize(size = 100)
  private final List<VcService> vcServices = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToMany(
      mappedBy = InformationStatement_.VACCINATION_CONSULTATION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy
  private final List<InformationStatement> informationStatements = new ArrayList<>();

  public CreatedByUserType getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(CreatedByUserType createdBy) {
    this.createdBy = createdBy;
  }

  public List<UUID> getPatientIdsFromCentralFile() {
    return getRelatedPersons().stream()
        .filter(Person::isPatient)
        .map(Person::getCentralFileStateId)
        .toList();
  }

  public TravelType getTravelType() {
    return travelType;
  }

  public void setTravelType(TravelType travelType) {
    this.travelType = travelType;
  }

  public List<CountryCode> getTravelDestinations() {
    return travelDestinations;
  }

  public void setTravelDestinations(List<CountryCode> travelDestinations) {
    this.travelDestinations = travelDestinations;
  }

  public LocalDate getTravelStartDate() {
    return travelStartDate;
  }

  public void setTravelStartDate(LocalDate travelStartDate) {
    this.travelStartDate = travelStartDate;
  }

  public Integer getTravelTimeAmount() {
    return travelTimeAmount;
  }

  public void setTravelTimeAmount(Integer travelTimeAmount) {
    this.travelTimeAmount = travelTimeAmount;
  }

  public TravelTimeUnit getTravelTimeUnit() {
    return travelTimeUnit;
  }

  public void setTravelTimeUnit(TravelTimeUnit travelTimeUnit) {
    this.travelTimeUnit = travelTimeUnit;
  }

  public UUID getCitizenUserId() {
    return citizenUserId;
  }

  public void setCitizenUserId(UUID citizenUserId) {
    this.citizenUserId = citizenUserId;
  }

  public List<ProcedureStep> getProcedureSteps() {
    return procedureSteps;
  }

  public List<VcService> getVcServices() {
    return vcServices;
  }

  public List<InformationStatement> getInformationStatements() {
    return informationStatements;
  }
}
