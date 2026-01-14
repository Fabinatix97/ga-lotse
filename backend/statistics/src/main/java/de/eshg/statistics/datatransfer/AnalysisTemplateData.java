/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.datatransfer;

import de.eshg.statistics.api.chart.ChartConfigurationDto;
import java.util.List;

public record AnalysisTemplateData(
    String name,
    ChartConfigurationDto chartConfiguration,
    List<DiagramTemplateData> diagramTemplateDatas) {}
