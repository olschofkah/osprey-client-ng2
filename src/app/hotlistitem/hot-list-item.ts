

export class HotListItem {

  summaryDetail: any;

  constructor(
    public key: { symbol: string, cusip: string },
    public models: { modelName: string, recentOccurrence: number }[],
    public strategies: string[],
    public groupedScreen: string,
    public selected: boolean,
    public deleted: boolean,
    public reportDate: Date) {

  }


}
