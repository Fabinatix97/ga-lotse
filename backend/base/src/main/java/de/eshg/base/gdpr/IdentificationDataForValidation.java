/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

public sealed interface IdentificationDataForValidation
    permits PersonIdentificationDataForValidation, FacilityIdentificationDataForValidation {}
