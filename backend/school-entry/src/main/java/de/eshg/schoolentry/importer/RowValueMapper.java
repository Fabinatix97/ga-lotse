/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.business.model.ImportProcedureData;
import de.eshg.schoolentry.business.model.MergeProcedureData;

public interface RowValueMapper<R> {
  ImportProcedureData mapValuesToImportData(R values);

  MergeProcedureData mapValuesToMergeData(R values);
}
