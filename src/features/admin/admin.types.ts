export interface MonthlyActivity {
  /** Calendar month as YYYY-MM. */
  month: string;
  quotations: number;
  maintenance: number;
}

/** Baseline illustrative series; clearly labelled "sample" in the UI. */
export interface DashboardBaseline {
  activity: MonthlyActivity[];
}

export interface DashboardStats {
  equipmentTotal: number;
  equipmentByStatus: Record<string, number>;
  quotationsTotal: number;
  quotationsOpen: number;
  maintenanceTotal: number;
  maintenanceOpen: number;
  articlesPublished: number;
  articlesDraft: number;
  submittedThisSession: number;
  activity: MonthlyActivity[];
  recent: { kind: 'Quotation' | 'Maintenance'; id: string; reference: string; who: string; createdAt: string; status: string }[];
}
