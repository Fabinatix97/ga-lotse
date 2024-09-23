/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

type RouteDefinition =
  | string
  | DynamicRoute
  | { [route: string]: RouteDefinition };
type DynamicRoute = (...args: never[]) => RouteDefinition;

export function defineRoutes<TRoutes extends RouteDefinition>(
  basePath: string,
  route: (routeFactory: (route: string) => string) => TRoutes,
) {
  function routeFactory(route: string) {
    return route === "/" ? basePath : `${basePath}${route}`;
  }

  return route(routeFactory);
}
