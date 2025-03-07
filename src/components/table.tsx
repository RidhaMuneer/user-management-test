"use client"

import type { TableProps } from "@/types/table.types"

const Table: React.FC<TableProps> = ({
  columns,
  data,
  rowKey = "id",
  emptyText,
  scroll,
  number_of_pages,
  page = 1,
  onChangePage
}) => {
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((o, key) => (o && o[key] !== "undefined" ? o[key] : undefined), obj)
  }

  const handlePageChange = (newPage: number) => {
    if (onChangePage) {
      onChangePage({} as React.ChangeEvent<unknown>, newPage)
    }
  }

  const generatePaginationItems = () => {
    if (!number_of_pages || number_of_pages <= 1) return []

    const items = []
    const maxVisibleItems = 7 
    const edgeItems = 1

    items.push(1)

    if (number_of_pages <= maxVisibleItems) {
      for (let i = 2; i <= number_of_pages; i++) {
        items.push(i)
      }
    } else {
      const leftSide = Math.floor(maxVisibleItems / 2)
      const rightSide = maxVisibleItems - leftSide - 1

      if (page > leftSide + edgeItems) {
        items.push(-1)
      }

      let startPage = Math.max(edgeItems + 1, page - leftSide)
      let endPage = Math.min(number_of_pages - edgeItems, page + rightSide)

      if (page <= leftSide + edgeItems) {
        endPage = maxVisibleItems - 1 - (edgeItems > 0 ? 1 : 0)
      } else if (page >= number_of_pages - rightSide - edgeItems) {
        startPage = number_of_pages - maxVisibleItems + 2
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(i)
      }

      if (page < number_of_pages - rightSide - edgeItems) {
        items.push(-2)
      }

      if (endPage < number_of_pages) {
        items.push(number_of_pages)
      }
    }

    return items
  }

  const paginationItems = generatePaginationItems()

  return (
    <div className={`table-container ${scroll?.x ? `width-${scroll.x}` : ""}`}>
      <div className="table-wrapper">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table-cell ${column.align ? `text-${column.align}` : "text-left"} ${column.className || ""}`}
                  style={{ width: column.width }}
                  {...(column.onHeaderCell ? column.onHeaderCell() : {})}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((record, index) => (
                <tr key={record[rowKey] || index}>
                  {columns.map((column) => (
                    <td
                      key={`${record[rowKey] || index}-${column.key}`}
                      className={`table-cell ${column.align ? `text-${column.align}` : "text-left"}`}
                    >
                      {column.render
                        ? column.render(getNestedValue(record, column.dataIndex), record, index)
                        : getNestedValue(record, column.dataIndex)
                          ? getNestedValue(record, column.dataIndex)
                          : "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  {emptyText ? emptyText : "no data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        {number_of_pages && number_of_pages > 1 && (
          <div className="pagination">
            <button
              className={`pagination-button ${page <= 1 ? "pagination-button-disabled" : ""}`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              &lt;
            </button>

            {paginationItems.map((item, index) =>
              item < 0 ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}`}
                  className={`pagination-button ${item === page ? "pagination-button-active" : ""}`}
                  onClick={() => handlePageChange(item)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              className={`pagination-button ${page >= (number_of_pages || 1) ? "pagination-button-disabled" : ""}`}
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= (number_of_pages || 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Table

