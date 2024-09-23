/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import java.beans.PropertyDescriptor;
import java.util.stream.Stream;

public interface ValidatableEntity {
  Stream<PropertyDescriptor> getPropertiesToValidate();
}
