# The eshg-backend

This project uses a gradle [multi project build](https://docs.gradle.org/current/userguide/multi_project_builds.html).

After importing in intellij make sure to switch to Eclipse Temurin JDK 21. A good way to install and manage jdks
is [sdkman](https://sdkman.io/).

Docker (26 or newer) and docker compose (2.27 or newer) are needed to run the `composeUp` gradle tasks.

By setting the system property `-Deshg.testcontainers.enabled=false`, unit tests do not start testcontainers to speed up
test execution during development. Developers must provide alternatives to connect to like a local DB. A IntelliJ run
configuration template for unit tests is provided.

# Login Information

During the initial setup, the [EmployeeTestUser](lib-keycloak/src/main/java/de/eshg/lib/keycloak/EmployeeTestUser.java) is used to
configure test users with the specified credentials in our keycloak service.
Some of the current credentials used for development purposes are:

| Username               | Password | Scope                                                                    |
|----------------------- | -------- | ------------------------------------------------------------------------ |
| admin                  | admin    | Keycloak admin                                                           |
| dummy                  | password | all permissions                                                          |
| tm_user                | password | travel medicine user                                                     |
| inspection_ga_user     | password | inspection standard user of a "Gesundheitsamt"                           |
| inspection_ga_config   | password | inspection user of a "Gesundheitsamt" able to edit inspection templates  |
| inspection_ga_teamlead | password | inspection team leader of a "Gesundheitsamt"                             |
| inspection_la_user     | password | inspection user of a "Landesamt"                                         |
| ...                    | password | ...                                                                      |

Note: The provisioning of these test users is controlled in the `base` module with the system property `eshg.keycloak.provision-test-users`.
Passwords can only be used to login if `eshg.keycloak.allow-passwords-for-employees` is `true` (default with `:base:composeUp`).

# Starting the backend application

## as a whole (dockerized)

To start the backend application for local testing, run `./gradlew composeUp`. Note that this will
start the application built from source as-is in your checkout and enable the `test-helper` profile for local testing.
To shut down the backend application run `./gradlew composeDown`.

## Preview Features

Preview Features are the feature toggles that are mature enough to be set to their target state in the environments that are used for acceptance testing.
To activate preview features, simply pass the `-PpreviewFeatures` property when starting the Docker containers via Gradle.

Example:

```bash
./gradlew --parallel -PpreviewFeatures base:composeUp auth:composeUp school-entry:composeUp
```

The preview features are controlled through the `preview-features` Spring profile.
The set of all preview features is defined in the `application-preview-features.properties` file of each module.

### port mapping

| Name                        | Internal Port | External Port |
|-----------------------------|---------------|---------------|
| maildev ui                  | 1080          | 1080          |
| maildev smtp                | 1025          | 1025          |
| base-db                     | 5432          | 5433          |
| inspection-db               | 5432          | 5434          |
| school-entry-db             | 5432          | 5435          |
| keycloak-db                 | 5432          | 5436          |
| service-directory-db        | 5432          | 5437          |
| travel-medicine-db          | 5432          | 5438          |
| measles-protection-db       | 5432          | 5439          |
| statistics-db               | 5432          | 5440          |
| chat-management-db          | 5432          | 5441          |
| synapse-db                  | 5432          | 5442          |
| central-repository-db       | 5432          | 5443          |
| auditlog-db                 | 5432          | 5444          |
| sti-protection-db           | 5432          | 5445          |
| opendata-db                 | 5432          | 5446          |
| medical-registry-db         | 5432          | 5447          |
| dental-db                   | 5432          | 5448          |
| official-medical-service-db | 5432          | 5449          |
| meds-abroad-db              | 5432          | 5450          |
| prostitute-protection-db    | 5432          | 5451          |
| synapse                     | 8008          | 8008          |
| base                        | 8080          | 8080          |
| inspection                  | 8080          | 8081          |
| school-entry                | 8080          | 8082          |
| service-directory           | 8080          | 8083          |
| relay-server                | 8080          | 8084          |
| travel-medicine             | 8080          | 8085          |
| measles-protection          | 8080          | 8086          |
| statistics                  | 8080          | 8087          |
| sti-protection              | 8080          | 8095          |
| opendata                    | 8080          | 8096          |
| medical-registry            | 8080          | 8097          |
| dental                      | 8080          | 8098          |
| official-medical-service    | 8080          | 8099          |
| meds-abroad                 | 8080          | 8100          |
| prostitute-protection       | 8080          | 8102          |
| chat-management             | 8080          | 8088          |
| local-service-directory     | 8080          | 8089          |
| central-repository          | 8080          | 8091          |
| auth-employee-portal        | 8080          | 8092          |
| auth-citizen-portal         | 8080          | 8093          |
| auth-cache                  | 6379          | 6379          |
| keycloak                    | 8080          | 9090          |
| auditlog                    | 8080          | 8094          |

## individual modules (dockerized)

To start individual modules run `./gradlew <GRADLE_MODULE>:composeUp`. Note that this will
start the application - built from source as-is in your checkout.

- `./gradlew base:composeUp`
- `./gradlew inspection:composeUp`
- `./gradlew school-entry:composeUp`
- `./gradlew service-directory:composeUp`
- `./gradlew travel-medicine:composeUp`
- `./gradlew measles-protection:composeUp`
- ...

Shutting down individual modules can be done using the
respective counterpart `./gradlew <GRADLE_MODULE>:composeDown`.

Keycloak and maildev are started as a dependency of the base module's `composeUp`.

## individual modules (bootRun)

As an alternative you can use IntelliJ (<module> -> Tasks -> application) or the console to start
bootRun `./gradlew base:bootRun`.
However, this will not start / prepare a database for you.

# Dependencies

We use gradle's [dependency locking mechanism](https://docs.gradle.org/current/userguide/dependency_locking.html) and
the [spring dependency-management plugin](https://docs.spring.io/dependency-management-plugin/docs/current/reference/html/).

Wherever possible we use dependencies versions that are given via the spring dependency-management plugin, if the
desired dependency is not managed via the said plugin, we strive to use `latest.release` as version and lock the
version as explained in the following sections.

The version of keycloak is controlled using a version catalog in `settings.gradle`, to ensure all keycloak related dependencies use the same version.

**When introducing / updating dependencies please avoid version conflicts! Review the lockfile changes thoroughly**

## Introducing new dependencies

Before integrating a new dependency, please consider if the dependency is necessary. Follow the guidelines in the [Dependency Management Guide](../docs/dependency-management.adoc#check-if-the-dependency-is-necessary-and-reasonable).

Introduce new dependencies as usual by adding them to the [build.gradle](build.gradle) file. Then update the
dependency lock-files for the new dependency, and it's transitive dependencies:

**Example:**

You added to `build.gradle`:

    implementation 'commons-io:commons-io:latest.release'

now run

    ./gradlew <name-of-the-submodule>:dependencies --update-locks 'commons-io:commons-io'

see
also [Selectively updating lock state entries](https://docs.gradle.org/current/userguide/dependency_locking.html#selectively_updating_lock_state_entries)

in case you are introducing dependencies in a "library module" (one that other module depends on) it is often necessary
to update locks also of all dependent modules. To do this, run

    ./gradlew resolveAndLockAll --update-locks 'commons-io:commons-io'

## Selectively updating dependencies

Updating a single dependency works the same as adding it. Given the dependency is specified with `latest.release`, updating
the locks will update the dependency.
For more hints / instructions on how to selectively update a single dependency (or multiple, but not all)
see [Selectively updating lock state entries](https://docs.gradle.org/current/userguide/dependency_locking.html#selectively_updating_lock_state_entries)

## Updating all dependencies

Important :caution:: Dependency upgrades should only be integrated to the main branch after thorough review!

### Updating all dependencies in a single gradle subproject

1. Delete the lockfiles:
   - [gradle.lockfile](gradle.lockfile)
   - [buildscript-gradle.lockfile](buildscript-gradle.lockfile)
2. Run the gradle task `<name-of-the-submodule>:dependencies --refresh-dependencies --write-locks`

### Updating all dependencies in all gradle subprojects

1. Delete all lockfiles from all subprojects
2. Run the gradle task `resolveAndLockAll --refresh-dependencies --write-locks`

## Forcing versions

Sometimes it might be necessary to force a specific version of a dependency. The procedure is slightly different for "
normal" vs. "spring boot managed" dependencies.

### Normal dependencies

Replace `latest.release` with the desired version in the coordinates of the dependency. See
also [Declaring Versions and Ranges](https://docs.gradle.org/current/userguide/single_versions.html) in the gradle docs.

### Spring boot managed dependencies

For [spring boot managed dependencies](https://docs.spring.io/spring-boot/docs/current/reference/html/dependency-versions.html)
add a property overwriting the version along with a comment why this is necessary to the [build.gradle](build.gradle).

Example:

    ext['liquibase.version'] = '4.9.1' //newer version needed because...

See [Version Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/dependency-versions.html#appendix.dependency-versions.properties)

## Code format

To format your code, you can run

    ./gradlew spotlessApply

Or install
the [google-java-format IntelliJ plugin](https://github.com/google/google-java-format#intellij-android-studio-and-other-jetbrains-ides)
and format via IntelliJ.
Additionally,
you can configure IntelliJ
to [reformat-on-save](https://www.jetbrains.com/help/idea/reformat-and-rearrange-code.html#reformat-on-save).

A good idea is also
to [exclude validation files from formatting in IntelliJ](https://www.jetbrains.com/help/idea/reformat-and-rearrange-code.html#exclude_file_from_reformat)
by using
the pattern: `**/data/test/{validation,output,raw}/**`.

## Git

To hide certain commits like large formatting changes from git blame,
you can use the versioned [`.git-blame-ignore-revs`](../.git-blame-ignore-revs) file in your local git config via

    git config blame.ignoreRevsFile .git-blame-ignore-revs

## Reference Documentation

For further reference, please consider the following sections:

- [Official Gradle documentation](https://docs.gradle.org)
- [Spring Boot Gradle Plugin Reference Guide](https://docs.spring.io/spring-boot/gradle-plugin/index.html)
- [Create an OCI image](https://docs.spring.io/spring-boot/gradle-plugin/packaging-oci-image.html)
- [Spring Boot Testcontainers support](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [Testcontainers Postgres Module Reference Guide](https://java.testcontainers.org/modules/databases/postgres/)
- [Spring Security](https://docs.spring.io/spring-boot/reference/web/spring-security.html)
- [Spring Web](https://docs.spring.io/spring-boot/reference/web/index.html)
- [OAuth2 Resource Server](https://docs.spring.io/spring-boot/reference/web/spring-security.html#web.security.oauth2.server)
- [Spring Data JPA](https://docs.spring.io/spring-boot/reference/data/sql.html#data.sql.jpa-and-spring-data)
- [Validation](https://docs.spring.io/spring-boot/reference/io/validation.html)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/enabling.html)
- [Testcontainers](https://java.testcontainers.org/)

## Guides

The following guides illustrate how to use some features concretely:

- [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
- [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)
- [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
- [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
- [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
- [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
- [Validation](https://spring.io/guides/gs/validating-form-input/)
- [Building a RESTful Web Service with Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/)
