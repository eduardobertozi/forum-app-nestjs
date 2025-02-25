export abstract class HashGeneratorGateway {
  abstract hash(plain: string): Promise<string>
}

export abstract class HashComparerGateway {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
