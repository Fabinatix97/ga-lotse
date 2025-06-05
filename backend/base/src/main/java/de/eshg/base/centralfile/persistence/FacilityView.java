/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence;

import de.eshg.base.address.persistence.embeddable.EmbeddableDomesticAddress;
import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.base.centralfile.persistence.entity.FacilityAddress;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public record FacilityView(
    @NotNull Facility facility,
    @Nullable FacilityAddress address,
    @Nullable EmbeddableDomesticAddress embeddableAddress) {}
