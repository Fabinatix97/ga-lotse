/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import de.eshg.security.auth.AuthProperties;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public final class MukLoginMethod extends LoginMethod {
  private static final Logger log = LoggerFactory.getLogger(MukLoginMethod.class);

  public MukLoginMethod(AuthProperties authProperties) {
    super(authProperties);
  }

  @Override
  public List<String> getPathPatterns() {
    return authProperties.getMukUrlPatterns();
  }

  @Override
  protected void applyParameters(Map<String, Object> params, String redirectUrl) {
    log.info("Adding MUK IDP hint to login url");
    params.put("kc_idp_hint", "muk");
  }
}
