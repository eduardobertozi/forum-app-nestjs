import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'
import { EncrypterGateway } from '@/domain/authentication/application/cryptography/encrypter'
import {
  HashComparerGateway,
  HashGeneratorGateway,
} from '@/domain/authentication/application/cryptography/hasher'

@Module({
  providers: [
    {
      provide: EncrypterGateway,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparerGateway,
      useClass: BcryptHasher,
    },
    {
      provide: HashGeneratorGateway,
      useClass: BcryptHasher,
    },
  ],
  exports: [EncrypterGateway, HashComparerGateway, HashGeneratorGateway],
})
export class CryptographyModule {}
