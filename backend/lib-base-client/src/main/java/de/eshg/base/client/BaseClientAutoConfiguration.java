/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.client;

import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.PersonWithoutDateOfBirthApi;
import de.eshg.base.citizenuser.CitizenAccessCodeUserApi;
import de.eshg.base.config.PublicConfigApi;
import de.eshg.base.contact.ContactApi;
import de.eshg.base.department.PublicDepartmentApi;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.base.gdpr.GdprProcedureApi;
import de.eshg.base.icd10.Icd10CodeApi;
import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.mail.MailApi;
import de.eshg.base.resource.ResourceApi;
import de.eshg.base.statistics.BaseStatisticsApi;
import de.eshg.base.testhelper.BaseTestHelperApi;
import de.eshg.base.user.UserApi;
import de.eshg.rest.client.AcceptLanguageForwardingInterceptor;
import de.eshg.rest.client.BearerAuthInterceptor;
import de.eshg.rest.client.CorrelationIdForwardingInterceptor;
import de.eshg.rest.client.SimpleModelAttributeArgumentResolver;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import de.eshg.testhelper.TestHelperAutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.convert.ConversionService;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClient.Builder;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@AutoConfiguration(before = TestHelperAutoConfiguration.class)
@EnableConfigurationProperties(BaseClientProperties.class)
@PropertySource("classpath:/base-client-default.properties")
class BaseClientAutoConfiguration {

  private final RestClient.Builder restClientBuilder;
  private final BaseClientProperties baseClientProperties;
  private final ConversionService conversionService;

  BaseClientAutoConfiguration(
      Builder restClientBuilder,
      BaseClientProperties baseClientProperties,
      ConversionService conversionService) {
    this.restClientBuilder = restClientBuilder;
    this.baseClientProperties = baseClientProperties;
    this.conversionService = conversionService;
  }

  @Bean
  MailApi mailApiClient() {
    return createClient(MailApi.class);
  }

  @Bean
  CalendarApi calendarApiClient() {
    return createClient(CalendarApi.class);
  }

  @Bean
  CalendarEventApi calendarEventApiClient() {
    return createClient(CalendarEventApi.class);
  }

  @Bean
  PersonApi personApiClient() {
    return createClient(PersonApi.class);
  }

  @Bean
  PersonWithoutDateOfBirthApi personWithoutDateOfBirthApi() {
    return createClient(PersonWithoutDateOfBirthApi.class);
  }

  @Bean
  FacilityApi facilityApiClient() {
    return createClient(FacilityApi.class);
  }

  @Bean
  InventoryApi inventoryApiClient() {
    return createClient(InventoryApi.class);
  }

  @Bean
  ResourceApi resourceApiClient() {
    return createClient(ResourceApi.class);
  }

  @Bean
  UserApi userApiClient() {
    return createClient(UserApi.class);
  }

  @Bean
  BaseFeatureTogglesApi baseFeatureTogglesApi() {
    return createClient(BaseFeatureTogglesApi.class);
  }

  @Bean
  @ConditionalOnTestHelperEnabled
  BaseTestHelperApi baseTestHelperApiClient() {
    return createClient(BaseTestHelperApi.class);
  }

  @Bean
  BaseStatisticsApi statisticsApiClient() {
    return createClient(BaseStatisticsApi.class);
  }

  @Bean
  ContactApi contactApiClient() {
    return createClient(ContactApi.class);
  }

  @Bean
  CitizenAccessCodeUserApi citizenAccessCodeUserApiClient() {
    return createClient(CitizenAccessCodeUserApi.class);
  }

  @Bean
  PublicDepartmentApi departmentApiClient() {
    return createClient(PublicDepartmentApi.class);
  }

  @Bean
  GdprProcedureApi gdprApiClient() {
    return createClient(GdprProcedureApi.class);
  }

  @Bean
  PublicConfigApi publicConfigApi() {
    return createClient(PublicConfigApi.class);
  }

  @Bean
  Icd10CodeApi icd10CodeApiClient() {
    return createClient(Icd10CodeApi.class);
  }

  private <T> T createClient(Class<T> serviceClass) {
    RestClient restClient =
        restClientBuilder
            .baseUrl(baseClientProperties.getServiceUrl())
            .requestInterceptor(new BearerAuthInterceptor())
            .requestInterceptor(new CorrelationIdForwardingInterceptor())
            .requestInterceptor(new AcceptLanguageForwardingInterceptor())
            .build();
    RestClientAdapter restClientAdapter = RestClientAdapter.create(restClient);

    HttpServiceProxyFactory httpServiceProxyFactory =
        HttpServiceProxyFactory.builderFor(restClientAdapter)
            .conversionService(conversionService)
            .customArgumentResolver(new SimpleModelAttributeArgumentResolver(conversionService))
            .build();

    return httpServiceProxyFactory.createClient(serviceClass);
  }
}
