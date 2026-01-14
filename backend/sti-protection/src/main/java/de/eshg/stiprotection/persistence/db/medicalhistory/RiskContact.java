/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.Gender;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import java.util.Set;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
public class RiskContact {

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private SexualOrientation sexualOrientation;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Integer numberOfSexualPartnersLast12Months;

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Set<Gender> sexualContacts;

  @ElementCollection(fetch = FetchType.EAGER)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private Set<PartnerRiskFactor> partnerRiskFactors;

  public SexualOrientation getSexualOrientation() {
    return sexualOrientation;
  }

  public void setSexualOrientation(SexualOrientation sexualOrientation) {
    this.sexualOrientation = sexualOrientation;
  }

  public Integer getNumberOfSexualPartnersLast12Months() {
    return numberOfSexualPartnersLast12Months;
  }

  public void setNumberOfSexualPartnersLast12Months(Integer numberOfSexualPartnersLast12Months) {
    this.numberOfSexualPartnersLast12Months = numberOfSexualPartnersLast12Months;
  }

  public Set<Gender> getSexualContacts() {
    return sexualContacts;
  }

  public void setSexualContacts(Set<Gender> sexualContacts) {
    this.sexualContacts = sexualContacts;
  }

  public Set<PartnerRiskFactor> getPartnerRiskFactors() {
    return partnerRiskFactors;
  }

  public void setPartnerRiskFactors(Set<PartnerRiskFactor> partnerRiskFactors) {
    this.partnerRiskFactors = partnerRiskFactors;
  }
}
