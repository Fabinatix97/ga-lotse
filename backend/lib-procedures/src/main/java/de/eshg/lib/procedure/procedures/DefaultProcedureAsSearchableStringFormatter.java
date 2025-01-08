/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(ProcedureAsSearchableStringFormatter.class)
public class DefaultProcedureAsSearchableStringFormatter<
        ProcedureT extends Procedure<ProcedureT, ?, ?, ?>>
    implements ProcedureAsSearchableStringFormatter<ProcedureT> {

  @Override
  public String formatAsSearchableString(ProcedureT procedure) {
    return "";
  }
}
