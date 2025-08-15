import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function composeProviders(...providers: React.ComponentType<any>[]) {
  return ({ children }: { children: React.ReactNode }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    )
}