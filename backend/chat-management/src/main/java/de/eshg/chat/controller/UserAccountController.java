/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.controller;

import de.eshg.chat.featuretoggle.ChatFeatureToggle;
import de.eshg.chat.model.dto.BindKeycloakIdRequest;
import de.eshg.chat.model.dto.DeactivateRequest;
import de.eshg.chat.service.SynapseAuthorizationService;
import de.eshg.chat.service.SynapseClient;
import de.eshg.rest.service.security.CurrentUserHelper;
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
  private final SynapseAuthorizationService authorizationService;

  public UserAccountController(
      SynapseClient synapseClient,
      ChatFeatureToggle featureToggle,
      SynapseAuthorizationService authorizationService) {
    this.featureToggle = featureToggle;
    this.synapseClient = synapseClient;
    this.authorizationService = authorizationService;
  }

  @PostMapping("/bind-keycloak-id")
  @Transactional
  public ResponseEntity<Void> bindKeycloakId(
      @RequestBody @Valid BindKeycloakIdRequest bindKeycloakIdRequest) {
    authorizationService.validateIfMxidBelongsToCurrentUser(bindKeycloakIdRequest.matrixUserId());
    String keycloakUserId = CurrentUserHelper.getCurrentUserId().toString();
    synapseClient.bindKeycloakId(bindKeycloakIdRequest.matrixUserId(), keycloakUserId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/deactivate")
  @Transactional
  public ResponseEntity<Void> deactivateUserAccount(
      @RequestBody @Valid DeactivateRequest deactivateRequest) {
    authorizationService.validateIfMxidBelongsToCurrentUser(deactivateRequest.matrixUserId());
    synapseClient.deactivateUserAccount(deactivateRequest.matrixUserId());
    return ResponseEntity.ok().build();
  }
}
