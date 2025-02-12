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
    @Schema(
            description = "Details the results of the diagnosis.",
            example = "Colicky pain, acute abdomen; medication prescribed for pain management.")
        String results,
    @Schema(description = "Lists prescribed medications.") @Valid List<MedicationDto> medications,
    @Schema(description = "Records diagnostic findings using ICD-10 codes.") @Valid
        List<Icd10CodeDto> findings,
    @Schema(description = "Specifies the type of laboratory tests conducted during examination.")
        Set<TestTypeDto> testTypes,
    @Schema(
            description = "Provides the name of a test type not included in the predefined list.",
            example = "ELISA.")
        String otherTestTypeName,
    @Schema(
            description =
                "Additional remarks or observations documented during the diagnosis phase.",
            example = "Positive for HIV antibodies and presence of P24 antigen detected.")
        String generalRemarks,
    @Schema(
            description =
                "Indicates whether the patient has been informed of their diagnostic results and updates the laboratory status to 'CLOSE'.")
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
