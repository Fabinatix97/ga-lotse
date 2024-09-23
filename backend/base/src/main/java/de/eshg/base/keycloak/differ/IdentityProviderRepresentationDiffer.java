/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.IdentityProviderRepresentation;

public class IdentityProviderRepresentationDiffer
    extends KeycloakDiffer<IdentityProviderRepresentation> {

  public IdentityProviderRepresentationDiffer(
      List<IdentityProviderRepresentation> target, List<IdentityProviderRepresentation> source) {
    super(
        target,
        source,
        identityProviderRepresentationUpdater(),
        IdentityProviderRepresentation::getAlias);
  }

  private static PropertyUpdater<IdentityProviderRepresentation>
      identityProviderRepresentationUpdater() {
    return (target, source) -> {
      target.setDisplayName(source.getDisplayName());
      target.setProviderId(source.getProviderId());
      target.setFirstBrokerLoginFlowAlias(source.getFirstBrokerLoginFlowAlias());
      target.setConfig(source.getConfig());
    };
  }
}
