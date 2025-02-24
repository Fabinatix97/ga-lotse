/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.controller;

import de.eshg.chat.featuretoggle.ChatFeature;
import de.eshg.chat.featuretoggle.ChatFeatureToggle;
import de.eshg.chat.model.dto.BindKeycloakIdRequest;
import de.eshg.chat.service.SynapseClient;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(path = UserAccountController.BASE_URL)
@RestController
@Tag(name = "UserAccount")
public class UserAccountController {

  public static final String BASE_URL = BaseUrls.ChatManagement.USER_ACCOUNT_CONTROLLER;

  private final ChatFeatureToggle featureToggle;
  private final SynapseClient synapseClient;

  public UserAccountController(SynapseClient synapseClient, ChatFeatureToggle featureToggle) {
    this.featureToggle = featureToggle;
    this.synapseClient = synapseClient;
  }

  @PostMapping("/bind-keycloak-id")
  @Transactional
  public ResponseEntity<Void> bindKeycloakId(
      @RequestBody @Valid BindKeycloakIdRequest bindKeycloakIdRequest) {
    featureToggle.assertNewFeatureIsEnabled(ChatFeature.CHAT_BASE);
    synapseClient.bindKeycloakId(bindKeycloakIdRequest.matrixUserId());
    return ResponseEntity.ok().build();
  }
}
