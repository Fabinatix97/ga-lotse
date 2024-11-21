/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental;

import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(DentalController.BASE_URL)
@Tag(name = "Dental")
public class DentalController {

  public static final String BASE_URL = BaseUrls.Dental.DENTAL_CONTROLLER;
}
