/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.error.NotFoundException;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.util.UUID;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CitizenService {

  private final StiProtectionProcedureRepository repository;

  public CitizenService(StiProtectionProcedureRepository repository) {
    this.repository = repository;
  }

  public StiProtectionProcedureData getProcedure(Jwt principal) {
    return new StiProtectionProcedureData(
        findByAnonymouseUserlId(getCitizenUserId(principal)), null);
  }

  private UUID getCitizenUserId(Jwt principal) {
    return UUID.fromString(principal.getSubject());
  }

  private StiProtectionProcedure findByAnonymouseUserlId(UUID anonymousUserId) {
    return repository
        .findByAnonymousUserId(anonymousUserId)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "%s with given anonymous UUID not found"
                        .formatted(StiProtectionProcedure.class.getSimpleName())));
  }
}
