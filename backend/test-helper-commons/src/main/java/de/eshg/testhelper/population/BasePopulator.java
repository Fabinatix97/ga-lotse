/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.population;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.testhelper.environment.EnvironmentConfig;
import de.eshg.testhelper.security.AuthenticationFaker;
import jakarta.annotation.PostConstruct;
import java.time.Clock;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import net.datafaker.Faker;
import net.datafaker.providers.base.Address;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public abstract class BasePopulator<R> {

  public static final UUID POPULATOR_USER_ID =
      UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

  protected final Logger log = LoggerFactory.getLogger(getClass());

  private final PopulationProperties properties;
  protected final Clock clock;
  private final int defaultNumberOfEntitiesToPopulate;
  private final EnvironmentConfig environmentConfig;

  protected BasePopulator(
      PopulationProperties properties,
      Clock clock,
      String entityNameInPropertyKey,
      EnvironmentConfig environmentConfig) {
    environmentConfig.assertIsNotProduction();
    log.warn("Creating {}", getClass().getSimpleName());
    this.properties = properties;
    this.clock = clock;
    this.defaultNumberOfEntitiesToPopulate =
        properties.getDefaultNumberOfEntitiesToPopulate(entityNameInPropertyKey);
    this.environmentConfig = environmentConfig;
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
    environmentConfig.assertIsNotProduction();
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

  protected static <E> Function<Faker, E> randomElement(E[] elements) {
    return faker -> randomElement(faker, elements);
  }

  public static <E> E randomElement(Faker faker, E[] elements) {
    return randomElement(faker, Arrays.asList(elements));
  }

  protected static <E> Function<Faker, E> randomElement(List<E> elements) {
    return faker -> randomElement(faker, elements);
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

  protected static Function<Faker, List<String>> randomListOfPhoneNumbers(int maxSize) {
    return faker -> randomListOfPhoneNumbers(faker, maxSize);
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

  protected static Function<Faker, List<String>> randomListOfEmails(int maxSize) {
    return faker -> randomListOfEmails(faker, maxSize);
  }

  protected static List<String> randomListOfEmails(Faker faker, int maxSize) {
    return randomListOfEmails(faker, 0, maxSize);
  }

  protected static List<String> randomListOfEmails(Faker faker, int minSize, int maxSize) {
    return IntStream.range(0, faker.random().nextInt(minSize, maxSize))
        .mapToObj(index -> faker.internet().safeEmailAddress())
        .toList();
  }

  protected static DomesticAddressDto randomAddress(Faker faker) {
    Address address = faker.address();
    return new DomesticAddressDto(
        randomCountry(faker),
        address.city(),
        address.postcode(),
        null,
        address.streetAddress(),
        optional(faker, address.streetAddressNumber(), 0.1),
        optional(faker, address.secondaryAddress(), 0.1));
  }

  public static <E> E optional(Faker faker, E value) {
    return optional(faker, value, 0.1);
  }

  protected static <E> E optional(Faker faker, Function<Faker, E> valueProvider) {
    return optional(faker, valueProvider, 0.1);
  }

  protected static <E> E optional(Faker faker, E value, double probabilityToBeNull) {
    return optional(faker, ignored -> value, probabilityToBeNull);
  }

  protected static <E> E optional(
      Faker faker, Function<Faker, E> valueProvider, double probabilityToBeNull) {
    return faker.random().nextDouble() < probabilityToBeNull ? null : valueProvider.apply(faker);
  }

  protected static <E> List<E> optionalList(Faker faker, List<E> list, double probabilityToBeNull) {
    return optionalList(faker, ignored -> list, probabilityToBeNull);
  }

  protected static <E> List<E> optionalList(
      Faker faker, Function<Faker, List<E>> valueProvider, double probabilityToBeNull) {
    return faker.random().nextDouble() < probabilityToBeNull
        ? List.of()
        : valueProvider.apply(faker);
  }

  protected static Function<Faker, CountryCode> randomCountry() {
    return BasePopulator::randomCountry;
  }

  protected static CountryCode randomCountry(Faker faker) {
    return randomElement(faker, CountryCode.values());
  }

  protected abstract long countExistingEntities();

  @PostConstruct
  void automaticPopulationOnStartup() {
    environmentConfig.assertIsNotProduction();

    if (!isPopulationEnabled()) {
      log.debug("{}: Automatic population is disabled", getName());
      return;
    }

    int numberOfEntitiesToPopulate = getDefaultNumberOfEntitiesToPopulate();
    if (numberOfEntitiesToPopulate == 0) {
      log.debug("{}: Automatic population is disabled: Got zero entities to populate", getName());
      return;
    }

    if (countExistingEntities() == 0) {
      populate(numberOfEntitiesToPopulate);
    } else {
      log.info("{}: Not populating since some entities already exist", getName());
    }
  }

  public boolean isPopulationEnabled() {
    return properties.enabled();
  }

  public int getDefaultNumberOfEntitiesToPopulate() {
    return defaultNumberOfEntitiesToPopulate;
  }

  private String getName() {
    return getClass().getSimpleName();
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
