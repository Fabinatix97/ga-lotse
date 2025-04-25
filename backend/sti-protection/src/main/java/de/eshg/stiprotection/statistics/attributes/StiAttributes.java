/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeInfo;
import java.util.Arrays;

public sealed interface StiAttributes extends AttributeInfo
    permits StiProcedureAttributes,
        StiPersonAttributes,
        StiMedicalHistoryAttributes,
        StiConsultationAttributes,
        StiRapidTestsAttributes,
        StiLaboratoryTestsAttributes {
  static StiAttributes[] allAttributes() {
    return flatMapAttributes(
        StiProcedureAttributes.values(),
        StiPersonAttributes.values(),
        StiMedicalHistoryAttributes.values(),
        StiConsultationAttributes.values(),
        StiRapidTestsAttributes.values(),
        StiLaboratoryTestsAttributes.values());
  }

  private static StiAttributes[] flatMapAttributes(StiAttributes[]... arrays) {
    return Arrays.stream(arrays).flatMap(Arrays::stream).toArray(StiAttributes[]::new);
  }
}
