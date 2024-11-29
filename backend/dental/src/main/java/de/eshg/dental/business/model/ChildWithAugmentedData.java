/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.business.model;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.dental.domain.model.Child;

public record ChildWithAugmentedData(
    Child child, GetPersonFileStateResponse personData, ContactDto contact) {}
