/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.business.model;

import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.dental.domain.model.Examination;
import de.eshg.dental.domain.model.FluoridationConsent;
import de.eshg.dental.domain.model.ProphylaxisSession;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ProphylaxisSessionWithAugmentedData(
    ProphylaxisSession prophylaxisSession,
    ContactDto institution,
    Map<Examination, ChildWithPersonAndContactData> participants,
    Map<UUID, UserDto> users,
    Map<UUID, List<Examination>> previousScreeningExaminationsByChildFileStateId,
    Map<UUID, List<FluoridationConsent>> allFluoridationConsentsByChildFileStateId) {}
