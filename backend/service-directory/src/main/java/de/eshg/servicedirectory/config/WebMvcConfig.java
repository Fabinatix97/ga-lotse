/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.config;

import de.eshg.libservicedirectoryadminapi.ServiceDirectoryAdminApi;
import de.eshg.servicedirectory.common.AdminNameHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  public static final String X_ESHG_ADMIN_NAME = "x-eshg-admin-name";

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new ClearUsernameInterceptor());
    registry
        .addInterceptor(new AdminNameResponseHeaderInterceptor())
        .addPathPatterns(ServiceDirectoryAdminApi.API_PREFIX + "/**");
  }

  private static class AdminNameResponseHeaderInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
        HttpServletRequest request, HttpServletResponse response, Object handler) {
      response.setHeader(X_ESHG_ADMIN_NAME, AdminNameHolder.getAdminName());
      return true;
    }
  }

  private static class ClearUsernameInterceptor implements HandlerInterceptor {

    @Override
    public void afterCompletion(
        HttpServletRequest request,
        HttpServletResponse response,
        Object handler,
        Exception exception) {
      AdminNameHolder.clearAdminName();
    }
  }
}
