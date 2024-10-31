using foodSale.Model;

namespace foodSale.Models
{
    public class PaginateFoodSaleList
    {
        public List<FoodSale> Item { get; }
        public int PageIndex { get; }
        public bool HasPreviousPage => PageIndex > 1;
        public int TotalPage { get; }
        public bool HasNextPage => PageIndex < TotalPage;
        
        public PaginateFoodSaleList(List<FoodSale> item,int pageIndex,int totalPage)
        {
            Item = item; 
            PageIndex = pageIndex; 
            TotalPage = totalPage;
        }
    }
}
