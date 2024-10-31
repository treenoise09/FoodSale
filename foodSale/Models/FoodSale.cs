using System.ComponentModel.DataAnnotations.Schema;

namespace foodSale.Model
{
    public class FoodSale
    {
        
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Region { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public string Product { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
        public double TotalPrice { get; set; }
    }
}
