/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.mapping;

import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.lib.foureyes.mapping.ApprovalRequestMapper.EntityToApprovalRequestEntityMapper;
import de.eshg.lib.foureyes.model.ApprovalRequestEntityDto;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.model.ManualProgressEntryDto;
import org.springframework.stereotype.Service;

@Service
public final class ProcedureApprovalRequestMapper implements EntityToApprovalRequestEntityMapper {

  private final UserHelper userHelper;

  public ProcedureApprovalRequestMapper(UserHelper userHelper) {
    this.userHelper = userHelper;
  }

  @Override
  public ApprovalRequestEntityDto toInterfaceType(EntityWithExternalId entity) {
    if (entity instanceof ManualProgressEntry manualProgressEntry) {
      ManualProgressEntryDto progressEntry =
          ProgressEntryMapper.toInterfaceType(manualProgressEntry);
      userHelper.enrichUsersFirstNamesAndLastNames(progressEntry);
      return progressEntry;
    }

    if (entity instanceof File file) {
      return FileMapper.toInterfaceType(file);
    }

    throw new IllegalArgumentException(
        "Unsupported Entity class for approval requests: %s"
            .formatted(entity.getClass().getSimpleName()));
  }
}
