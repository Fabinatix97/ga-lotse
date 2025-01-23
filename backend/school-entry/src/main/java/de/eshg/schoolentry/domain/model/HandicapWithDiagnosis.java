/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@Embeddable
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class HandicapWithDiagnosis {

  private Boolean result;

  @ElementCollection
  @Column(name = "icd10_code", nullable = false)
  @OrderColumn
  private List<String> icd10Codes = new ArrayList<>();

  // Used for XLSX import
  private transient List<String> icd10CodesIncludingNulls;

  public Boolean getResult() {
    return result;
  }

  public void setResult(Boolean result) {
    this.result = result;
  }

  public List<String> getIcd10Codes() {
    return icd10Codes;
  }

  public void setIcd10Codes(List<String> icd10Codes) {
    this.icd10Codes = icd10Codes;
  }

  public List<String> getIcd10CodesIncludingNulls() {
    return icd10CodesIncludingNulls;
  }

  public void setIcd10CodesIncludingNulls(List<String> icd10CodesIncludingNulls) {
    this.icd10CodesIncludingNulls = icd10CodesIncludingNulls;
  }
}
