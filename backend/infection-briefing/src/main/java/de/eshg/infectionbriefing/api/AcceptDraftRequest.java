/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import java.util.UUID;

public record AcceptDraftRequest(UUID referencePersonId, CustodianConsentDto custodianConsent) {}
