# Statistics library

The statistics library provides implementations to implement the lib-statistics-api.
The statistics API ensures that statistics data of a business module can be retrieved.

## Quick start

The statistics library is by default autoconfigured, see
[StatisticsLibraryAutoConfiguration](src/main/java/de/eshg/lib/statistics/spring/config/StatisticsLibraryAutoConfiguration.java)
and
[StatisticsLibraryDomainModelAutoConfiguration](src/main/java/de/eshg/lib/statistics/spring/config/StatisticsLibraryDomainModelAutoConfiguration.java)..

A liquibase migration is needed for `ProcedureReferenceForStatistics` and the `StatisticsProcedureReferenceHousekeeping` with `shedlock`.

The role `STATISTICS_STATISTICS_WRITE` is used for most endpoints because reading
statistics information from a business module should only be done by users who can write statistics in the statistics module.

## Anonymization
If the business module supports anonymization (see below `canBeAnonymized` = true) there are currently these options to do that:
* For all kinds of data sources:
  * in the method `bulkAnonymizeDataRows`, the method needs to be overwritten if there is a data source with `canBeAnonymized` = true
  * if the anonymization is already done in a different method this method can be empty
  * the method is only called if `getSpecificDataRequest.anonymizationRequired()` is true
* Procedure based data sources:
  * in the method `getSpecificValue` if `anonymizationRequired` is true
* For other data sources:
  * in the method `getSpecificDataNotProcedureBased` if `getSpecificDataRequest.anonymizationRequired()` is true

For each data source the anonymization should only happen in one place.

## StatisticsService

Each business module must provide data sources as Spring beans (type `DataSource`).
Each `DataSource` should have a globally unique id. This id must not change.
A name is also needed for the UI.
The `DataSourceSensitivity` is needed to determine what can be done with the data
in the statistics module.

* `SENSITIVE` means only users with the permission for the business module can see/use the data.
* `INTERNAL_USAGE` means all statistics users can see/use the data, the data should not be published.
* `ANONYMOUS` is for data sources that deliver data that can be published.

IMPORTANT: `canBeAnonymized` can only be true if the business module has an algorithm for the
anonymization of the data. 
`canBeAnonymized` should always be false if `DataSourceSensitivity` = `ANONYMOUS`.

Based on the available data sources the user will select the wanted statistics data fields. The values should fit to
the corresponding `AttributeInfo`. `null` is also a valid value.

* BOOLEAN: java.lang.Boolean (or boolean)
* DATE: java.lang.String in the format yyyy-MM-dd as returned by java.time.LocalDate.toString()
* DECIMAL: java.lang.Double (or double) - precision = 10, scale = 4 can be handled
* INTEGER: java.lang.Integer (or int)
* TEXT: java.lang.String, blank strings will be stored as null
* VALUE_WITH_OPTIONS: java.lang.String, one value of the provided options, blank strings will be stored as null
* PROCEDURE_ID: java.util.UUID
* CENTRAL_FILE_ID_PERSON & CENTRAL_FILE_ID_FACILITY & CONTACT_ID: java.util.UUID

## ValueOptionInternal
None or only one option can be an explicit value that the information is not provided for the attribute (`isUnknownValue=true`).
