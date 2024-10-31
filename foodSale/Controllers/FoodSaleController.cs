using Microsoft.AspNetCore.Mvc;
using foodSale.Data;
using foodSale.Services;
using System.Collections.Generic;
using System.Linq;
using foodSale.Model;
using foodSale.Models;

namespace foodSale.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodSaleController : ControllerBase
    {

        private readonly FoodSaleService _excelService;

        public FoodSaleController( FoodSaleService excelService)
        {
          
            _excelService = excelService;
        }



        // GET all records
        [HttpGet]
        public ActionResult<PaginateFoodSaleList> GetAllFoodSales(int pageIndex = 1, int pageSize = 10)
        {
            // Call GetAll method in FoodSaleService with pagination parameters
            var pagedFoodSales = _excelService.GetAll(pageIndex, pageSize);
            return Ok(pagedFoodSales);
        }


        // POST: Add a new record
        [HttpPost]
        public ActionResult<FoodSale> CreateFoodSale(FoodSale foodSale)
        {
            var id = _excelService.GetFoodSales().Count+2;
            foodSale.Id = id;

            var foodsale = CreatedAtAction(nameof(GetAllFoodSales), new { id = foodSale.Id }, foodSale);
            _excelService.Update(foodSale);
            return foodSale;
        }

        // PUT: Edit an existing record
        [HttpPut("{id}")]
        public ActionResult UpdateFoodSale(int id, FoodSale foodSale)
        {
            var existingFoodSale = _excelService.Find(id);
            if (existingFoodSale == null) return NotFound();

            // Update properties
            existingFoodSale.OrderDate = foodSale.OrderDate;
            existingFoodSale.Region = foodSale.Region;
            existingFoodSale.City = foodSale.City;
            existingFoodSale.Category = foodSale.Category;
            existingFoodSale.Product = foodSale.Product;
            existingFoodSale.Quantity = foodSale.Quantity;
            existingFoodSale.UnitPrice = foodSale.UnitPrice;
            existingFoodSale.TotalPrice = foodSale.TotalPrice;


            _excelService.Update(existingFoodSale);
            return NoContent();
        }

        // DELETE: Delete a record
        [HttpDelete("{id}")]
        public ActionResult DeleteFoodSale(int id)
        {
            var foodSale = _excelService.Find(id);
            if (foodSale == null) return NotFound();

            _excelService.Delete(id);
            return NoContent();
        }
    }
}
