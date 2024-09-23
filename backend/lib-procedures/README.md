# Procedures library

The procedures library provides universal controller implementations building on
a generic domain
model to support the handling of procedures and tasks within business modules.

## Quick start

This guide walks you through the process of integrating the procedure library
into your business
module.

### Procedure library auto configuration

The procedure library is by default auto-configured (
see [ProcedureLibraryAutoConfiguration](src/main/java/de/eshg/lib/procedure/spring/ProcedureLibraryAutoConfiguration.java)).

It is recommended to start with the auto configuration disabled, so that your
application continues
to start without further adjustments. This is particularly useful for the
getting started phase,
where you set up your domain model and necessary dependencies.

```
de.eshg.lib.procedure.autoconfiguration-enabled=false
```

## Enabling the auto configuration

To successfully enable the auto configuration some mandatory beans have to be
added to the spring
context. Each
business module has to supply:

*

A [BusinessModule](../lib-commons/src/main/java/de/eshg/lib/common/BusinessModule.java)
bean for
type classification.

```
@Bean
BusinessModule businessModule() {
  return BusinessModule.TEST_BUSINESS_MODULE;
}
```

*

A [SummaryProvider](src/main/java/de/eshg/lib/procedure/procedures/SummaryProvider.java)
implementation for generation of the procedure / task summaries.

```
@Component
public class TestSummaryProvider
implements SummaryProvider<TestTask, TestProcedure> {

  @Override
  public String getTaskSummary(TestTask task) {
      return "summary";
  }

  @Override
  public String getProcedureSummary(TestProcedure procedure) {
      return "summary";
  }
}
```

*

A [PermissionRole](../lib-keycloak/src/main/java/de/eshg/lib/keycloak/PermissionRole.java)
bean for
security configuration.

```
@Bean(name = ProcedureLibrarySecurityConfiguration.PROCEDURE_ACCESS_ROLE)
PermissionRole procedureAccessRole() {
    return PermissionRole.TEST_PERMISSION_ROLE;
}
```

*

A [ModuleLeaderRole](../lib-keycloak/src/main/java/de/eshg/lib/keycloak/ModuleLeaderRole.java)
bean
to identify which keycloak permission role represents the business module
leaders role.

```
@Bean
ModuleLeaderRole moduleLeaderRole() {
  return ModuleLeaderRole.TEST_PERMISSION_ROLE;
}
```

### Integrating the ORM layer

The procedure library provides generic jakarta persistence entities as *
*@MappedSuperclasses** (see
e.g. [Procedure](src/main/java/de/eshg/lib/procedure/domain/model/Procedure.java))
to provide
procedure-related attributes common to all business modules. Furthermore,
generic Spring Data JPA
repositories are provided to store procedure related data in a relational
database, marked as *
*@NoRepositoryBean** (see
e.g. [ProcedureRepository](src/main/java/de/eshg/lib/procedure/domain/repository/ProcedureRepository.java)).
These classes have to be extended by specific business module ones to integrate
their
functionality.

```
@Entity
public class TestProcedure extends Procedure<TestProcedure, TestTask, TestPerson, TestFacility> {}
```

```
public interface TestProcedureRepository extends ProcedureRepository<TestProcedure> {}
```

## Using the procedure search API

In order to use
the [ProcedureSearchApi](../lib-procedures-api/src/main/java/de/eshg/lib/procedure/api/ProcedureSearchApi.java),
the [AbstractProcedureSearchController](src/main/java/de/eshg/lib/procedure/procedures/AbstractProcedureSearchController.java)
must be extended.

In order to do so, first an interface type for the module specific procedure
must be defined by
implementing [AbstractProcedureDto](../lib-procedures-api/src/main/java/de/eshg/lib/procedure/model/AbstractProcedureDto.java).
Also, a concrete response must be created by
implementing [AbstractGetProceduresByPersonResponse](../lib-procedures-api/src/main/java/de/eshg/lib/procedure/model/AbstractGetProceduresByPersonResponse.java).
In addition, when implementing the concrete search controller, a mapping
function from the domain to the interface type of the module specific procedure
must be passed to the constructor
of [AbstractProcedureSearchController](src/main/java/de/eshg/lib/procedure/procedures/AbstractProcedureSearchController.java).

An example implementation is provided
by [TestProcedureSearchController](src/test/java/de/eshg/lib/procedure/procedures/TestProcedureSearchController.java)
