/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.statistic;

import de.eshg.dental.domain.model.Child;
import de.eshg.dental.domain.repository.ChildRepository;
import de.eshg.dental.statistic.model.Group;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.datasource.ProcedureDataSource;
import de.eshg.lib.statistics.util.TimeRange;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class DentalChildDataSource extends ProcedureDataSource<Child, DentalChildAttributes> {

  public static final UUID DATA_SOURCE_ID = UUID.fromString("b5369dfc-d9d4-42e9-abc7-428c6ad348ca");

  public static final String DATA_SOURCE_NAME = "ZAD Kind";

  public DentalChildDataSource(ChildRepository childRepository) {
    super(
        DATA_SOURCE_ID,
        DATA_SOURCE_NAME,
        DataSourceSensitivity.SENSITIVE,
        childRepository,
        DentalChildAttributes.values(),
        false);
  }

  @Override
  protected Object mapSpecificValue(
      Child child, DentalChildAttributes attribute, TimeRange timeRange) {
    return switch (attribute) {
      case PROCEDURE_ID -> child.getExternalId();
      case CHILD_CENTRAL_FILE_ID -> child.getChildIdFromCentralFile();
      case CHILD_GROUP -> getGroup(child.getGroupName());
    };
  }

  private String getGroup(String groupName) {
    if (groupName == null) {
      return null;
    }
    return Group.convertToGroupValue(groupName).getValue();
  }
}
