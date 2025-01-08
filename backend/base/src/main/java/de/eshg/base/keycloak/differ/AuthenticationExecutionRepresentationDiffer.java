/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.AuthenticationExecutionInfoRepresentation;

public class AuthenticationExecutionRepresentationDiffer
    extends KeycloakDiffer<AuthenticationExecutionInfoRepresentation> {

  private static PropertyUpdater<AuthenticationExecutionInfoRepresentation>
      executionRepresentationUpdater() {
    return (target, source) -> target.setRequirement(source.getRequirement());
  }

  public AuthenticationExecutionRepresentationDiffer(
      List<AuthenticationExecutionInfoRepresentation> target,
      List<AuthenticationExecutionInfoRepresentation> source) {
    super(
        target,
        source,
        executionRepresentationUpdater(),
        e ->
            e.getAuthenticationFlow() == Boolean.TRUE
                ? e.getDisplayName() != null
                    ? e.getDisplayName() + e.getIndex()
                    : e.getAlias() + e.getIndex()
                : e.getProviderId() + e.getIndex());
  }
}
