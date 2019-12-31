export * from './DomainService';
export * from './LivebosServerService';
export * from './PortletDataSourceService';
export * from './UserService';
export * from './LoginService';
export * from './MenuService';
export * from './ParamService';
export * from './DeptService';
export * from './RoleService';
export * from './DictService';
export * from './rest';

//排序支持传字段名列表，或者字段名+顺序类型
export type CriteriaOrder = string | [string, 'asc' | 'desc'];

export interface Criteria {
  and?: Criteria;
  or?: Criteria;
  eq?: [string, any][];
  like?: [string, any][];
  ilike?: [string, any][];
  ge?: [string, any][];
  gt?: [string, any][];
  le?: [string, any][];
  lt?: [string, any][];
  between?: [string, any, any][];
  eqProperty?: [string, string][];
  in?: [string, any[]][];
  notIn?: [string, any[]][];
  isEmpty?: [string][];
  isNotEmpty?: [string][];
  isNull?: [string][];
  isNotNull?: [string][];
  max?: number;
  maxResults?: number;
  offset?: number;
  firstResult?: number;
  order?: CriteriaOrder[];

  [key: string]: number | any[] | Criteria | undefined; //嵌套查询
}

/**
 * ListOptions.orders会做嵌套处理，但目前嵌套属性排序不成功，可能是DetachedCriteria的原因，原先在Flex中是成功的
 * ListOptions.criteria.order不做处理，传入原始值
 */
export interface ListOptions {
  criteria?: Criteria;
  //如果传入，覆盖store的pageInfo
  pageInfo?: PageInfo;
  orders?: CriteriaOrder[];
  isAppend?: boolean;
}

export interface ListResult {
  results: Entity[];
  totalCount: number;
}

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalCount?: number;
  isLastPage?: boolean;
}

export const DEFAULT_PAGE_INFO = { currentPage: 1, totalCount: -1, isLastPage: false, pageSize: 10 };

export interface FieldError {
  field?: string;
  message?: string;
}

export interface Entity {
  id?: string;
  lastUpdated?: Date;
  dateCreated?: Date;
  version?: number;
  errors?: FieldError[];

  [key: string]: any;
}
