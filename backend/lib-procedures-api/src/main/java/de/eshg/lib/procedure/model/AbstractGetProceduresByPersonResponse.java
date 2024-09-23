/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AbstractGetProceduresByPersonResponse<P extends AbstractProcedureDto> {
  @Valid
  Map<UUID, List<P>> procedures();

  @Valid
  Map<UUID, GetReferencePersonResponse> resolvedPersons();
}
