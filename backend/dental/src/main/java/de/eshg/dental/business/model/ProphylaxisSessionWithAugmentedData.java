/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.business.model;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.model.ProphylaxisSession;
import java.util.Map;

public record ProphylaxisSessionWithAugmentedData(
    ProphylaxisSession prophylaxisSession,
    ContactDto institution,
    Map<Child, GetPersonFileStateResponse> participants) {}
