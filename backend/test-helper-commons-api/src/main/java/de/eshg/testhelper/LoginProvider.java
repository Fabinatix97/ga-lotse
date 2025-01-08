/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.testhelper.api.TestHelperLoginRequest;

@FunctionalInterface
public interface LoginProvider {
  AccessToken login(TestHelperLoginRequest request);
}
