using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrKitApi.Data;
using MrKitApi.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpotlightController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpotlightController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/spotlight/user - Lấy sản phẩm spotlight cho user
[HttpGet("user")]
public async Task<ActionResult<object>> GetSpotlightForUser()
{
    try
    {
        Console.WriteLine("=== GET SPOTLIGHT FOR USER START ===");
        
        // Lấy spotlight đầu tiên
        var spotlight = await _context.SpotlightProducts
            .FirstOrDefaultAsync();

        // Nếu chưa có spotlight, trả về danh sách rỗng hoặc mặc định
        if (spotlight == null)
        {
            Console.WriteLine("No spotlight found, returning empty array");
            return Ok(new
            {
                success = true,
                products = new List<object>()
            });
        }

        // Lấy danh sách ID sản phẩm từ spotlight
        var productIds = new[] 
        { 
            spotlight.Idsp1, spotlight.Idsp2, spotlight.Idsp3, 
            spotlight.Idsp4, spotlight.Idsp5, spotlight.Idsp6 
        };

        Console.WriteLine($"Spotlight product IDs: {string.Join(", ", productIds)}");

        // Lấy thông tin chi tiết các sản phẩm
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.SalePrice,
                p.Status,
                p.Category,
                Images = p.ImageList,
                MainImage = p.MainImage,
                IsOnSale = p.IsOnSale,
                DiscountPercent = p.DiscountPercent,
                p.CreatedAt
            })
            .ToListAsync();

        Console.WriteLine($"Found {products.Count} spotlight products");

        // Sắp xếp theo thứ tự trong spotlight (1-6)
        var orderedProducts = productIds
            .Select(id => products.FirstOrDefault(p => p.Id == id))
            .Where(p => p != null)  // Loại bỏ null nếu có sản phẩm không tồn tại
            .ToList();

        var result = new
        {
            success = true,
            message = "Lấy danh sách sản phẩm tiêu biểu thành công",
            spotlight = new
            {
                spotlight.Idsp1,
                spotlight.Idsp2,
                spotlight.Idsp3,
                spotlight.Idsp4,
                spotlight.Idsp5,
                spotlight.Idsp6
            },
            products = orderedProducts
        };

        Console.WriteLine($"Returning {orderedProducts.Count} products for user");
        Console.WriteLine("=== GET SPOTLIGHT FOR USER END ===");
        
        return Ok(result);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"=== ERROR in GetSpotlightForUser ===");
        Console.WriteLine($"Message: {ex.Message}");
        Console.WriteLine($"StackTrace: {ex.StackTrace}");
        
        return StatusCode(500, new 
        { 
            success = false, 
            message = $"Lỗi server: {ex.Message}" 
        });
    }
}

        // GET: api/spotlight
        [HttpGet]
        public async Task<ActionResult<object>> GetSpotlight()
        {
            try
            {
                // Lấy spotlight đầu tiên
                var spotlight = await _context.SpotlightProducts
                    .FirstOrDefaultAsync();

                // Nếu chưa có, tạo mặc định
                if (spotlight == null)
                {
                    spotlight = await CreateDefaultSpotlightAsync();
                }

                // Lấy thông tin sản phẩm
                var productIds = new[] 
                { 
                    spotlight.Idsp1, spotlight.Idsp2, spotlight.Idsp3, 
                    spotlight.Idsp4, spotlight.Idsp5, spotlight.Idsp6 
                };

                var products = await _context.Products
                    .Where(p => productIds.Contains(p.Id))
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.SalePrice,
                        p.Status,
                        Images = p.ImageList
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    spotlight = new
                    {
                        spotlight.Idsp1,
                        spotlight.Idsp2,
                        spotlight.Idsp3,
                        spotlight.Idsp4,
                        spotlight.Idsp5,
                        spotlight.Idsp6
                    },
                    products = products.OrderBy(p => Array.IndexOf(productIds, p.Id)).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = $"Lỗi server: {ex.Message}" 
                });
            }
        }

        // PUT: api/spotlight/update
       [Authorize]
[HttpPut("update")]
public async Task<IActionResult> UpdateSpotlight([FromBody] SpotlightUpdateDto dto)
{
    try
    {
        // Kiểm tra ID sản phẩm tồn tại
        var productIds = new[] 
        { 
            dto.Idsp1, dto.Idsp2, dto.Idsp3, 
            dto.Idsp4, dto.Idsp5, dto.Idsp6 
        };

        var existingProductIds = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .Select(p => p.Id)
            .ToListAsync();

        var missingIds = productIds
            .Where(id => !existingProductIds.Contains(id))
            .ToList();

        if (missingIds.Any())
        {
            return BadRequest(new
            {
                success = false,
                message = $"Không tìm thấy sản phẩm với ID: {string.Join(", ", missingIds)}"
            });
        }

        // Lấy spotlight hiện tại (chỉ có 1 dòng)
        var existingSpotlight = await _context.SpotlightProducts.FirstOrDefaultAsync();
        var isCreate = false;

        if (existingSpotlight == null)
        {
            isCreate = true;

            var spotlight = new Spotlight
            {
                Idsp1 = dto.Idsp1,
                Idsp2 = dto.Idsp2,
                Idsp3 = dto.Idsp3,
                Idsp4 = dto.Idsp4,
                Idsp5 = dto.Idsp5,
                Idsp6 = dto.Idsp6
            };

            _context.SpotlightProducts.Add(spotlight);
        }
        else
        {
            existingSpotlight.Idsp1 = dto.Idsp1;
            existingSpotlight.Idsp2 = dto.Idsp2;
            existingSpotlight.Idsp3 = dto.Idsp3;
            existingSpotlight.Idsp4 = dto.Idsp4;
            existingSpotlight.Idsp5 = dto.Idsp5;
            existingSpotlight.Idsp6 = dto.Idsp6;
        }

        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";

        _context.AdminLogs.Add(new AdminLog
        {
            AdminAccount = adminAccount,
            Log = isCreate
                ? "[CREATE_SPOTLIGHT] Tạo sản phẩm tiêu biểu"
                : "[UPDATE_SPOTLIGHT] Cập nhật sản phẩm tiêu biểu",
            CreatedAt = DateTime.Now
        });

        await _context.SaveChangesAsync();
        // =====================

        return Ok(new
        {
            success = true,
            message = "Đã cập nhật sản phẩm tiêu biểu thành công!"
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new
        {
            success = false,
            message = $"Lỗi server: {ex.Message}"
        });
    }
}

        // Tạo spotlight mặc định
        private async Task<Spotlight> CreateDefaultSpotlightAsync()
        {
            // Lấy 6 sản phẩm đầu tiên làm mặc định
            var defaultProducts = await _context.Products
                .Take(6)
                .Select(p => p.Id)
                .ToListAsync();

            // Thêm đủ 6 ID
            while (defaultProducts.Count < 6)
            {
                defaultProducts.Add(1);
            }

            var spotlight = new Spotlight
            {
                Idsp1 = defaultProducts[0],
                Idsp2 = defaultProducts[1],
                Idsp3 = defaultProducts[2],
                Idsp4 = defaultProducts[3],
                Idsp5 = defaultProducts[4],
                Idsp6 = defaultProducts[5]
            };

            _context.SpotlightProducts.Add(spotlight);
            await _context.SaveChangesAsync();
            
            return spotlight;
        }
    }

}