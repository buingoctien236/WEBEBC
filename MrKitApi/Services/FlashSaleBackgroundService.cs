using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MrKitApi.Data;
using MrKitApi.Models;

namespace MrKitApi.Services
{
    public class FlashSaleBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<FlashSaleBackgroundService> _logger;

        public FlashSaleBackgroundService(
            IServiceProvider serviceProvider, 
            ILogger<FlashSaleBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

       protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    _logger.LogInformation("FlashSale Background Service is starting.");
    
    await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
    
    while (!stoppingToken.IsCancellationRequested)
    {
        try
        {
            _logger.LogInformation("=== Background Service Check ===");
            
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                // Lấy tất cả flash sales
                var flashSales = await context.FlashSales.ToListAsync();
                
                // Lấy thời gian hiện tại theo Vietnam
                var nowVietnam = DateTime.Now;
                var nowUtc = DateTime.UtcNow;
                
                _logger.LogInformation($"Time check - Vietnam: {nowVietnam}, UTC: {nowUtc}");
                _logger.LogInformation($"Total flash sales to check: {flashSales.Count}");
                
                var updatedCount = 0;
                
                foreach (var flashSale in flashSales)
                {
                    var oldStatus = flashSale.Status;
                    
                    // Debug log
                    _logger.LogInformation($"Checking FS {flashSale.Id}: Start={flashSale.StartTime}, End={flashSale.EndTime}, OldStatus={oldStatus}");
                    
                    // Tính toán status mới
                    string newStatus;
                    bool newIsActive;
                    
                    if (flashSale.EndTime < nowVietnam)
                    {
                        newStatus = "ended";
                        newIsActive = false;
                    }
                    else if (flashSale.StartTime <= nowVietnam && flashSale.EndTime >= nowVietnam)
                    {
                        newStatus = "active";
                        newIsActive = true;
                    }
                    else
                    {
                        newStatus = "pending";
                        newIsActive = false;
                    }
                    
                    // Chỉ update nếu có thay đổi
                    if (oldStatus != newStatus || flashSale.IsActive != newIsActive)
                    {
                        _logger.LogInformation($"  Status change detected: {oldStatus}->{newStatus}, IsActive: {flashSale.IsActive}->{newIsActive}");
                        
                        flashSale.Status = newStatus;
                        flashSale.IsActive = newIsActive;
                        updatedCount++;
                        
                        // Xử lý giá sản phẩm
                        if (oldStatus == "active" && newStatus == "ended")
                        {
                            await RestoreProductPrices(context, flashSale.Id);
                            _logger.LogInformation($"  Restored product prices for FS {flashSale.Id}");
                        }
                        else if (oldStatus == "pending" && newStatus == "active")
                        {
                            await ApplyFlashSalePrices(context, flashSale.Id);
                            _logger.LogInformation($"  Applied sale prices for FS {flashSale.Id}");
                        }
                    }
                }
                
                // Lưu thay đổi
                if (updatedCount > 0)
                {
                    await context.SaveChangesAsync();
                    _logger.LogInformation($"Saved {updatedCount} updated flash sales");
                }
                else
                {
                    _logger.LogInformation("No updates needed");
                }
            }
            
            _logger.LogInformation("=== Background Service Check Complete ===");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi trong FlashSaleBackgroundService");
        }
        
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
    }
}
        private async Task ApplyFlashSalePrices(AppDbContext context, int flashSaleId)
        {
            try
            {
                var flashSaleProducts = await context.FlashSaleProducts
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
                        _logger.LogInformation($"Applied sale price {fsp.FlashSalePrice} for product {fsp.ProductId}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Lỗi khi áp dụng giá sale cho FlashSale {flashSaleId}");
            }
        }
        
        private async Task RestoreProductPrices(AppDbContext context, int flashSaleId)
        {
            try
            {
                var flashSaleProducts = await context.FlashSaleProducts
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
                        _logger.LogInformation($"Restored original price for product {fsp.ProductId}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Lỗi khi khôi phục giá cho FlashSale {flashSaleId}");
            }
        }
    }
}