/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.query_validation;

import java.util.ArrayList;
import java.util.List;
import net.ttddyy.dsproxy.ExecutionInfo;
import net.ttddyy.dsproxy.QueryInfo;
import net.ttddyy.dsproxy.listener.NoOpQueryExecutionListener;

public class QueryAndParamsCapturingListener extends NoOpQueryExecutionListener {

  private boolean listening;

  private final List<CapturedQuery> capturedQueries = new ArrayList<>();

  List<CapturedQuery> getCapturedQueries() {
    return capturedQueries;
  }

  @Override
  public void afterQuery(ExecutionInfo execInfo, List<QueryInfo> queryInfoList) {
    if (!listening) {
      return;
    }

    capturedQueries.add(new CapturedQuery(execInfo, queryInfoList));
  }

  void startListening() {
    listening = true;
  }

  void stopListening() {
    listening = false;
    capturedQueries.clear();
  }
}
