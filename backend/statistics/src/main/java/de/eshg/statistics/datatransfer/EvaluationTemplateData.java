/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.datatransfer;

import de.eshg.statistics.api.datasource.DataSourceDto;
import java.util.List;

public record EvaluationTemplateData(
    List<DataSourceDto> dataSources, List<AnalysisTemplateData> analysisTemplateDatas) {}
