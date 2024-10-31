using Microsoft.EntityFrameworkCore;
using foodSale.Model;

namespace foodSale.Data
{
    public class APIContext : DbContext
    {
        public APIContext(DbContextOptions<APIContext> options) : base(options)
        {
        }

        public DbSet<FoodSale> FoodSales { get; set; }
    }
}
