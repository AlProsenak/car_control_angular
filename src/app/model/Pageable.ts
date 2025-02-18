export interface Pageable {
  empty_page: boolean;
  first_page: boolean;
  last_page: boolean;
  offset: number;
  page: number;
  page_size: number;
  total_elements: number;
  total_pages: number;
}
