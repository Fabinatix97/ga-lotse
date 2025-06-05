/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

import de.eshg.config.i18n.MultiLangFileName;

public sealed interface MarkdownName permits CitizenPortalMarkdownName, EmployeePortalMarkdownName {
  MultiLangFileName getFileName();
}
