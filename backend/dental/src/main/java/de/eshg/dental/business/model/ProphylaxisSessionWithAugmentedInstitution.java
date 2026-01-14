/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.business.model;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.domain.model.ProphylaxisSession;

public record ProphylaxisSessionWithAugmentedInstitution(
    ProphylaxisSession prophylaxisSession, ContactDto institution) {}
