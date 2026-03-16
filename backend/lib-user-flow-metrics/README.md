# User flow metrics

This library provides a consistent way to track the start and end of a user
flow for example in the citizen portal.

The goal is to analyze how long an activity of a user is and also to see how
many users do not finish a certain user flow (for example changing an appointment).

At the start of a user flow a database entry with a UUID is persisted with the
start time and name of the flow. At the end of the flow the duration is stored.

The UUID is provided to the frontend to be used at the end of the flow.

## Quick start

The user flow metrics library is by default autoconfigured, see
[UserFlowMetricsLibraryAutoConfiguration](src/main/java/de/eshg/lib/userflowmetrics/spring/UserFlowMetricsLibraryAutoConfiguration.java).

It can be disabled, so that your application continues
to start without further adjustments. This is particularly useful for the getting started phase,
where you set up your domain model and necessary dependencies.

```
de.eshg.lib.userflowmetrics.autoconfiguration-enabled=false
```

## Enabling the autoconfiguration

To successfully enable the autoconfiguration some mandatory beans have to be added to the spring
context. Each business module has to supply:

* A [BusinessModule](../lib-commons/src/main/java/de/eshg/lib/common/BusinessModule.java) bean for
  type classification.

```
@Bean
BusinessModule businessModule() {
  return BusinessModule.TEST_BUSINESS_MODULE;
}
```

### Integrating the ORM layer
The library provides a jakarta persistence entity
[UserFlow](src/main/java/de/eshg/lib/userflowmetrics/persistence/UserFlow.java)

A liquibase migration is necessary when integrating this library.

# Integration in REST endpoints
There is no general endpoint to start or end a user flow.
This has to be integrated by the business module itself.

## Starting a flow
If there is no need for different permissions for the start of the user flow
a single endpoint can be used with the provided `UserFlowService` and API classes:

```
  @PostMapping("/start-user-flow")
  @Transactional
  public GetStartUserFlowTrackingResponse getStartUserFlowTrackingResponse(
      @Valid @RequestBody GetStartUserFlowTrackingRequest request) {
    return userFlowService.startUserFlow(request.userFlowType());
  }
```

If there are needs for different permissions, different endpoints can be provided.

## Ending a flow

To finish a user flow the last endpoint has to make the following method
call, preferably in the same transaction:

```
  userFlowService.finishUserFlow(userFlowTrackingId);
```

The `userFlowTrackingId` can be part of the body of the request, if present, or a parameter.
The method can handle `null` and other cases that should not happen because the user experience
is considered more important than successful finishing a user flow.
