/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.importer;

import de.cronn.reflection.util.PropertyUtils;
import de.cronn.reflection.util.TypedPropertyGetter;
import de.eshg.lib.xlsximport.RowData;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProfessionInformationDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.apache.commons.lang3.builder.EqualsBuilder;

public class MedicalRegistryRow extends RowData<MedicalRegistryRow> {

  @NotNull @Valid private CreateApplicantDto applicant;

  @NotNull @Valid private CreateProfessionInformationDto professionInformation;

  @Valid private CreatePracticeDto practice;

  public CreateApplicantDto getApplicant() {
    return applicant;
  }

  public void setApplicant(CreateApplicantDto applicant) {
    this.applicant = applicant;
  }

  public CreateProfessionInformationDto getProfessionInformation() {
    return professionInformation;
  }

  public void setProfessionInformation(CreateProfessionInformationDto professionInformation) {
    this.professionInformation = professionInformation;
  }

  public CreatePracticeDto getPractice() {
    return practice;
  }

  public void setPractice(CreatePracticeDto practice) {
    this.practice = practice;
  }

  public boolean hasPractice() {
    return practice != null;
  }

  @Override
  public boolean isDuplicateRow(MedicalRegistryRow other) {
    return reflectionEquals(applicant, other.applicant, CreateApplicantDto::getAddress)
        && EqualsBuilder.reflectionEquals(professionInformation, other.professionInformation)
        && reflectionEquals(practice, other.practice, CreatePracticeDto::getAddress);
  }

  private static <T> boolean reflectionEquals(
      T lhs, T rhs, TypedPropertyGetter<T, ?> reflectionEqualsField) {
    if (lhs == null) {
      return rhs == null;
    }
    if (!EqualsBuilder.reflectionEquals(
        lhs, rhs, PropertyUtils.getPropertyName(lhs, reflectionEqualsField))) {
      return false;
    }
    return EqualsBuilder.reflectionEquals(
        reflectionEqualsField.get(lhs), reflectionEqualsField.get(rhs));
  }
}
