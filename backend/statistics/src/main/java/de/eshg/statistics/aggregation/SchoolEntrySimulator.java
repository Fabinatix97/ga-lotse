/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.aggregation;

import de.eshg.lib.statistics.StatisticsApi;
import de.eshg.lib.statistics.api.Attribute;
import de.eshg.lib.statistics.api.DataRow;
import de.eshg.lib.statistics.api.DataSourceInfo;
import de.eshg.lib.statistics.api.DataSourceSensitivity;
import de.eshg.lib.statistics.api.DataTableHeader;
import de.eshg.lib.statistics.api.GetDataSourcesResponse;
import de.eshg.lib.statistics.api.GetSpecificDataRequest;
import de.eshg.lib.statistics.api.GetSpecificDataResponse;
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
@HttpExchange("/simulator/school-entry/statistics")
@Profile("simulator")
@Hidden
public class SchoolEntrySimulator implements StatisticsApi {
  public static final UUID DATA_SOURCE_UUID =
      UUID.fromString("3bee6747-9cbc-423c-a192-ad978d45970a");

  public static final int UNKNOWN_INT_VALUE = 999;
  public static final double UNKNOWN_DECIMAL_VALUE = 99.9;
  private static final String UNKNOWN = "unbekannt";
  private static final String UNKNOWN_DATE_VALUE = "9999-12-30";
  private static final String CATEGORY = "ESU";

  public static final Attribute PROCEDURE_ID_ATTRIBUTE =
      new Attribute(
          "ID des Vorgangs", "PROCEDURE_ID", ValueType.PROCEDURE_ID, null, null, CATEGORY, false);
  public static final Attribute VALUE_WITH_OPTIONS_ATTRIBUTE =
      new Attribute(
          "ValueWithOptions Attribute",
          "VALUE_WITH_OPTIONS",
          ValueType.VALUE_WITH_OPTIONS,
          null,
          List.of(
              new ValueOptionInternal("I", "in Ordnung", false),
              new ValueOptionInternal("B", "Bekannt/Behandelt", false),
              new ValueOptionInternal("U", "Unbekannt", true)),
          CATEGORY,
          true);

  public static final Attribute INTEGER_ATTRIBUTE_WITH_VALUE_OPTIONS =
      new Attribute(
          "Integer attribute with value options",
          "INTEGER_WITH_VALUE_OPTIONS",
          ValueType.INTEGER,
          null,
          List.of(new ValueOptionInternal("999", UNKNOWN, true)),
          CATEGORY,
          true);
  public static final Attribute INTEGER_ATTRIBUTE_WITHOUT_VALUE_OPTIONS =
      new Attribute(
          "Integer Attribute without value options",
          "INTEGER_WITHOUT_VALUE_OPTIONS",
          ValueType.INTEGER,
          "cm",
          null,
          CATEGORY,
          true);
  public static final Attribute DECIMAL_ATTRIBUTE_WITH_VALUE_OPTIONS =
      new Attribute(
          "Decimal Attribute with value options",
          "DECIMAL_WITH_VALUE_OPTIONS",
          ValueType.DECIMAL,
          null,
          List.of(new ValueOptionInternal("99.9", UNKNOWN, true)),
          CATEGORY,
          false);
  public static final Attribute DECIMAL_ATTRIBUTE_WITHOUT_VALUE_OPTIONS =
      new Attribute(
          "Decimal Attribute without value options",
          "DECIMAL_WITHOUT_VALUE_OPTIONS",
          ValueType.DECIMAL,
          "kg",
          null,
          CATEGORY,
          true);
  public static final Attribute DATE_ATTRIBUTE_WITH_VALUE_OPTIONS =
      new Attribute(
          "Date Attribute with value options",
          "DATE_WITH_VALUE_OPTIONS",
          ValueType.DATE,
          null,
          List.of(new ValueOptionInternal(UNKNOWN_DATE_VALUE, UNKNOWN, true)),
          CATEGORY,
          false);
  public static final Attribute DATE_ATTRIBUTE_WITHOUT_VALUE_OPTIONS =
      new Attribute(
          "Date Attribute without value options",
          "DATE_WITHOUT_VALUE_OPTIONS",
          ValueType.DATE,
          null,
          null,
          CATEGORY,
          true);
  public static final Attribute TEXT_ATTRIBUTE_WITH_VALUE_OPTIONS =
      new Attribute(
          "Text Attribute with value options",
          "TEXT_WITH_VALUE_OPTIONS",
          ValueType.TEXT,
          null,
          List.of(new ValueOptionInternal("U", UNKNOWN, true)),
          CATEGORY,
          true);
  public static final Attribute TEXT_ATTRIBUTE_WITHOUT_VALUE_OPTIONS =
      new Attribute(
          "Text Attribute without value options",
          "TEXT_WITHOUT_VALUE_OPTIONS",
          ValueType.TEXT,
          null,
          null,
          CATEGORY,
          true);
  public static final Attribute BOOLEAN_ATTRIBUTE =
      new Attribute(
          "Boolean Attribute", "ESU BOOLEAN", ValueType.BOOLEAN, null, null, CATEGORY, true);
  public static final List<Attribute> ATTRIBUTE_LIST =
      List.of(
          PROCEDURE_ID_ATTRIBUTE,
          VALUE_WITH_OPTIONS_ATTRIBUTE,
          INTEGER_ATTRIBUTE_WITHOUT_VALUE_OPTIONS,
          INTEGER_ATTRIBUTE_WITH_VALUE_OPTIONS,
          DECIMAL_ATTRIBUTE_WITHOUT_VALUE_OPTIONS,
          DECIMAL_ATTRIBUTE_WITH_VALUE_OPTIONS,
          DATE_ATTRIBUTE_WITHOUT_VALUE_OPTIONS,
          DATE_ATTRIBUTE_WITH_VALUE_OPTIONS,
          TEXT_ATTRIBUTE_WITHOUT_VALUE_OPTIONS,
          TEXT_ATTRIBUTE_WITH_VALUE_OPTIONS,
          BOOLEAN_ATTRIBUTE);

  public static final UUID FIRST_UUID = UUID.fromString("5a9dfe7c-047a-4f22-83cb-d841d5d8360e");
  public static final UUID SECOND_UUID = UUID.fromString("9b85b678-0e12-4bab-a203-509c5288b059");
  private static final UUID THIRD_UUID = UUID.fromString("3b85b678-0e12-4bab-a203-509c5288b059");
  private static final UUID FOURTH_UUID = UUID.fromString("4b85b678-0e12-4bab-a203-509c5288b059");

  @Override
  public GetDataSourcesResponse getAvailableDataSources() {
    return new GetDataSourcesResponse(
        List.of(
            new DataSourceInfo(
                DATA_SOURCE_UUID, "ESU", DataSourceSensitivity.SENSITIVE, true, ATTRIBUTE_LIST)));
  }

  @Override
  public GetSpecificDataResponse getSpecificData(GetSpecificDataRequest getSpecificDataRequest) {
    return new GetSpecificDataResponse(
        "ESU",
        getSpecificDataRequest.timeRangeStart(),
        getSpecificDataRequest.timeRangeEnd(),
        DataSourceSensitivity.SENSITIVE,
        getSpecificDataRequest.anonymizationRequired(),
        new DataTableHeader(ATTRIBUTE_LIST),
        List.of(
            new DataRow(
                Arrays.asList(
                    FIRST_UUID,
                    "I",
                    13,
                    null,
                    13.12,
                    UNKNOWN_DECIMAL_VALUE,
                    "2011-02-16",
                    UNKNOWN_DATE_VALUE,
                    "Stadt a",
                    "other",
                    true)),
            new DataRow(
                Arrays.asList(
                    SECOND_UUID,
                    "B",
                    19,
                    UNKNOWN_INT_VALUE,
                    19.10,
                    UNKNOWN_DECIMAL_VALUE,
                    "2020-05-18",
                    "2024-05-18",
                    "Stadt b",
                    "U",
                    false)),
            new DataRow(
                Arrays.asList(
                    THIRD_UUID,
                    "U",
                    7,
                    UNKNOWN_INT_VALUE,
                    7,
                    UNKNOWN_DECIMAL_VALUE,
                    "2020-05-17",
                    "2020-05-14",
                    "Stadt c",
                    "value",
                    false)),
            new DataRow(
                Arrays.asList(
                    FOURTH_UUID, null, null, null, null, null, null, null, null, null, null))),
        4);
  }
}
