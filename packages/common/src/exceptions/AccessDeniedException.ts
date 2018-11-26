export class AccessDeniedException extends Error {
  public readonly message: any

  constructor() {
    super()

    this.message = 'AccessDenied'
  }
}
