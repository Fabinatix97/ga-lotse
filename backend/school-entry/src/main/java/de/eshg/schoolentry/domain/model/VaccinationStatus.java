/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.cronn.reflection.util.PropertyUtils;
import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.beans.PropertyDescriptor;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class VaccinationStatus extends GenericEntity<Long> implements ValidatableEntity {
  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private SchoolEntryProcedure procedure;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private VaccinationSchemeValue vaccinationScheme;

  private Integer diphtheria;
  private Integer tetanus;
  private Integer pertussis;
  private Integer hib;
  private Integer polio;
  private Integer hepatitisB;
  private Integer pneumococcus;
  private Integer mmr;
  private Integer varicella;
  private Integer meningococcusB;
  private Integer meningococcusC;
  private Integer rota;
  private Integer tbe;
  private Integer hepatitisA;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BooleanWithUnknown perkombiHbv;

  @ElementCollection
  @CollectionTable(
      name = "other_vaccinations",
      joinColumns = @JoinColumn(name = "procedure_id", nullable = false))
  @OrderColumn
  private List<OtherVaccination> otherVaccinations;

  private Boolean vaccinationPassPresented;

  private Boolean measlesContraIndication;

  private Boolean measlesContraIndicationIsPermanent;

  private LocalDate measlesContraIndicationUntil;

  private String note;

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public SchoolEntryProcedure getProcedure() {
    return procedure;
  }

  void setProcedure(SchoolEntryProcedure procedure) {
    this.procedure = procedure;
  }

  public Integer getDiphtheria() {
    return diphtheria;
  }

  public void setDiphtheria(Integer diphtheria) {
    this.diphtheria = diphtheria;
  }

  public Integer getTetanus() {
    return tetanus;
  }

  public void setTetanus(Integer tetanus) {
    this.tetanus = tetanus;
  }

  public Integer getPertussis() {
    return pertussis;
  }

  public void setPertussis(Integer pertussis) {
    this.pertussis = pertussis;
  }

  public Integer getHib() {
    return hib;
  }

  public void setHib(Integer hib) {
    this.hib = hib;
  }

  public Integer getPolio() {
    return polio;
  }

  public void setPolio(Integer polio) {
    this.polio = polio;
  }

  public Integer getHepatitisB() {
    return hepatitisB;
  }

  public void setHepatitisB(Integer hepatitisB) {
    this.hepatitisB = hepatitisB;
  }

  public Integer getPneumococcus() {
    return pneumococcus;
  }

  public void setPneumococcus(Integer pneumococcus) {
    this.pneumococcus = pneumococcus;
  }

  public Integer getMmr() {
    return mmr;
  }

  public void setMmr(Integer mmr) {
    this.mmr = mmr;
  }

  public Integer getVaricella() {
    return varicella;
  }

  public void setVaricella(Integer varicella) {
    this.varicella = varicella;
  }

  public Integer getMeningococcusB() {
    return meningococcusB;
  }

  public void setMeningococcusB(Integer meningococcusB) {
    this.meningococcusB = meningococcusB;
  }

  public Integer getMeningococcusC() {
    return meningococcusC;
  }

  public void setMeningococcusC(Integer meningococcusC) {
    this.meningococcusC = meningococcusC;
  }

  public Integer getRota() {
    return rota;
  }

  public void setRota(Integer rota) {
    this.rota = rota;
  }

  public Integer getTbe() {
    return tbe;
  }

  public void setTbe(Integer tbe) {
    this.tbe = tbe;
  }

  public Integer getHepatitisA() {
    return hepatitisA;
  }

  public void setHepatitisA(Integer hepatitisA) {
    this.hepatitisA = hepatitisA;
  }

  public List<OtherVaccination> getOtherVaccinations() {
    return otherVaccinations;
  }

  public void setOtherVaccinations(List<OtherVaccination> otherVaccinations) {
    this.otherVaccinations = otherVaccinations;
  }

  public Boolean getVaccinationPassPresented() {
    return vaccinationPassPresented;
  }

  public void setVaccinationPassPresented(Boolean vaccinationPassPresented) {
    this.vaccinationPassPresented = vaccinationPassPresented;
  }

  public BooleanWithUnknown getPerkombiHbv() {
    return perkombiHbv;
  }

  public void setPerkombiHbv(BooleanWithUnknown perkombiHbv) {
    this.perkombiHbv = perkombiHbv;
  }

  public VaccinationSchemeValue getVaccinationScheme() {
    return vaccinationScheme;
  }

  public void setVaccinationScheme(VaccinationSchemeValue vaccinationScheme) {
    this.vaccinationScheme = vaccinationScheme;
  }

  public Boolean getMeaslesContraIndication() {
    return measlesContraIndication;
  }

  public void setMeaslesContraIndication(Boolean measlesContraIndication) {
    this.measlesContraIndication = measlesContraIndication;
  }

  public Boolean getMeaslesContraIndicationIsPermanent() {
    return measlesContraIndicationIsPermanent;
  }

  public void setMeaslesContraIndicationIsPermanent(Boolean measlesContraIndicationIsPermanent) {
    this.measlesContraIndicationIsPermanent = measlesContraIndicationIsPermanent;
  }

  public LocalDate getMeaslesContraIndicationUntil() {
    return measlesContraIndicationUntil;
  }

  public void setMeaslesContraIndicationUntil(LocalDate measlesContraIndicationUntil) {
    this.measlesContraIndicationUntil = measlesContraIndicationUntil;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String notes) {
    this.note = notes;
  }

  public Stream<PropertyDescriptor> getPropertiesToValidate() {
    List<PropertyDescriptor> propertiesToIgnore =
        List.of(
            PropertyUtils.getPropertyDescriptor(VaccinationStatus.class, VaccinationStatus::getId),
            PropertyUtils.getPropertyDescriptor(
                VaccinationStatus.class, VaccinationStatus::getProcedure));

    return PropertyUtils.getPropertyDescriptors(VaccinationStatus.class).stream()
        .filter(prop -> !propertiesToIgnore.contains(prop))
        .filter(PropertyUtils::isFullyAccessible);
  }

  public boolean hasEdits() {
    return getPropertiesToValidate()
        .map(prop -> PropertyUtils.read(this, prop))
        .flatMap(
            value -> {
              if (value instanceof List) {
                return ((List<?>) value).stream();
              }
              return Stream.of(value);
            })
        .anyMatch(Objects::nonNull);
  }
}
