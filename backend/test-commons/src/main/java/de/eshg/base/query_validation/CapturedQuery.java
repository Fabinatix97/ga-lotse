/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.query_validation;

import java.util.List;
import net.ttddyy.dsproxy.ExecutionInfo;
import net.ttddyy.dsproxy.QueryInfo;

public record CapturedQuery(ExecutionInfo execInfo, List<QueryInfo> queryInfoList) {}
