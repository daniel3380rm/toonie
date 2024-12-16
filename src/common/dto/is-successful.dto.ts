export class IsSuccessfulDto {
  constructor(
    public successful: boolean,
    //TODO: add type generic
    public data: any = {},
    public message: string = '',
  ) {}
}
