/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.business.model.ImportCustodianData;
import java.util.List;

public final class CitizenListRowValues extends RowValues {

  private List<ImportCustodianData> custodians;
  private boolean informationBlock;

  public List<ImportCustodianData> getCustodians() {
    return custodians;
  }

  public void setCustodians(List<ImportCustodianData> custodians) {
    this.custodians = custodians;
  }

  public boolean hasInformationBlock() {
    return informationBlock;
  }

  public void setInformationBlock(boolean informationBlock) {
    this.informationBlock = informationBlock;
  }
}
