/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.statistics.attributes;

import de.eshg.lib.statistics.attributes.AttributeInfo;
import java.util.ArrayList;
import java.util.List;

public sealed interface EsuAttributes extends AttributeInfo
    permits EsuChildAttributes,
        EsuAnamnesisAttributes,
        EsuVaccinationAttribute,
        EsuDevelopmentScreeningAttribute,
        EsuVisionHearingAttribute,
        EsuSopessAttribute,
        EsuProcedureAttribute {

  static EsuAttributes[] allAttributes() {
    List<EsuAttributes> attributes = new ArrayList<>();
    attributes.addAll(List.of(EsuChildAttributes.values()));
    attributes.addAll(List.of(EsuAnamnesisAttributes.values()));
    attributes.addAll(List.of(EsuVaccinationAttribute.values()));
    attributes.addAll(List.of(EsuDevelopmentScreeningAttribute.values()));
    attributes.addAll(List.of(EsuVisionHearingAttribute.values()));
    attributes.addAll(List.of(EsuSopessAttribute.values()));
    attributes.addAll(List.of(EsuProcedureAttribute.values()));
    return attributes.toArray(EsuAttributes[]::new);
  }
}
