/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base;

import static de.eshg.base.spring.ConfigurationPropertiesBindExceptionUtil.getSortedMessage;

import de.cronn.assertions.validationfile.FileExtension;
import de.cronn.testutils.ExecutorServiceUtils;
import de.eshg.base.logging.CapturedLoggingTraits;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import org.assertj.core.api.Assertions;
import org.assertj.core.api.SoftAssertions;
import org.assertj.core.api.junit.jupiter.InjectSoftAssertions;
import org.assertj.core.api.junit.jupiter.SoftAssertionsExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.boot.context.properties.bind.validation.BindValidationException;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;

@ExtendWith({SoftAssertionsExtension.class})
public abstract class BaseTest implements CapturedLoggingTraits {
  private static final Duration DEFAULT_TEST_TIMEOUT = Duration.ofSeconds(30);
  private static final Path DATA_TEST_TMP = Path.of("data/test/tmp");

  @InjectSoftAssertions protected SoftAssertions softly;

  @RegisterExtension
  private final ValidationFilenameExtension validationFilenameExtension =
      new ValidationFilenameExtension();

  @Override
  public FailedAssertionHandler failedAssertionHandler() {
    return callable -> softly.check(callable::call);
  }

  @Override
  public String getTestName() {
    return validationFilenameExtension.getTestName();
  }

  @Override
  public String getValidationFileName(String baseName, FileExtension extension) {
    String validationFileName =
        CapturedLoggingTraits.super.getValidationFileName(baseName, extension);
    return normalizeValidationFilename(validationFileName);
  }

  private static String normalizeValidationFilename(String validationFileName) {
    if (validationFileName == null) {
      return null;
    }
    return validationFileName.replaceAll("\\s", "_");
  }

  protected void runConcurrently(
      int numberOfThreads, CompletionServiceConsumer completionServiceConsumer) throws Exception {
    ExecutorService executorService =
        Executors.newFixedThreadPool(numberOfThreads, new CustomizableThreadFactory(getTestName()));
    try {
      CompletionService<Void> completionService = new ExecutorCompletionService<>(executorService);
      CompletionServiceForTests trackingCompletionService =
          new CompletionServiceForTests(completionService, BaseTest.DEFAULT_TEST_TIMEOUT);
      completionServiceConsumer.run(trackingCompletionService);
    } finally {
      ExecutorServiceUtils.shutdownOrThrow(
          executorService, getTestName(), BaseTest.DEFAULT_TEST_TIMEOUT.toMillis());
    }
  }

  protected interface CompletionServiceConsumer {
    void run(CompletionServiceForTests completionService) throws Exception;
  }

  protected void assertLoadingOfConfigurationPropertiesWithFile(
      Class<?> configurationClass, MockEnvironment env) {
    assertLoadingOfConfigurationPropertiesWithFileWithSuffix(configurationClass, env, null);
  }

  protected void assertLoadingOfConfigurationPropertiesWithFileWithSuffix(
      Class<?> configurationClass, MockEnvironment env, String suffix) {
    doWithNewApplicationContext(
        context ->
            assertLoadingOfConfigurationPropertiesWithFileSuffix(
                configurationClass, suffix, context),
        configurationClass,
        env);
  }

  private void assertLoadingOfConfigurationPropertiesWithFileSuffix(
      Class<?> configurationClass, String suffix, AnnotationConfigApplicationContext context) {
    try {
      context.refresh();
      assertWithFile("Loading %s succeeded.".formatted(configurationClass));
    } catch (BeanCreationException e) {
      assertConfigurationPropertiesBindExceptionWithFileWithSuffix(e, suffix);
    }
  }

  protected void doWithNewApplicationContext(
      Consumer<AnnotationConfigApplicationContext> action,
      Class<?> configurationClass,
      MockEnvironment env) {
    try (AnnotationConfigApplicationContext context = newContext(env)) {
      context.registerBean(configurationClass);
      action.accept(context);
    }
  }

  private void assertConfigurationPropertiesBindExceptionWithFileWithSuffix(
      BeanCreationException configurationException, String suffix) {
    Throwable rootCause = configurationException.getMostSpecificCause();
    switch (rootCause) {
      case IllegalArgumentException illegalArgumentException ->
          assertWithFileWithSuffix(illegalArgumentException.getMessage(), suffix);
      case BindValidationException bindValidationException ->
          assertWithFileWithSuffix(getSortedMessage(bindValidationException), suffix);
      default ->
          Assertions.fail(
              "Unmapped exception occurred: %s".formatted(rootCause.getClass()), rootCause);
    }
  }

  private static AnnotationConfigApplicationContext newContext(MockEnvironment env) {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
    context.setEnvironment(env);
    return context;
  }

  public Path getTempFile(String suffix) {
    Path tempFile = DATA_TEST_TMP.resolve(getTestName() + suffix);
    try {
      Files.createDirectories(tempFile.getParent());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
    return tempFile;
  }

  protected Path writeToTempFile(Resource resource) throws IOException {
    return writeToTempFile(resource, "_");
  }

  protected Path writeToTempFile(Resource resource, String prefix) throws IOException {
    Path tempFile = getTempFile(prefix + resource.getFilename());
    Files.write(tempFile, resource.getContentAsByteArray());
    return tempFile;
  }
}
