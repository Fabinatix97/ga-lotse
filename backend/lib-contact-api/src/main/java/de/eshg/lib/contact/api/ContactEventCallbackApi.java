/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.contact.api;

import de.eshg.lib.contact.model.ContactsMergedEvent;
import de.eshg.rest.service.security.config.BaseUrls;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;

public interface ContactEventCallbackApi {
  @PostExchange(BaseUrls.ContactLibrary.CONTACT_EVENT_CALLBACK_API + "/contacts-merged")
  void contactsMerged(@Valid @RequestBody ContactsMergedEvent contactsMergedEvent);
}
