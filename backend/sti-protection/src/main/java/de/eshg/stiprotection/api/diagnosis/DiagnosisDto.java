/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.diagnosis;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.icd10.api.Icd10CodeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import java.util.List;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

@Schema(name = "Diagnosis")
public record DiagnosisDto(
    String results,
    @Valid List<MedicationDto> medications,
    @Valid List<Icd10CodeDto> findings,
    Set<TestTypeDto> testTypes,
    String otherTestTypeName,
    String generalRemarks,
    Boolean resultsCommunicated) {

  @AssertTrue(
      message =
          "If 'other'-TestType is selected the 'otherTestTypeName' should not be null or blank. If 'other'-TestType is NOT selected 'otherTestTypeName' should be null.")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isOtherTestTypeSetupValid() {
    if (CollectionUtils.isEmpty(testTypes) || !testTypes.contains(TestTypeDto.OTHER)) {
      return StringUtils.isEmpty(otherTestTypeName);
    }
    return !StringUtils.isBlank(otherTestTypeName);
  }
}
