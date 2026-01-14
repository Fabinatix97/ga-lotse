/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.datatransfer;

import de.eshg.statistics.api.filter.TableColumnFilterParameter;
import java.util.List;

public record DiagramTemplateData(
    String title, String description, List<TableColumnFilterParameter> filters) {}
