export interface QueryObject{
    userId?: number;

    //sorting
    sortBy? : string;
    isSortAscending?: boolean;

    //pagination
    pageSize: number;        
    page: number;
}

export const defaultQueryObject: QueryObject 
 = {
    page: 0,
    pageSize: 10
  }