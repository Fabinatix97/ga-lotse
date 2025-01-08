/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.util.Assert;

@Entity
public class MeaslesProtectionProcedure
    extends Procedure<MeaslesProtectionProcedure, MeaslesProtectionTask, Person, Facility>
    implements EntityWithAppointment {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Embedded
  @Valid
  private ReportData reportData;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(name = "procedure_id")
  @OrderBy
  private final List<ProofSubmission> proofSubmissions = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      mappedBy = MonetaryFine_.PROCEDURE)
  @OrderBy
  private final List<MonetaryFine> monetaryFines = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      cascade = CascadeType.PERSIST,
      mappedBy = AccessRestriction_.PROCEDURE)
  private AccessRestriction accessRestriction;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      orphanRemoval = true,
      mappedBy = ProofRequestLetter_.PROCEDURE)
  @OrderBy
  private final List<ProofRequestLetter> proofRequestLetters = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CaseStatus caseStatus;

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Appointment appointment;

  public void setOrganisationUserId(UUID organisationUserId) {
    Assert.notEmpty(
        this.getProgressEntries(),
        "There has to be at least one ProgressEntry before calling 'setOrganisationUserId'");
    ProgressEntry firstProgressEntry = this.getProgressEntries().getFirst();
    Assert.isInstanceOf(
        SystemProgressEntry.class,
        firstProgressEntry,
        "First ProgressEntry has to be a SystemProgressEntry");

    SystemProgressEntry procedureCreationSystemProgressEntry =
        (SystemProgressEntry) firstProgressEntry;
    procedureCreationSystemProgressEntry.setTriggeredBy(organisationUserId);
  }

  @Transient
  public UUID getPatientIdFromCentralFile() {
    return getRelatedPersons().stream()
        .filter(Person::isPatient)
        .map(Person::getCentralFileStateId)
        .collect(StreamUtil.toSingleElement());
  }

  @Transient
  public List<UUID> getCustodianIdsFromCentralFile() {
    return getRelatedPersons().stream()
        .filter(Person::isCustodian)
        .map(Person::getCentralFileStateId)
        .toList();
  }

  @Transient
  public Optional<UUID> getFacilityIdFromCentralFile() {
    return getRelatedFacilities().stream()
        .map(Facility::getCentralFileStateId)
        .collect(StreamUtil.toSingleOptionalElement());
  }

  @Transient
  public Optional<Facility> getFacility() {
    return getRelatedFacilities().stream().collect(StreamUtil.toSingleOptionalElement());
  }

  public ReportData getReportData() {
    return reportData;
  }

  public void setReportData(ReportData reportData) {
    this.reportData = reportData;
  }

  public void addProofSubmission(ProofSubmission proofSubmission) {
    this.proofSubmissions.add(proofSubmission);
  }

  public List<ProofSubmission> getProofSubmissions() {
    return this.proofSubmissions;
  }

  public void addMonetaryFine(MonetaryFine monetaryFine) {
    monetaryFine.setProcedure(this);
    this.monetaryFines.add(monetaryFine);
  }

  public List<MonetaryFine> getMonetaryFines() {
    return this.monetaryFines;
  }

  public void setAccessRestriction(AccessRestriction accessRestriction) {
    if (accessRestriction == null) {
      if (this.accessRestriction != null) {
        this.accessRestriction.setProcedure(null);
      }
    } else {
      accessRestriction.setProcedure(this);
    }
    this.accessRestriction = accessRestriction;
  }

  public AccessRestriction getAccessRestriction() {
    return accessRestriction;
  }

  public CaseStatus getCaseStatus() {
    return caseStatus;
  }

  public void setCaseStatus(CaseStatus caseStatus) {
    this.caseStatus = caseStatus;
  }

  @Override
  public Appointment getAppointment() {
    return appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public void addProofRequestLetter(ProofRequestLetter letter) {
    letter.setProcedure(this);
    this.proofRequestLetters.add(letter);
  }

  public List<ProofRequestLetter> getProofRequestLetters() {
    return this.proofRequestLetters;
  }
}
