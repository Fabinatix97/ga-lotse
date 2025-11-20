/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class ProstituteProtectionProcedure
    extends Procedure<ProstituteProtectionProcedure, ProstituteProtectionTask, Person, Facility>
    implements EntityWithAppointment {

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  private Appointment appointment;

  @NotNull private String lastName;
  private String firstName;
  private String alias;
  private LocalDate dateOfBirth;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CountryCode nationality;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DocumentType documentType;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ConsultationType consultationType;

  @ElementCollection
  @Enumerated(EnumType.STRING)
  @OrderColumn
  private List<Language> languages = new ArrayList<>();

  private Boolean withTranslator;

  @Override
  public Appointment getAppointment() {
    return appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public @NotNull String getLastName() {
    return lastName;
  }

  public void setLastName(@NotNull String lastName) {
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getAlias() {
    return alias;
  }

  public void setAlias(String alias) {
    this.alias = alias;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public CountryCode getNationality() {
    return nationality;
  }

  public void setNationality(CountryCode nationality) {
    this.nationality = nationality;
  }

  public DocumentType getDocumentType() {
    return documentType;
  }

  public void setDocumentType(DocumentType documentType) {
    this.documentType = documentType;
  }

  public ConsultationType getConsultationType() {
    return consultationType;
  }

  public void setConsultationType(ConsultationType consultationType) {
    this.consultationType = consultationType;
  }

  public List<Language> getLanguages() {
    return languages;
  }

  public void setLanguages(List<Language> languages) {
    this.languages = languages;
  }

  public Boolean isWithTranslator() {
    return withTranslator;
  }

  public void setWithTranslator(Boolean withTranslator) {
    this.withTranslator = withTranslator;
  }
}
