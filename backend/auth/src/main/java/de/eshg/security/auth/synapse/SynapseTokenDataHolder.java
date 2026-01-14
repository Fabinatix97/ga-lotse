/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import java.io.Serial;
import java.io.Serializable;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;

@Component
@SessionScope
public class SynapseTokenDataHolder implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  private SynapseTokenData synapseTokenData;

  public SynapseTokenData getSynapseTokenData() {
    return synapseTokenData;
  }

  public void setSynapseTokenData(SynapseTokenData synapseTokenData) {
    this.synapseTokenData = synapseTokenData;
  }
}
