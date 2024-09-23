# Statistics library

The statistics library provides implementations to implement the lib-statistics-api.
The statistics API ensures that statistics data of a business module can be retrieved.

## Quick start

The statistics library is by default autoconfigured, see
[StatisticsLibraryAutoConfiguration](src/main/java/de/eshg/lib/statistics/spring/config/StatisticsLibraryAutoConfiguration.java).

This contains the permission role for the API endpoints. The role `STATISTICS_STATISTICS_WRITE` is used because reading
statistics information from a business module should only be done by users who can write statistics in the statistics module.

## AbstractStatisticsService

A bean extending the [AbstractStatisticsService](src/main/java/de/eshg/lib/statistics/AbstractStatisticsService.java) is required.
The service requires a `ProcedureRepository` bean.

### getDataSourceMetaInfos
Each business module can provide a list of `DataSourceInfo`.
Each `DataSourceInfo` should have a globally unique id. This id must not change.
A name is also needed for the UI.

### getDataSourceIdToAttributeInfos
A list of `AttributeInfo`s belongs to each `DataSourceInfo`.
The codes of the attributes must be unique for each `DataSourceInfo`.

### AttributeInfo - ValueType
Each `AttributeInfo` has a `ValueType` which indicates the type of the attribute. There are two special kinds of `ValueType`.

`ValueType.PROCEDURE_ID` - If there is a corresponding procedure the frontend will create a link to this procedure for this data row.

`ValueType.CENTRAL_FILE_ID` - an attribute of this type should be provided if there is a reference to a subject in the central file.

### getSubjectType
Here the subject type for `AttributeInfo`s with `ValueType.CENTRAL_FILE_ID` must be provided.
If no such attribute is provided the method can return `null`.

### getSpecificValue
Based on the available data sources the user will select the wanted statistic data fields. The values should fit to
the corresponding `AttributeInfo`. `null` is also a valid value.

* BOOLEAN: java.lang.Boolean (or boolean)
* DATE: java.lang.String in the format yyyy-MMM-dd as returned by java.time.LocalDate.toString()
* DECIMAL: java.lang.Double (or double) - precision = 10, scale = 4 can be handled
* INTEGER: java.lang.Integer (or int)
* TEXT: java.lang.String
* VALUE_WITH_OPTIONS: java.lang.String, one value of the provided options
* PROCEDURE_ID: java.util.UUID
* CENTRAL_FILE_ID: java.util.UUID

### ValueOptionInternal
None or only one option can be an explicit value that the information is not provided for the attribute (`isUnknownValue=true`).
There must not be an unknown value for `ValueType`s BOOLEAN, PROCEDURE_ID and CENTRAL_FILE_ID.