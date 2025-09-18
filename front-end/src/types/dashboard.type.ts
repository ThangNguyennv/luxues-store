interface StatisticGroup {
  total: number,
}
type StatisticKey = 'user' | 'product' | 'order' | 'revenue';
type Statistic = Record<StatisticKey, StatisticGroup>;

export interface DashboardInterface {
  statistic: Statistic,
  labels: string[],
  data: number[]
}