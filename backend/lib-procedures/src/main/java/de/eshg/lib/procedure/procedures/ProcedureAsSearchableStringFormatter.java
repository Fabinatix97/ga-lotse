/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.procedures;

import de.eshg.lib.procedure.domain.model.Procedure;

@FunctionalInterface
public interface ProcedureAsSearchableStringFormatter<
    ProcedureT extends Procedure<ProcedureT, ?, ?, ?>> {

  String formatAsSearchableString(ProcedureT procedure);
}
