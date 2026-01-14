/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.initialization;

import org.springframework.core.io.Resource;

public interface InitialPrivacyDocuments {

  Resource privacyPolicy();

  Resource privacyNotice();
}
