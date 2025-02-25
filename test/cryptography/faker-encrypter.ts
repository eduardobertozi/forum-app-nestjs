import { EncrypterGateway } from '@/domain/authentication/application/cryptography/encrypter'

export class FakeEncrypter implements EncrypterGateway {
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve(JSON.stringify(payload))
  }
}
