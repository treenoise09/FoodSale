using System;
using System.Collections.Generic;
using System.IO;
using OfficeOpenXml;
using foodSale.Model;
using foodSale.Data;
using foodSale.Models;

namespace foodSale.Services
{
    public class FoodSaleService
    {
        private readonly string _filePath;
        public FoodSaleService(string filePath)
        {
            _filePath = filePath;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Set license context for EPPlus
        }

        public List<FoodSale> GetFoodSales()
        {
            var foodSales = new List<FoodSale>();

            using (var package = new ExcelPackage(new FileInfo(_filePath)))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // Assuming data is in the first worksheet
                Console.WriteLine($"{worksheet.Dimension.End.Row}");
                // Assuming the first row is a header row
                for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                {
                    Console.WriteLine($"{row}");
                    if (worksheet.Cells[row, 1] == null || string.IsNullOrWhiteSpace(worksheet.Cells[row, 1].Text))
                    {
                        continue;
                    }
                    var foodSale = new FoodSale
                    {
                        Id = row,
                        OrderDate = worksheet.Cells[row, 1].GetValue<DateTime>(),
                        Region = worksheet.Cells[row, 2].Text,
                        City = worksheet.Cells[row, 3].Text,
                        Category = worksheet.Cells[row, 4].Text,
                        Product = worksheet.Cells[row, 5].Text,
                        Quantity = int.Parse(worksheet.Cells[row, 6].Text),
                        UnitPrice = double.Parse(worksheet.Cells[row, 7].Text),
                        TotalPrice = double.Parse(worksheet.Cells[row, 8].Text)
                    };

                    foodSales.Add(foodSale);
                }
            }
            foreach (var foodSale in foodSales)
            {
                Console.WriteLine($"{foodSale.Id}");
            }

            return foodSales;
        }

        public void Update(FoodSale foodSale)
        {
            using (var package = new ExcelPackage(new FileInfo(_filePath)))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];

                int row = foodSale.Id;
                worksheet.Cells[row, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                worksheet.Cells[row, 1].Value = foodSale.OrderDate.ToString("dd/MM/yyyy");
                worksheet.Cells[row, 2].Value = foodSale.Region;
                worksheet.Cells[row, 3].Value = foodSale.City;
                worksheet.Cells[row, 4].Value = foodSale.Category;
                worksheet.Cells[row, 5].Value = foodSale.Product;
                worksheet.Cells[row, 6].Value = foodSale.Quantity;
                worksheet.Cells[row, 7].Value = foodSale.UnitPrice;
                worksheet.Cells[row, 8].Value = foodSale.TotalPrice;

                package.Save();
            }
        }
        public void Delete(int row)
        {
            using (var package = new ExcelPackage(new FileInfo(_filePath)))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];

                worksheet.DeleteRow(row, 1, false);
                package.Save();
            }
        }
        public FoodSale Find(int Id)
        {
            List<FoodSale> foodSale = GetFoodSales();
            foreach (FoodSale fo in foodSale)
            {
                if (fo.Id == Id)
                {
                    return fo;
                }
            }
            return null;
        }
        public PaginateFoodSaleList GetAll(int pageIndex = 1, int pageSize = 10)
        {
            var foodSales = new List<FoodSale>();
            PaginateFoodSaleList paginateList;

            using (var package = new ExcelPackage(new FileInfo(_filePath)))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // Assuming data is in the first worksheet

                int totalRows = worksheet.Dimension.End.Row; // Total number of rows in the sheet
                Console.WriteLine($"Total Rows: {totalRows}");

                // Calculate the starting and ending row for the requested page
                int startRow = ((pageIndex - 1) * pageSize) + 2; // Adding 2 to skip the header row
                int endRow = startRow + pageSize - 1;

                // Ensure endRow doesn't exceed the last row of the sheet
                endRow = Math.Min(endRow, totalRows);

                for (int row = startRow; row <= endRow; row++)
                {
                    if (worksheet.Cells[row, 1] == null || string.IsNullOrWhiteSpace(worksheet.Cells[row, 1].Text))
                    {
                        continue; // Skip rows with empty data in the first cell
                    }

                    var foodSale = new FoodSale
                    {
                        Id = row,
                        OrderDate = worksheet.Cells[row, 1].GetValue<DateTime>(),
                        Region = worksheet.Cells[row, 2].Text,
                        City = worksheet.Cells[row, 3].Text,
                        Category = worksheet.Cells[row, 4].Text,
                        Product = worksheet.Cells[row, 5].Text,
                        Quantity = int.Parse(worksheet.Cells[row, 6].Text),
                        UnitPrice = double.Parse(worksheet.Cells[row, 7].Text),
                        TotalPrice = double.Parse(worksheet.Cells[row, 8].Text)
                    };

                    foodSales.Add(foodSale);
                }
                paginateList = new PaginateFoodSaleList(foodSales, pageIndex, (totalRows + pageSize - 1) / pageSize);
            }

            // Output each food sale Id for debugging
            foreach (var foodSale in foodSales)
            {
                Console.WriteLine($"Id: {foodSale.Id}");
            }

            return paginateList;
        }

    }
}
