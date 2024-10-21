/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.schoolentry.business.model.ImportCustodianData;
import java.util.List;
import java.util.Objects;

public final class CitizenListRowValues extends SchoolEntryRowValues {

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

  @Override
  public boolean isDuplicateRow(Object other) {
    return (other instanceof CitizenListRowValues citizenListRowValues)
        && Objects.equals(this.getChild(), citizenListRowValues.getChild())
        && Objects.equals(this.getCustodians(), citizenListRowValues.getCustodians());
  }
}
