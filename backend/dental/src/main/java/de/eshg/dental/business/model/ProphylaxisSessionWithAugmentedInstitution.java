/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.business.model;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.domain.model.ProphylaxisSession;

public record ProphylaxisSessionWithAugmentedInstitution(
    ProphylaxisSession prophylaxisSession, ContactDto institution) {}
