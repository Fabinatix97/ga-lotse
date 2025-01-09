/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

public final class ProcedureAttribute extends AttributeData {
  public ProcedureAttribute(String name, String category, boolean mandatory) {
    super(name, "PROCEDURE_ID", category, mandatory);
  }
}
