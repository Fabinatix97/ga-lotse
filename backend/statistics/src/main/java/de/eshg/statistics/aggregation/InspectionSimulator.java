/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.lib.statistics.StatisticsApi;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataSource;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
import de.eshg.lib.statistics.api.SubjectType;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import io.swagger.v3.oas.annotations.Hidden;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.HttpExchange;

@RestController
@HttpExchange("/simulator/inspection/statistics")
@Profile("simulator")
@Hidden
public class InspectionSimulator implements StatisticsApi {
  public static final String ATTRIBUTE_CATEGORY = "Inspection";
  public static final Attribute PROCEDURE_ID_ATTRIBUTE =
      new Attribute(
          "ID des Vorgangs",
          "PROCEDURE_ID",
          ValueType.PROCEDURE_ID,
          null,
          null,
          ATTRIBUTE_CATEGORY,
          false);
  public static final Attribute FACILITY_ATTRIBUTE =
      new Attribute(
          "Einrichtung",
          "EINRICHTUNG",
          ValueType.CENTRAL_FILE_ID,
          SubjectType.FACILITY,
          null,
          null,
          "Einrichtung",
          true);
  public static final Attribute LOCATION_ATTRIBUTE =
      new Attribute(
          "Ort der Begehung", "ORT", ValueType.TEXT, null, null, ATTRIBUTE_CATEGORY, true);
  public static final UUID DATA_SOURCE_UUID =
      UUID.fromString("d1bf2c30-192f-426d-8ab3-aa9991dec726");
  public static final UUID DATA_SOURCE_UUID_2 =
      UUID.fromString("cdbf9a5c-a6d1-4b18-9013-b976e0fbf288");
  private static final Attribute RESULT_ATTRIBUTE =
      new Attribute(
          "Ergebnis Begehung",
          "ERGEBNIS",
          ValueType.VALUE_WITH_OPTIONS,
          null,
          List.of(
              new ValueOptionInternal("I", "in Ordnung", false),
              new ValueOptionInternal("F", "Mangelhaft", false)),
          ATTRIBUTE_CATEGORY,
          true);
  private static final UUID FIRST_UUID = UUID.fromString("7efebca3-1780-4ec0-9ff6-df15afeccfbf");
  private static final UUID SECOND_UUID = UUID.fromString("de31b6bd-b704-460b-a276-b4f53824a03c");

  private static final UUID FACILITY_UUID = UUID.fromString("dddddddd-bbbb-4444-aaaa-bbbbbbbbbbbb");

  @Override
  public GetDataSourcesResponse getAvailableDataSources() {
    return new GetDataSourcesResponse(
        List.of(
            new DataSource(
                DATA_SOURCE_UUID,
                "INSPECTION",
                DataSourceSensitivity.INTERNAL_USAGE,
                false,
                List.of(PROCEDURE_ID_ATTRIBUTE, FACILITY_ATTRIBUTE, LOCATION_ATTRIBUTE)),
            new DataSource(
                DATA_SOURCE_UUID_2,
                "INSPECTION2",
                DataSourceSensitivity.INTERNAL_USAGE,
                false,
                List.of(LOCATION_ATTRIBUTE, RESULT_ATTRIBUTE))));
  }

  @Override
  public GetSpecificDataResponse getSpecificData(GetSpecificDataRequest getSpecificDataRequest) {
    if (getSpecificDataRequest.dataSourceId().equals(DATA_SOURCE_UUID)) {
      return new GetSpecificDataResponse(
          "INSPECTION",
          getSpecificDataRequest.timeRangeStart(),
          getSpecificDataRequest.timeRangeEnd(),
          DataSourceSensitivity.INTERNAL_USAGE,
          false,
          new DataTableHeader(
              List.of(PROCEDURE_ID_ATTRIBUTE, FACILITY_ATTRIBUTE, LOCATION_ATTRIBUTE)),
          List.of(new DataRow(Arrays.asList(FIRST_UUID, FACILITY_UUID, "Frankfurt"))),
          1);
    } else {
      return new GetSpecificDataResponse(
          "INSPECTION2",
          getSpecificDataRequest.timeRangeStart(),
          getSpecificDataRequest.timeRangeEnd(),
          DataSourceSensitivity.INTERNAL_USAGE,
          false,
          new DataTableHeader(
              List.of(PROCEDURE_ID_ATTRIBUTE, RESULT_ATTRIBUTE, LOCATION_ATTRIBUTE)),
          List.of(
              new DataRow(Arrays.asList(FIRST_UUID, "I", "Schulkantine")),
              new DataRow(Arrays.asList(SECOND_UUID, "F", "Tattoostudio"))),
          2);
    }
  }
}
