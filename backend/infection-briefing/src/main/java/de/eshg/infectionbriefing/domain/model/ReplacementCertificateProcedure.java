/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.model;

import de.eshg.infectionbriefing.InfectionBriefingTriggerType;
import jakarta.persistence.Entity;

@Entity
public class ReplacementCertificateProcedure extends InfectionBriefingProcedure {

  public ReplacementCertificateProcedure() {}

  public ReplacementCertificateProcedure(InfectionBriefingTriggerType triggerType) {
    super(triggerType);
  }
}
