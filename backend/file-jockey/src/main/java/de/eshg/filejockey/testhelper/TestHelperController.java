/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.testhelper;

import de.eshg.filejockey.FileIoTestHelperApi;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "TestHelper")
@ConditionalOnTestHelperEnabled
public class TestHelperController implements FileIoTestHelperApi {

  private final TestHelperService testHelperService;

  public TestHelperController(TestHelperService testHelperService) {
    this.testHelperService = testHelperService;
  }

  @Override
  public ResponseEntity<Void> createBasicDeviceOutputFile(
      String equipmentSelector, String correlationId) {
    testHelperService.createSampleOutputFile(equipmentSelector, correlationId);

    return ResponseEntity.ok().build();
  }
}
