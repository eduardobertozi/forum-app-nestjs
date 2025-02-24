export abstract class EncrypterGateway {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
