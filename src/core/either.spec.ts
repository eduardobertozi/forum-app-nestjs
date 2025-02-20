import { Either, left, right } from '@/core/either'
import { expect } from 'vitest'

function doSomethingSuccess(): Either<string, number> {
  return right(10)
}

function doSomethingError(): Either<string, number> {
  return left('error')
}

test('success result', () => {
  const result = doSomethingSuccess()

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomethingError()

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
