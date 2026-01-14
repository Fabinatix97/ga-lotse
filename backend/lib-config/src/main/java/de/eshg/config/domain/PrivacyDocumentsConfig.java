/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.domain;

import static de.eshg.config.domain.AbstractPrivacyDocumentsConfig.PRIVACY_NOTICE;
import static de.eshg.config.domain.AbstractPrivacyDocumentsConfig.PRIVACY_POLICY;

import jakarta.persistence.AssociationOverride;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;

@Entity
@AssociationOverride(name = PRIVACY_NOTICE, joinColumns = @JoinColumn(nullable = true))
@AssociationOverride(name = PRIVACY_POLICY, joinColumns = @JoinColumn(nullable = true))
public class PrivacyDocumentsConfig extends AbstractPrivacyDocumentsConfig {}
