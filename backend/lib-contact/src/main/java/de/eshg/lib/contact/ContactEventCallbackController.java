/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.contact;

import de.eshg.lib.contact.api.ContactEventCallbackApi;
import de.eshg.lib.contact.model.ContactsMergedEvent;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Hidden(/* Only used internally between base module and business module */ )
public class ContactEventCallbackController implements ContactEventCallbackApi {

  private final ApplicationEventPublisher applicationEventPublisher;

  public ContactEventCallbackController(ApplicationEventPublisher applicationEventPublisher) {
    this.applicationEventPublisher = applicationEventPublisher;
  }

  @Override
  public void contactsMerged(ContactsMergedEvent contactsMergedEvent) {
    applicationEventPublisher.publishEvent(contactsMergedEvent);
  }
}
