import {
  HashComparerGateway,
  HashGeneratorGateway,
} from '@/domain/authentication/application/cryptography/hasher'
import { hash, compare } from 'bcryptjs'

export class BcryptHasher implements HashGeneratorGateway, HashComparerGateway {
  private readonly HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
