/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export type Nullable<T> = T | undefined | null;

/**
 * Represents a type that adds required properties to an existing type.
 *
 * Example:
 * ```
 * type User = {id: number, name?: string, age?: number}
 * type UserWithName = WithRequired<User, 'name' | 'age'>
 * const user: UserWithName = { id: 1, age: 20 } // error: missing property user
 * ```
 *
 * @template T The base type to extend.
 * @template K The keys of the base type to make required.
 * @see https://stackoverflow.com/a/69328045/1601438
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make a property optional in a type.
 *
 * Example:
 * ```
 * type User = {id: number, name: string, age: number}
 * type Username = Optional<User, 'id' | 'age'>
 * ```
 * @template T The base type to extend.
 * @template K The keys of the base type to make optional.
 * @see https://stackoverflow.com/a/54178819/1601438
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
