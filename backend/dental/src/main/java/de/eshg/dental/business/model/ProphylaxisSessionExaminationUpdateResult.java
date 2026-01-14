/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.business.model;

import java.util.List;
import java.util.UUID;

public record ProphylaxisSessionExaminationUpdateResult(
    List<UUID> failedPersonUpdates,
    List<UUID> failedExaminationUpdates,
    ProphylaxisSessionWithAugmentedData prophylaxisSession) {}
