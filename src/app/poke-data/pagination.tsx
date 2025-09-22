import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Table } from "@tanstack/react-table";
const PaginationComponent = ({
  table,
  pageCount,
  currentPage,
}: {
  table: Table<unknown>;
  pageCount: number;
  currentPage: number;
}) => {
  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {(() => {
              const pages = [];
              const totalPages = pageCount;
              const current = currentPage + 1;

              if (totalPages > 0) {
                pages.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(0);
                      }}
                      isActive={current === 1}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              if (current > 3) {
                pages.push(
                  <PaginationItem key="ellipsis1">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              for (
                let i = Math.max(2, current - 1);
                i <= Math.min(totalPages - 1, current + 1);
                i++
              ) {
                if (i !== 1 && i !== totalPages) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(i - 1);
                        }}
                        isActive={current === i}
                        className="cursor-pointer"
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              }

              if (current < totalPages - 2) {
                pages.push(
                  <PaginationItem key="ellipsis2">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              if (totalPages > 1) {
                pages.push(
                  <PaginationItem key={totalPages}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(totalPages - 1);
                      }}
                      isActive={current === totalPages}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              return pages;
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.nextPage();
                }}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComponent;
