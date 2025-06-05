# AppointmentBlock library

The appointmentblock library provides controller implementations building on a generic domain
model to support the handling of appointmentblocks within business modules.

## Quick start

This guide walks you through the process of integrating the appointment block library into your business
module.

### AppointmentBlock library auto configuration

The appointment block library is by default auto-configured (
see [AppointmentBlockLibraryAutoConfiguration](src/main/java/de/eshg/lib/appointmentblock/spring/AppointmentBlockLibraryAutoConfiguration.java)).

## Enabling the auto configuration

To successfully enable the auto configuration some mandatory beans have to be added to the spring
context. Each
business module has to supply:

* A [BusinessModule](../lib-commons/src/main/java/de/eshg/lib/common/BusinessModule.java) bean for
  type classification.


## Enabling the security configuration

To enable the security configuration set the application property to **true** (default) and add
a [PermissionRole](../lib-keycloak/src/main/java/de/eshg/lib/keycloak/PermissionRole.java) to the
spring context.

```
@Bean(name = AppointmentBlockLibrarySecurityConfig.APPOINTMENT_BLOCK_ACCESS_ROLE)
PermissionRole appointmentBlockAccessRole() {
return PermissionRole.TEST_PERMISSION_ROLE;
}

```
## Configuration for appointment types

Appointment types can be configured with a standard duration in minutes. With the following application property,
it is possible to configure the initial standard duration.
```
de.eshg.lib.appointmentblock.defaultAppointmentTypeConfiguration[CONSULTATION]=30m
de.eshg.lib.appointmentblock.defaultAppointmentTypeConfiguration[VACCINATION]=15m
```

## Configuration of appointment block groups with different appointment types

Appointment block groups can combine appointments of different types if the combination is allowed.
```
de.eshg.lib.appointmentblock.allowedAppointmentTypeCombinations[0][0]=REGULAR_EXAMINATION
de.eshg.lib.appointmentblock.allowedAppointmentTypeCombinations[0][1]=ENTRY_LEVEL
de.eshg.lib.appointmentblock.allowedAppointmentTypeCombinations[1][0]=CAN_CHILD
de.eshg.lib.appointmentblock.allowedAppointmentTypeCombinations[1][1]=SPECIAL_NEEDS
```

## Configuration for current user calendar

AppointmentBlockGroups are created as a calendar event for a group of physicians and MFAs. Additionally, the event can
be created for the current user (default). In case this property is set to false, at least one physician or MFA is
mandatory to create an appointment block group. In case this property is set to true, physicians and MFAs are optional.
```
de.eshg.lib.appointmentblock.createAppointmentBlockForCurrentUser=false
```
## Configuration for validation of physicians and MFAs

The Service validates, if the given userIds for physicians and MFAs belong to the right technical group. Therefore, the
groups must be configured.
```
  @Bean(name = AppointmentBlockService.TECHNICAL_GROUP_PHYSICIANS)
  TechnicalGroup technicalGroupPhysicians() {
    return TechnicalGroup.TRAVEL_MEDICINE_PHYSICIAN;
  }

  @Bean(name = AppointmentBlockService.TECHNICAL_GROUP_MFAS)
  TechnicalGroup technicalGroupMfas() {
    return TechnicalGroup.TRAVEL_MEDICINE_MFA;
  }
```
## Configuration for calendar event conflicts

There are endpoints to check, if  appointment blocks group have calendar conflicts with other events of the users,
for which the event is created. There is a property to decide, whether it is possible to create appointment blocks
with conflicts or not. Default value is true.

```
de.eshg.lib.appointmentblock.allowAppointmentBlocksWithCalendarEventConflicts=true
```

## Location selection

Appointments can take place in different locations. For the types of allowed locations, see
the supported [LocationSelectionModes](/src/main/java/de/eshg/lib/appointmentblock/LocationSelectionMode.java).

The LocationSelectionMode is configured with the property
```
de.eshg.lib.appointmentblock.locationSelectionMode
```

Note: LocationSelectionModes other than `de.eshg.lib.appointmentblock.LocationSelectionMode.NONE`
require users to have `BASE_CONTACTS_READ` permission in order to view and create
AppointmentBlockGroups.
