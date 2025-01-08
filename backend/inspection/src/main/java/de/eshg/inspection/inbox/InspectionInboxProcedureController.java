/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inbox;

import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.lib.procedure.helper.UserHelper;
import de.eshg.lib.procedure.inbox.InboxProcedureController;
import de.eshg.lib.procedure.inbox.InboxProcedureService;
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
    // inspection inbox is always enabled, thus we don't check the BaseFeature.INBOX feature toggle
    // here, intentionally.
  }
}
