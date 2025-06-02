import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Calculate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range: (number | string)[] = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    range.unshift(1);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <nav className="flex flex-col items-center justify-center mt-12 mb-8 space-y-6" role="navigation" aria-label="Pagination">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="group px-5 py-2.5 text-white bg-[#1f1f1f] rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2f2f2f] transition-all duration-300 flex items-center"
          aria-label="Previous page"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 transform group-hover:-translate-x-0.5 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        <div className="flex items-center" role="list">
          {getPageNumbers().map((pageNum, idx) => (
            <button
              key={idx}
              onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : undefined}
              disabled={pageNum === '...'}
              className={`relative w-12 h-12 flex items-center justify-center text-base transition-all duration-300
                ${typeof pageNum === 'number' 
                  ? pageNum === currentPage
                    ? 'text-[#edb409] font-semibold scale-110'
                    : 'text-white hover:text-[#edb409'
                  : 'text-gray-400 cursor-default text-lg font-medium px-1'
                }
                ${typeof pageNum === 'number' && pageNum === currentPage 
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-[#edb409] after:rounded-full'
                  : ''
                }`}
              aria-label={typeof pageNum === 'number' ? `Page ${pageNum}` : 'More pages'}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum === '...' ? '•••' : pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="group px-5 py-2.5 text-white bg-[#1f1f1f] rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2f2f2f] transition-all duration-300 flex items-center"
          aria-label="Next page"
        >
          Next
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2 transform group-hover:translate-x-0.5 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="text-gray-400 text-sm font-medium tracking-wide">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

export default Pagination;