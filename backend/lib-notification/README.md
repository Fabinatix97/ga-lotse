# Notification library

The notification library provides implementations to create and retrieve notifications for users.
The user can mark the notifications as read.

## Quick start

The notification library is by default autoconfigured, see
[NotificationLibraryAutoConfiguration](src/main/java/de/eshg/lib/notification/spring/config/NotificationLibraryAutoConfiguration.java).

It can be disabled, so that your application continues
to start without further adjustments. This is particularly useful for the getting started phase,
where you set up your domain model and necessary dependencies.

```
de.eshg.lib.notification.autoconfiguration-enabled=false
```

## Enabling the autoconfiguration

To successfully enable the autoconfiguration some mandatory beans have to be added to the spring
context. Each business module has to supply:

* A [BusinessModule](../lib-commons/src/main/java/de/eshg/lib/common/BusinessModule.java) bean for
  type classification.

This bean is only optional because the base module has notifications as well.

```
@Bean
BusinessModule businessModule() {
  return BusinessModule.TEST_BUSINESS_MODULE;
}
```

### Integrating the ORM layer

The library provides a generic jakarta persistence entity 
[Notification](src/main/java/de/eshg/lib/notification/domain/model/Notification.java) 
as a  **@MappedSuperclass** to provide attributes common to all business modules.
Furthermore, generic Spring Data JPA repository 
[NotificationRepository](src/main/java/de/eshg/lib/notification/domain/repository/NotificationRepository.java) 
is provided to store notification related data in a relational database, marked as **@NoRepositoryBean**.
These classes have to be extended by specific business module ones to integrate their functionality.
Also a [NotificationService](src/main/java/de/eshg/lib/notification/NotificationService.java) is needed. 

```
@Entity
public class TestNotification extends Notification {}
```

```
public interface TestNotificationRepository extends NotificationRepository<TestNotification> {}
```

```
public class TestNotificationService extends NotificationService<TestNotification> {}
```

## Enabling the security configuration

To enable the security configuration set the application property to **true** and add a 
[PermissionRole](../lib-keycloak/src/main/java/de/eshg/lib/keycloak/PermissionRole.java) to the
spring context.

```
@Bean
PermissionRole notificationAccessRole() {
    return PermissionRole.TEST_PERMISSION_ROLE;
}
```