using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrKitApi.Data;
using MrKitApi.Models;
using MrKitApi.Dtos;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlashSaleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<FlashSaleController> _logger;

        public FlashSaleController(AppDbContext context, ILogger<FlashSaleController> logger)
        {
            _context = context;
            _logger = logger;
        }

      [HttpGet("active")]
public async Task<ActionResult<object>> GetActiveFlashSales()
{
    try
    {
        // Sử dụng Vietnam time (server local time)
        var nowVietnam = DateTime.Now;
        _logger.LogInformation("Current Vietnam time: {Now}", nowVietnam);

        var activeFlashSales = await _context.FlashSales
            .Where(fs => fs.IsActive && fs.Status == "active" 
                && fs.StartTime <= nowVietnam && fs.EndTime >= nowVietnam)
            .Include(fs => fs.FlashSaleProducts)
                .ThenInclude(fsp => fsp.Product)
            .ToListAsync();

        _logger.LogInformation($"Found {activeFlashSales.Count} active flash sales");

        var result = new List<object>();
        
        foreach (var flashSale in activeFlashSales)
        {
            var products = new List<object>();
            
            foreach (var fsp in flashSale.FlashSaleProducts)
            {
                var product = fsp.Product;
                var mainImage = string.Empty;
                
                if (product != null && !string.IsNullOrEmpty(product.Images))
                {
                    try
                    {
                        var images = System.Text.Json.JsonSerializer.Deserialize<List<string>>(product.Images);
                        mainImage = images?.FirstOrDefault() ?? string.Empty;
                    }
                    catch
                    {
                        // Fallback
                        mainImage = product.Images.Length > 100 
                            ? product.Images.Substring(0, 100) + "..." 
                            : product.Images;
                    }
                }
                
                var discountPercent = product != null && product.Price > 0
                    ? Math.Round((product.Price - fsp.FlashSalePrice) / product.Price * 100, 0)
                    : 0;
                
                products.Add(new
                {
                    ProductId = fsp.ProductId,
                    ProductName = product?.Name ?? "N/A",
                    OriginalPrice = product?.Price ?? 0,
                    FlashSalePrice = fsp.FlashSalePrice,
                    DiscountPercent = discountPercent,
                    MainImage = mainImage
                });
            }
            
            // Tính thời gian còn lại theo Vietnam time
            var timeRemaining = flashSale.EndTime - nowVietnam;
            
            result.Add(new
            {
                flashSale.Id,
                flashSale.Name,
                flashSale.Description,
                StartTime = flashSale.StartTime,
                EndTime = flashSale.EndTime,
                flashSale.Status,
                flashSale.IsActive,
                TimeRemainingFormatted = FormatTimeRemaining(timeRemaining),
                NowVietnam = nowVietnam,
                Products = products
            });
        }

        return Ok(new
        {
            success = true,
            count = result.Count,
            flashsales = result
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Lỗi khi lấy flash sale active");
        return StatusCode(500, new { 
            success = false, 
            message = "Lỗi server",
            error = ex.Message
        });
    }
}
        [Authorize]
       [HttpGet("admin")]
public async Task<ActionResult<object>> GetAllFlashSalesForAdmin()
{
    try
    {
        _logger.LogInformation("=== Bắt đầu GetAllFlashSalesForAdmin ===");
        
        // Sử dụng Vietnam time
        var nowVietnam = DateTime.Now;
        _logger.LogInformation($"Thời gian Vietnam: {nowVietnam}");
        
        // Lấy dữ liệu
        var flashSales = await _context.FlashSales
            .OrderByDescending(fs => fs.CreatedAt)
            .Include(fs => fs.FlashSaleProducts)
            .ToListAsync();

        _logger.LogInformation($"Đã load {flashSales.Count} flash sales");

        var result = new List<object>();
        
        foreach (var fs in flashSales)
        {
            try
            {
                // Tính thời gian còn lại theo Vietnam time
                var timeRemaining = fs.EndTime - nowVietnam;
                var isExpired = fs.EndTime < nowVietnam;
                var isRunning = fs.Status == "active" && fs.StartTime <= nowVietnam && fs.EndTime >= nowVietnam;
                
                var item = new
                {
                    fs.Id,
                    fs.Name,
                    Description = fs.Description ?? string.Empty,
                    StartTime = fs.StartTime,
                    EndTime = fs.EndTime,
                    Status = fs.Status ?? "pending",
                    IsActive = fs.IsActive,
                    CreatedAt = fs.CreatedAt,
                    IsExpired = isExpired,
                    IsRunning = isRunning,
                    TimeRemainingFormatted = fs.EndTime > nowVietnam 
                        ? FormatTimeRemaining(timeRemaining)
                        : "Đã kết thúc",
                    ProductCount = fs.FlashSaleProducts?.Count ?? 0
                };
                
                result.Add(item);
                _logger.LogInformation($"Đã xử lý flash sale {fs.Id}: {fs.Name}, End: {fs.EndTime}, Now: {nowVietnam}, Remaining: {item.TimeRemainingFormatted}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Lỗi khi xử lý flash sale {fs.Id}");
                continue;
            }
        }

        _logger.LogInformation($"Tổng số kết quả: {result.Count}");

        return Ok(new
        {
            success = true,
            count = result.Count,
            flashsales = result
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Lỗi khi lấy flash sale cho admin");
        
        return StatusCode(500, new 
        { 
            success = false, 
            message = "Lỗi server",
            error = ex.Message
        });
    }
}

      
       [Authorize]
[HttpGet("{id}")]
public async Task<ActionResult<object>> GetFlashSaleById(int id)
{
    try
    {
        var flashSale = await _context.FlashSales
            .Include(fs => fs.FlashSaleProducts)
            .ThenInclude(fsp => fsp.Product)
            .FirstOrDefaultAsync(fs => fs.Id == id);

        if (flashSale == null)
        {
            return NotFound(new { success = false, message = "Không tìm thấy flash sale" });
        }

        var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        var nowVietnam = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);
        var startTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(flashSale.StartTime, vietnamTimeZone);
        var endTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(flashSale.EndTime, vietnamTimeZone);
        var timeRemaining = endTimeVietnam - nowVietnam;

        var result = new
        {
            flashSale.Id,
            flashSale.Name,
            flashSale.Description,
            StartTime = startTimeVietnam,
            EndTime = endTimeVietnam,
            flashSale.Status,
            flashSale.IsActive,
            CreatedAt = flashSale.CreatedAt,
            IsExpired = endTimeVietnam < nowVietnam,
            IsRunning = flashSale.Status == "active" && startTimeVietnam <= nowVietnam && endTimeVietnam >= nowVietnam,
            TimeRemainingFormatted = endTimeVietnam > nowVietnam 
                ? FormatTimeRemaining(timeRemaining)
                : "Đã kết thúc",
            Products = flashSale.FlashSaleProducts.Select(fsp =>
            {
                var product = fsp.Product;
                var productImage = string.Empty;

                if (product != null && !string.IsNullOrEmpty(product.Images))
                {
                    try
                    {
                        var images = JsonSerializer.Deserialize<List<string>>(product.Images);
                        productImage = images?.FirstOrDefault() ?? string.Empty;
                    }
                    catch
                    {
                        productImage = string.Empty;
                    }
                }

                var discountPercent = product != null 
                    ? CalculateDiscountPercent(product.Price, fsp.FlashSalePrice)
                    : 0;

                return new
                {
                    fsp.Id,
                    fsp.ProductId,
                    productName = product?.Name ?? "N/A",
                    originalPrice = product?.Price ?? 0,
                    flashSalePrice = fsp.FlashSalePrice,
                    discountPercent = discountPercent,
                    productImage,
                    productCategory = product?.Category ?? "N/A"
                };
            }).ToList()
        };

        return Ok(new { success = true, flashsale = result });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Lỗi khi lấy flash sale by id");
        return StatusCode(500, new { success = false, message = "Lỗi server" });
    }
}


       [Authorize]
        [HttpPost]
public async Task<ActionResult<object>> CreateFlashSale([FromBody] CreateFlashSaleDto dto)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    
    try
    {
        _logger.LogInformation("Creating flash sale with name: {Name}", dto.Name);
        _logger.LogInformation("Products count: {Count}", dto.Products.Count);
        _logger.LogInformation("StartTime from client: {StartTime}", dto.StartTime);
        _logger.LogInformation("EndTime from client: {EndTime}", dto.EndTime);

        // Convert từ UTC sang Vietnam time (UTC+7)
        var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        var startTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(dto.StartTime, vietnamTimeZone);
        var endTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(dto.EndTime, vietnamTimeZone);
        
        _logger.LogInformation("StartTime Vietnam: {StartTime}", startTimeVietnam);
        _logger.LogInformation("EndTime Vietnam: {EndTime}", endTimeVietnam);

        // Validate thời gian
        if (dto.EndTime <= dto.StartTime)
        {
            return BadRequest(new { success = false, message = "Thời gian kết thúc phải sau thời gian bắt đầu" });
        }

        // Validate: Thời gian kết thúc phải ở tương lai (so với Vietnam time)
        if (endTimeVietnam <= DateTime.Now)
        {
            return BadRequest(new { success = false, message = "Thời gian kết thúc phải ở tương lai" });
        }

        // Validate sản phẩm
        if (!dto.Products.Any())
        {
            return BadRequest(new { success = false, message = "Phải có ít nhất 1 sản phẩm" });
        }

        // Kiểm tra sản phẩm có tồn tại không
        var productIds = dto.Products.Select(p => p.ProductId).ToList();
        var existingProducts = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .Select(p => p.Id)
            .ToListAsync();

        var missingProducts = productIds.Except(existingProducts).ToList();
        if (missingProducts.Any())
        {
            return BadRequest(new { 
                success = false, 
                message = $"Không tìm thấy sản phẩm với ID: {string.Join(", ", missingProducts)}" 
            });
        }

        // Tạo flash sale - lưu thời gian theo Vietnam time
        var flashSale = new FlashSale
        {
            Name = dto.Name,
            Description = dto.Description,
            StartTime = startTimeVietnam, // Lưu theo Vietnam time
            EndTime = endTimeVietnam,    // Lưu theo Vietnam time
            CreatedAt = DateTime.Now,    // Lưu theo server local time (Vietnam)
            Status = "pending",
            IsActive = false
        };

        _logger.LogInformation("FlashSale created with times - Start: {Start}, End: {End}", 
            flashSale.StartTime, flashSale.EndTime);

        _context.FlashSales.Add(flashSale);
        await _context.SaveChangesAsync();
        
        _logger.LogInformation("FlashSale created with ID: {Id}", flashSale.Id);

        // Thêm sản phẩm vào flash sale
        foreach (var productDto in dto.Products)
        {
            var flashSaleProduct = new FlashSaleProduct
            {
                FlashSaleId = flashSale.Id,
                ProductId = productDto.ProductId,
                FlashSalePrice = productDto.FlashSalePrice,
                CreatedAt = DateTime.Now
            };
            _context.FlashSaleProducts.Add(flashSaleProduct);
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            success = true,
            message = "Tạo flash sale thành công",
            flashsaleId = flashSale.Id,
            times = new {
                startTime = flashSale.StartTime,
                endTime = flashSale.EndTime
            }
        });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        _logger.LogError(ex, "Unexpected error creating flash sale");
        return StatusCode(500, new { 
            success = false, 
            message = "Lỗi server: " + ex.Message,
            stackTrace = ex.StackTrace 
        });
    }
}
        

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteFlashSale(int id)
        {
            try
            {
                var flashSale = await _context.FlashSales
                    .Include(fs => fs.FlashSaleProducts)
                    .FirstOrDefaultAsync(fs => fs.Id == id);

                if (flashSale == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy flash sale" });
                }

                if (flashSale.Status == "active")
                {
                    await RestoreProductPrices(flashSale.Id);
                }

                _context.FlashSales.Remove(flashSale);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa flash sale thành công"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa flash sale");
                return StatusCode(500, new { success = false, message = "Lỗi server" });
            }
        }

        // PUT: api/flashsale/update-statuses
        [HttpPut("update-statuses")]
        public async Task<ActionResult<object>> UpdateAllFlashSaleStatuses()
        {
            try
            {
                var flashSales = await _context.FlashSales.ToListAsync();
                var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                var nowVietnam = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);

                foreach (var flashSale in flashSales)
                {
                    var oldStatus = flashSale.Status;
                    
                    var startTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(flashSale.StartTime, vietnamTimeZone);
                    var endTimeVietnam = TimeZoneInfo.ConvertTimeFromUtc(flashSale.EndTime, vietnamTimeZone);
                    
                    // Update status dựa trên thời gian Việt Nam
                    if (endTimeVietnam < nowVietnam)
                    {
                        flashSale.Status = "ended";
                        flashSale.IsActive = false;
                    }
                    else if (startTimeVietnam <= nowVietnam && endTimeVietnam >= nowVietnam)
                    {
                        flashSale.Status = "active";
                        flashSale.IsActive = true;
                    }
                    else
                    {
                        flashSale.Status = "pending";
                        flashSale.IsActive = false;
                    }

                    if (oldStatus == "active" && flashSale.Status == "ended")
                    {
                        await RestoreProductPrices(flashSale.Id);
                    }
                    else if (oldStatus == "pending" && flashSale.Status == "active")
                    {
                        await ApplyFlashSalePrices(flashSale.Id);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Đã cập nhật trạng thái tất cả flash sale"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi update tất cả flash sale status");
                return StatusCode(500, new { success = false, message = "Lỗi server" });
            }
        }

        // GET: api/flashsale/timezone-info
        [HttpGet("timezone-info")]
        public ActionResult<object> GetTimezoneInfo()
        {
            try
            {
                var utcNow = DateTime.UtcNow;
                var localNow = DateTime.Now;
                var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                var vietnamNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
                
                return Ok(new
                {
                    success = true,
                    timezones = new
                    {
                        UtcNow = utcNow,
                        VietnamNow = vietnamNow,
                        LocalNow = localNow,
                        UtcToVietnamDifference = (vietnamNow - utcNow).TotalHours,
                        LocalToVietnamDifference = (vietnamNow - localNow).TotalHours
                    },
                    timezoneInfo = new
                    {
                        SystemTimeZone = TimeZoneInfo.Local.StandardName,
                        SystemTimeZoneId = TimeZoneInfo.Local.Id,
                        VietnamTimeZoneId = vietnamTimeZone.Id,
                        IsVietnamTimeZone = vietnamTimeZone.Id.Contains("Asia") || vietnamTimeZone.Id.Contains("Bangkok")
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error getting timezone info",
                    error = ex.Message
                });
            }
        }

        // ==================== HELPER METHODS ====================

        private async Task ApplyFlashSalePrices(int flashSaleId)
        {
            var flashSaleProducts = await _context.FlashSaleProducts
                .Where(fsp => fsp.FlashSaleId == flashSaleId)
                .Include(fsp => fsp.Product)
                .ToListAsync();

            foreach (var fsp in flashSaleProducts)
            {
                if (fsp.Product != null)
                {
                    fsp.Product.Status = "sale";
                    fsp.Product.SalePrice = fsp.FlashSalePrice;
                    fsp.Product.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        private async Task RestoreProductPrices(int flashSaleId)
        {
            var flashSaleProducts = await _context.FlashSaleProducts
                .Where(fsp => fsp.FlashSaleId == flashSaleId)
                .Include(fsp => fsp.Product)
                .ToListAsync();

            foreach (var fsp in flashSaleProducts)
            {
                if (fsp.Product != null)
                {
                    fsp.Product.Status = "not_sale";
                    fsp.Product.SalePrice = null;
                    fsp.Product.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        private static string FormatTimeRemaining(TimeSpan timeSpan)
        {
            if (timeSpan <= TimeSpan.Zero)
                return "Đã kết thúc";

            var totalHours = (int)timeSpan.TotalHours;
            var minutes = timeSpan.Minutes;
            
            if (totalHours >= 24)
            {
                var days = totalHours / 24;
                var hours = totalHours % 24;
                return $"{days} ngày {hours} giờ";
            }
            else if (totalHours > 0)
            {
                return $"{totalHours} giờ {minutes} phút";
            }
            else
            {
                return $"{minutes} phút";
            }
        }

        private static decimal CalculateDiscountPercent(decimal originalPrice, decimal salePrice)
        {
            if (originalPrice == 0) return 0;
            var discount = (originalPrice - salePrice) / originalPrice * 100;
            return Math.Round(discount, 0);
        }
    }
}