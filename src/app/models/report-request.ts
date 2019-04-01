import { DateRange, Metric, Dimension, DimensionFilterClause } from './index';

export interface ReportRequest {
    viewId: string;
    dateRanges: DateRange[];
    metrics: Metric[];
    dimensions?: Dimension[];
    dimensionFilterClauses?: DimensionFilterClause[];
}
