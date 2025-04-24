/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.department;

public sealed interface MarkdownName permits CitizenPortalMarkdownName, EmployeePortalMarkdownName {
  String fileNameRoot();
}
