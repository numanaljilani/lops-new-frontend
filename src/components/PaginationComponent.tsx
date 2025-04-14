import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComponent({ setPage, numberOfPages , page  }: any) {
  console.log(numberOfPages , page)
  function getPagination(itemCount: any, itemsPerPage = 10) {
    let totalPages = Math.ceil(itemCount / itemsPerPage);
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  const pages = getPagination(numberOfPages);

  return (
    <Pagination>
      <PaginationContent>
       {page != 1 &&  <PaginationItem>
          <PaginationPrevious onClick={()=> setPage(page - 1)} />
        </PaginationItem>}
  
        {pages.map((item , index) => (
          <PaginationItem key={index?.toString()}>
            <PaginationLink onClick={() => setPage(index + 1)} isActive={(index+1) == page ? true : false}>
            {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
    
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        {page < pages.length &&  <PaginationItem>
          <PaginationNext onClick={()=> setPage(page + 1)} />
        </PaginationItem>}
      </PaginationContent>
    </Pagination>
  );
}
