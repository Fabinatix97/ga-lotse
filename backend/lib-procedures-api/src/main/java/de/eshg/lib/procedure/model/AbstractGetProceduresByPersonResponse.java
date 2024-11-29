/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AbstractGetProceduresByPersonResponse<P extends AbstractProcedureDto> {
  Map<UUID, List<P>> procedures();

  Map<UUID, GetReferencePersonResponse> resolvedPersons();
}
