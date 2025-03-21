/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.controller;

import de.eshg.lsd.register.api.LsdOrgUnitApi;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "LsdOrgUnit")
public class LsdOrgUnitController implements LsdOrgUnitApi {

  private final String orgUnitName;

  public LsdOrgUnitController(@Value("${eshg.lsd.orgUnit.name}") String orgUnitName) {
    this.orgUnitName = orgUnitName;
  }

  @Override
  public String getName() {
    return orgUnitName;
  }
}
