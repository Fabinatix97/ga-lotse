/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.population;

import de.cronn.reflection.util.ClassUtils;
import de.cronn.reflection.util.PropertyUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.concurrent.Callable;
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.dynamic.scaffold.subclass.ConstructorStrategy;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.bind.annotation.AllArguments;
import net.bytebuddy.implementation.bind.annotation.FieldValue;
import net.bytebuddy.implementation.bind.annotation.Origin;
import net.bytebuddy.implementation.bind.annotation.RuntimeType;
import net.bytebuddy.matcher.ElementMatchers;
import org.springframework.objenesis.ObjenesisHelper;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletWebRequest;

public final class RequestContextFaker {

  private RequestContextFaker() {}

  public static <T> T withFakedRequestContextIfNecessary(Callable<T> callable) {
    try {
      RequestAttributes currentRequestAttributes = RequestContextHolder.getRequestAttributes();
      if (currentRequestAttributes != null) {
        return callable.call();
      }
      try {
        HttpServletRequest request = fakeHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletWebRequest(request));

        return callable.call();
      } finally {
        RequestContextHolder.setRequestAttributes(currentRequestAttributes);
      }
    } catch (RuntimeException e) {
      throw e;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public static <T> T withFakedRequestContextsIfNecessary(T controller) {
    Class<T> controllerClass = ClassUtils.getRealClass(controller);
    try (DynamicType.Unloaded<T> typing =
        new ByteBuddy()
            .subclass(controllerClass, ConstructorStrategy.Default.NO_CONSTRUCTORS)
            .defineField(
                FakedRequestContextInterceptor.DELEGATE, controllerClass, Visibility.PRIVATE)
            .method(
                ElementMatchers.isPublic()
                    // exclude hashCode(), equals(), toString() etc.
                    .and(ElementMatchers.not(ElementMatchers.isDeclaredBy(Object.class))))
            .intercept(MethodDelegation.to(FakedRequestContextInterceptor.class))
            .make()) {
      Class<? extends T> interceptedControllerClass =
          typing.load(controller.getClass().getClassLoader()).getLoaded();
      T interceptedController = ObjenesisHelper.newInstance(interceptedControllerClass);
      PropertyUtils.writeDirectly(
          interceptedController, FakedRequestContextInterceptor.DELEGATE, controller);
      return interceptedController;
    }
  }

  public static class FakedRequestContextInterceptor {
    public static final String DELEGATE = "$delegate";

    @RuntimeType
    public static Object intercept(
        @Origin Method method, @FieldValue(DELEGATE) Object delegate, @AllArguments Object[] args)
        throws Exception {
      return withFakedRequestContextIfNecessary(() -> method.invoke(delegate, args));
    }
  }

  private static HttpServletRequest fakeHttpServletRequest() {
    Class<?>[] interfaces = {HttpServletRequest.class};
    return (HttpServletRequest)
        Proxy.newProxyInstance(
            BasePopulator.class.getClassLoader(), interfaces, (proxy, method, args) -> null);
  }
}
