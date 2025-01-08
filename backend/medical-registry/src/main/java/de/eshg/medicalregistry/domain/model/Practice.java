/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class Practice extends RelatedFacility<MedicalRegistryProcedure> {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String website;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String institutionIdentifier;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String establishmentNumber;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private boolean healthInsuranceAuthorization;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String openingHours;

  public Practice() {
    super(FacilityType.MEDICAL_PRACTICE);
  }

  public String getWebsite() {
    return website;
  }

  public void setWebsite(String website) {
    this.website = website;
  }

  public String getInstitutionIdentifier() {
    return institutionIdentifier;
  }

  public void setInstitutionIdentifier(String institutionIdentifier) {
    this.institutionIdentifier = institutionIdentifier;
  }

  public String getEstablishmentNumber() {
    return establishmentNumber;
  }

  public void setEstablishmentNumber(String establishmentNumber) {
    this.establishmentNumber = establishmentNumber;
  }

  public boolean isHealthInsuranceAuthorization() {
    return healthInsuranceAuthorization;
  }

  public void setHealthInsuranceAuthorization(boolean healthInsuranceAuthorization) {
    this.healthInsuranceAuthorization = healthInsuranceAuthorization;
  }

  public String getOpeningHours() {
    return openingHours;
  }

  public void setOpeningHours(String openingHours) {
    this.openingHours = openingHours;
  }
}
