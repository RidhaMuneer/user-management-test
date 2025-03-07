export type Column = {
  key: string;
  title: string;
  dataIndex: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  onHeaderCell?: () => React.HTMLAttributes<HTMLTableCellElement>;
};

export type TableProps = {
  columns: Column[];
  data: any[];
  rowKey?: string;
  emptyText?: string;
  scroll?: { x?: string };
  number_of_pages?: number;
  page?: number;
  onChangePage?: (event: React.ChangeEvent<unknown>, page: number) => void;
};