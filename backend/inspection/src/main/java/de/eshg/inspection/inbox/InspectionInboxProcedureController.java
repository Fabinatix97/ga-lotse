/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inbox;

import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.inbox.InboxProcedureController;
import de.eshg.lib.procedure.inbox.InboxProcedureService;
import java.util.Set;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InspectionInboxProcedureController extends InboxProcedureController {

  public InspectionInboxProcedureController(
      InboxProcedureService inboxProcedureService,
      BaseFeatureTogglesApi baseFeatureTogglesApi,
      UserHelper userHelper) {
    super(inboxProcedureService, baseFeatureTogglesApi, userHelper);
  }

  @Override
  protected void validateInboxEnabled() {
    Set<BaseFeature> features = baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();
    if (Set.of(BaseFeature.INBOX, BaseFeature.INSPECTION_INBOX).stream()
        .noneMatch(features::contains)) {
      throw new IllegalStateException(
          "Neither new features %s or %s is enabled"
              .formatted(BaseFeature.INBOX, BaseFeature.INSPECTION_INBOX));
    }
  }
}
