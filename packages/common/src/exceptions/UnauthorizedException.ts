export class UnauthorizedException extends Error {
  public readonly message: any

  constructor() {
    super()

    this.message = 'Unauthorized'
  }
}
