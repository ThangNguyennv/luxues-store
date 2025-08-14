interface StatisticGroup {
  total: number,
  active: number,
  inactive: number,
}
type StatisticKey = 'categoryProduct' | 'product' | 'account' | 'user';
type Statistic = Record<StatisticKey, StatisticGroup>;

export interface DashboardInterface {
  statistic: Statistic
}