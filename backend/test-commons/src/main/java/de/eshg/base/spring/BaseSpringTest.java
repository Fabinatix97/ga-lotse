/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring;

import static de.eshg.testhelper.ConditionalOnLocalEnvironment.LOCAL_PROFILE_NAME;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.assertions.validationfile.normalization.ValidationNormalizer;
import de.cronn.assertions.validationfile.replacements.Replacer;
import de.eshg.base.BaseTest;
import de.eshg.base.query_validation.QueryAndParamsCapturingListener;
import de.eshg.base.query_validation.QueryValidationTraits;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@Import({ApplicationContextCreationWatcher.class, QueryAndParamsCapturingListener.class})
@ActiveProfiles({"test-commons", LOCAL_PROFILE_NAME})
public abstract class BaseSpringTest extends BaseTest
    implements AuthenticationTraits,
        QueryValidationTraits,
        ResponseEntityValidationFileAssertionTraits {

  @Autowired protected ObjectMapper objectMapper;
  @Autowired private QueryAndParamsCapturingListener queryAndParamsCapturingListener;

  @LocalServerPort private int localServerPort;

  @Override
  public ObjectMapper objectMapper() {
    return objectMapper;
  }

  @Override
  public QueryAndParamsCapturingListener getQueryListener() {
    return queryAndParamsCapturingListener;
  }

  @Override
  public ValidationNormalizer defaultValidationNormalizer() {
    return createLocalServerPortNormalizer()
        .and(ResponseEntityValidationFileAssertionTraits.super.defaultValidationNormalizer());
  }

  @BeforeEach
  protected void reset(TestInfo testInfo) throws Exception {
    if (!skipReset(testInfo)) {
      reset();
    }
  }

  protected void reset() throws Exception {}

  private static boolean skipReset(TestInfo testInfo) {
    Class<?> testClass = testInfo.getTestClass().orElseThrow();
    return testClass.isAnnotationPresent(SkipResetsBeforeEachTest.class);
  }

  private ValidationNormalizer createLocalServerPortNormalizer() {
    return new Replacer("localhost:" + localServerPort, "localhost:[RANDOM_SERVER_PORT]");
  }
}
