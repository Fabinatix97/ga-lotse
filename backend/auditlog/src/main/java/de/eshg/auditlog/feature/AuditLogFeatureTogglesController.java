/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.feature;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "AuditLogFeatureToggles")
public class AuditLogFeatureTogglesController implements AuditLogFeatureTogglesApi {
  private final AuditLogFeatureToggle auditLogFeatureToggle;

  public AuditLogFeatureTogglesController(AuditLogFeatureToggle auditLogFeatureToggle) {
    this.auditLogFeatureToggle = auditLogFeatureToggle;
  }

  @Override
  public GetAuditLogFeatureTogglesResponse getFeatureToggles() {
    return new GetAuditLogFeatureTogglesResponse(
        auditLogFeatureToggle.getEnabledNewFeatures(),
        auditLogFeatureToggle.getDisabledOldFeatures());
  }
}
