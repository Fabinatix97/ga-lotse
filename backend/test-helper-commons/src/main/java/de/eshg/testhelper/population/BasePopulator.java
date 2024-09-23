/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.population;

import de.eshg.testhelper.security.AuthenticationFaker;
import jakarta.annotation.PostConstruct;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import net.datafaker.Faker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public abstract class BasePopulator<R> {

  public static final UUID POPULATOR_USER_ID =
      UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

  protected final Logger log = LoggerFactory.getLogger(getClass());
  private final Environment environment;
  protected final Clock clock;
  private final String entityNameInPropertyKey;

  protected BasePopulator(Clock clock, Environment environment, String entityNameInPropertyKey) {
    log.warn("Creating {}", getClass().getSimpleName());
    this.clock = clock;
    this.environment = environment;
    this.entityNameInPropertyKey = entityNameInPropertyKey;
  }

  protected static Supplier<Random> newRandomSupplier() {
    Random baseRandom = new Random(4711);
    return () -> deriveNewRandom(baseRandom);
  }

  private static Random deriveNewRandom(Random baseRandom) {
    return new Random(baseRandom.nextLong());
  }

  protected abstract R populate(int index, Faker faker, UniqueValueProvider uniqueValueProvider);

  public ListWithTotalNumber<R> populate(int numberOfEntitiesToPopulate) {
    return AuthenticationFaker.withFakedAuthenticationIfMissing(
        POPULATOR_USER_ID, () -> populateWithAuthentication(numberOfEntitiesToPopulate));
  }

  public ListWithTotalNumber<R> populateWithAuthentication(int numberOfEntitiesToPopulate) {
    Supplier<Random> randomSupplier = newRandomSupplier();
    UniqueValueProvider uniqueValueProvider = new UniqueValueProvider();

    List<R> entities =
        IntStream.range(0, numberOfEntitiesToPopulate)
            .mapToObj(
                index -> {
                  Random random = randomSupplier.get();
                  Faker faker = new Faker(Locale.GERMANY, random);
                  return populate(index, faker, uniqueValueProvider);
                })
            .toList();

    log.info("Populated {} entities", entities.size());

    long totalNumberOfElements = countExistingEntities();

    return new ListWithTotalNumber<>(entities, totalNumberOfElements);
  }

  protected static <E> E randomElement(Faker faker, E[] elements) {
    return randomElement(faker, Arrays.asList(elements));
  }

  protected static <E> E randomElement(Faker faker, List<E> elements) {
    if (elements.isEmpty()) {
      return null;
    }
    int randomIndex = faker.number().numberBetween(0, elements.size());
    return elements.get(randomIndex);
  }

  protected static <E> List<E> randomElements(Faker faker, List<E> elements) {
    return elements.stream().filter(e -> faker.bool().bool()).toList();
  }

  protected static List<String> randomListOfPhoneNumbers(Faker faker, int maxSize) {
    return randomListOfPhoneNumbers(faker, 0, maxSize);
  }

  protected static List<String> randomListOfPhoneNumbers(Faker faker, int minSize, int maxSize) {
    return IntStream.range(0, faker.random().nextInt(minSize, maxSize))
        .mapToObj(index -> randomPhoneNumber(faker))
        .toList();
  }

  // official "drama numbers" for media usage
  private static String randomPhoneNumber(Faker faker) {
    List<String> numbers =
        List.of("030 23125###", "069 90009###", "040 66969###", "0221 4710###", "089 99998###");
    return faker.numerify(randomElement(faker, numbers));
  }

  protected static List<String> randomListOfEmails(Faker faker, int maxSize) {
    return randomListOfEmails(faker, 0, maxSize);
  }

  protected static List<String> randomListOfEmails(Faker faker, int minSize, int maxSize) {
    return IntStream.range(0, faker.random().nextInt(minSize, maxSize))
        .mapToObj(index -> faker.internet().safeEmailAddress())
        .toList();
  }

  protected static <E> E optional(Faker faker, E value) {
    return optional(faker, value, 0.1);
  }

  protected static <E> E optional(Faker faker, E value, double probabilityToBeNull) {
    return faker.random().nextDouble() < probabilityToBeNull ? null : value;
  }

  protected abstract long countExistingEntities();

  @PostConstruct
  void automaticPopulationOnStartup() {
    int numberOfEntitiesToPopulate = getDefaultNumberOfEntitiesToPopulate();

    if (numberOfEntitiesToPopulate == 0) {
      log.debug("{}: Automatic population is disabled", getName());
      return;
    }

    if (countExistingEntities() == 0) {
      populate(numberOfEntitiesToPopulate);
    } else {
      log.info("{}: Not populating since some entities already exist", getName());
    }
  }

  public Integer getDefaultNumberOfEntitiesToPopulate() {
    return environment.getProperty("eshg.population." + entityNameInPropertyKey, Integer.class, 0);
  }

  private String getName() {
    return getClass().getSimpleName();
  }

  protected LocalDate randomDate(Faker faker, int minYears, int maxYears) {
    return LocalDate.now(clock)
        .minusYears(faker.number().numberBetween(minYears, maxYears))
        .minusDays(faker.number().numberBetween(1, 364));
  }

  protected class UniqueValueProvider {

    public UniqueValueProvider() {}

    private static final int MAX_FIND_UNIQUE_VALUE_TRIES = 10;

    private final MultiValueMap<String, Object> uniqueValues = new LinkedMultiValueMap<>();

    public <T> T getUniqueFakerValue(Supplier<T> fakeValueSupplier, String attributeName) {
      List<Object> existingValues = uniqueValues.getOrDefault(attributeName, new ArrayList<>());
      for (int i = 1; i <= MAX_FIND_UNIQUE_VALUE_TRIES; i++) {
        T newValue = fakeValueSupplier.get();
        if (!existingValues.contains(newValue)) {
          uniqueValues.add(attributeName, newValue);
          return newValue;
        }
        logFailedTry(attributeName, newValue, i);
      }
      throw new IllegalStateException(
          String.format(
              "Did not find a unique fake value to add. Giving up after %s tries",
              MAX_FIND_UNIQUE_VALUE_TRIES));
    }

    private <T> void logFailedTry(String attributeName, T alreadyExistingValue, int tryNumber) {
      log.info(
          "Adding a unique {} failed in try number {}. Value '{}' already existed",
          attributeName,
          tryNumber,
          alreadyExistingValue);
    }
  }
}
