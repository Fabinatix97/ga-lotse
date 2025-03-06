/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import de.eshg.lib.common.BusinessModule;
import de.eshg.rest.service.security.config.TravelMedicinePublicSecurityConfig;
import de.eshg.travelmedicine.document.informationstatement.InformationStatementProperties;
import de.eshg.travelmedicine.featuretoggle.TravelMedicineFeatureToggle;
import de.eshg.travelmedicine.notification.NotificationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(TravelMedicinePublicSecurityConfig.class)
@EnableConfigurationProperties({
  TravelMedicineFeatureToggle.class,
  NotificationProperties.class,
  InformationStatementProperties.class
})
public class TravelMedicineApplication {

  @Bean
  BusinessModule businessModule() {
    return BusinessModule.TRAVEL_MEDICINE;
  }

  public static void main(String[] args) {
    SpringApplication.run(TravelMedicineApplication.class, args);
  }
}
