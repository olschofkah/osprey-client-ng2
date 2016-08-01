

export class HotListItem {

  summaryDetail: any;

  constructor(
    public key: { symbol: string, cusip: string },
    public namedScreenSets: string[],
    public strategies: string[],
    public groupedScreen: string,
    public selected: boolean,
    public deleted: boolean) {

  }


}
