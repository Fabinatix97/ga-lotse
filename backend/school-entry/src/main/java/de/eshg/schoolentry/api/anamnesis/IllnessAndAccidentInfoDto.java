/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "IllnessAndAccidentInfo")
public record IllnessAndAccidentInfoDto(
    Boolean severeIllnesses,
    List<String> allergies,
    Boolean hospitalizationsOrOperations,
    String underMedicalTreatmentFor,
    String regularMedication) {
  public IllnessAndAccidentInfoDto() {
    this(null, List.of(), null, null, null);
  }
}
