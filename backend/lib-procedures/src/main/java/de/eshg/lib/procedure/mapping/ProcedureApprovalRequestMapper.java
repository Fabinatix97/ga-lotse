/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper.EntityToApprovalRequestEntityMapper;
import de.eshg.lib.foureyes.model.ApprovalRequestEntityDto;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import org.springframework.stereotype.Service;

@Service
public final class ProcedureApprovalRequestMapper implements EntityToApprovalRequestEntityMapper {

  @Override
  public ApprovalRequestEntityDto toInterfaceType(EntityWithExternalId entity) {
    if (entity instanceof ManualProgressEntry manualProgressEntry) {
      return ProgressEntryMapper.toInterfaceType(manualProgressEntry);
    }

    if (entity instanceof File file) {
      return FileMapper.toInterfaceType(file);
    }

    throw new IllegalArgumentException(
        "Unsupported Entity class for approval requests: %s"
            .formatted(entity.getClass().getSimpleName()));
  }
}
