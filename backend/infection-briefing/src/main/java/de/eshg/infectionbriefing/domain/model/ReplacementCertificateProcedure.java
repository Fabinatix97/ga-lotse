/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.domain.model;

import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.Entity;

@Entity
public class ReplacementCertificateProcedure extends InfectionBriefingProcedure {

  public ReplacementCertificateProcedure() {}

  public ReplacementCertificateProcedure(TriggerType triggerType) {
    super(triggerType);
  }
}
