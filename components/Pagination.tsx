import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage: number, endPage: number;

  if (totalPages <= maxPageButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrent = Math.floor(maxPageButtons / 2);
    const maxPagesAfterCurrent = Math.ceil(maxPageButtons / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrent) {
      startPage = 1;
      endPage = maxPageButtons;
    } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
      startPage = totalPages - maxPageButtons + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
        return;
    }
    onPageChange(page);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
      <span className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <nav aria-label="Pagination">
        <ul className="flex items-center space-x-1">
          <li>
            <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1 || isLoading} variant="secondary" className="!px-2 !py-1 text-sm">First</Button>
          </li>
          <li>
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} variant="secondary" className="!px-2 !py-1 text-sm">Prev</Button>
          </li>
          
          {startPage > 1 && <li className="px-2 py-1 text-gray-400">...</li>}
          
          {pageNumbers.map(number => (
            <li key={number}>
              <Button
                onClick={() => handlePageChange(number)}
                className="!px-3 !py-1 text-sm"
                variant={currentPage === number ? 'primary' : 'secondary'}
                aria-current={currentPage === number ? 'page' : undefined}
                disabled={isLoading}
              >
                {number}
              </Button>
            </li>
          ))}

          {endPage < totalPages && <li className="px-2 py-1 text-gray-400">...</li>}
          
          <li>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} variant="secondary" className="!px-2 !py-1 text-sm">Next</Button>
          </li>
          <li>
            <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages || isLoading} variant="secondary" className="!px-2 !py-1 text-sm">Last</Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
