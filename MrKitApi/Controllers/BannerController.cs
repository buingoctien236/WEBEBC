using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MrKitApi.Data;
using MrKitApi.Models;
using MrKitApi.Dtos;
using MrKitApi.Services;
using System.Security.Claims;
namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CloudinaryService _cloudinaryService;

        public BannerController(AppDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        // GET: api/banner (lấy banner hiện tại - cho frontend)
        [HttpGet]
        public async Task<ActionResult<object>> GetBanner()
        {
            try
            {
                var banner = await _context.Banners.FirstOrDefaultAsync();
                
                if (banner == null)
                {
                    return Ok(new
                    {
                        success = true,
                        banners = new
                        {
                            Id = 0,
                            Banner1 = string.Empty,
                            Banner2 = string.Empty,
                            Banner3 = string.Empty,
                            CreatedAt = DateTime.MinValue,
                            UpdatedAt = DateTime.MinValue,
                            BannersList = new List<string>()
                        }
                    });
                }

                var result = new
                {
                    success = true,
                    banners = new
                    {
                        Id = banner.Id,
                        Banner1 = banner.Banner1 ?? string.Empty,
                        Banner2 = banner.Banner2 ?? string.Empty,
                        Banner3 = banner.Banner3 ?? string.Empty,
                        CreatedAt = banner.CreatedAt,
                        UpdatedAt = banner.UpdatedAt,
                        BannersList = banner.BannersList
                    }
                };
                
                return Ok(result);
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

        // GET: api/banner/admin (lấy banner cho admin)
        
        [HttpGet("admin")]
        public async Task<ActionResult<object>> GetBannerForAdmin()
        {
            try
            {
                var banner = await _context.Banners.FirstOrDefaultAsync();
                
                if (banner == null)
                {
                    return Ok(new
                    {
                        success = true,
                        banners = new
                        {
                            Id = 0,
                            Banner1 = string.Empty,
                            Banner2 = string.Empty,
                            Banner3 = string.Empty,
                            CreatedAt = DateTime.MinValue,
                            UpdatedAt = DateTime.MinValue,
                            BannersList = new List<string>()
                        }
                    });
                }

                var result = new
                {
                    success = true,
                    banners = new
                    {
                        Id = banner.Id,
                        Banner1 = banner.Banner1 ?? string.Empty,
                        Banner2 = banner.Banner2 ?? string.Empty,
                        Banner3 = banner.Banner3 ?? string.Empty,
                        CreatedAt = banner.CreatedAt,
                        UpdatedAt = banner.UpdatedAt,
                        BannersList = banner.BannersList
                    }
                };
                
                return Ok(result);
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

        // POST: api/banner (tạo banner - luôn cho phép tạo mới nếu chưa có)
       
        [HttpPost]
        public async Task<IActionResult> CreateBanner([FromForm] BannerUpdateDto dto)
        {
            try
            {
                // Kiểm tra đã có banner chưa - Nếu có thì update thay vì tạo mới
                var existingBanner = await _context.Banners.FirstOrDefaultAsync();
                
                if (existingBanner != null)
                {
                    return await UpdateBanner(existingBanner.Id, dto);
                }

                var banner = new Banner
                {
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Upload banner 1
                if (dto.File1 != null && dto.File1.Length > 0)
                {
                    banner.Banner1 = await _cloudinaryService.UploadFileAsync(dto.File1);
                }
                else if (!string.IsNullOrEmpty(dto.Banner1))
                {
                    banner.Banner1 = dto.Banner1;
                }

                // Upload banner 2
                if (dto.File2 != null && dto.File2.Length > 0)
                {
                    banner.Banner2 = await _cloudinaryService.UploadFileAsync(dto.File2);
                }
                else if (!string.IsNullOrEmpty(dto.Banner2))
                {
                    banner.Banner2 = dto.Banner2;
                }

                // Upload banner 3
                if (dto.File3 != null && dto.File3.Length > 0)
                {
                    banner.Banner3 = await _cloudinaryService.UploadFileAsync(dto.File3);
                }
                else if (!string.IsNullOrEmpty(dto.Banner3))
                {
                    banner.Banner3 = dto.Banner3;
                }

                _context.Banners.Add(banner);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Tạo banner thành công",
                    banner = new
                    {
                        Id = banner.Id,
                        Banner1 = banner.Banner1 ?? string.Empty,
                        Banner2 = banner.Banner2 ?? string.Empty,
                        Banner3 = banner.Banner3 ?? string.Empty,
                        CreatedAt = banner.CreatedAt,
                        UpdatedAt = banner.UpdatedAt
                    }
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

        // PUT: api/banner/{id} (cập nhật banner)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBanner(int id, [FromForm] BannerUpdateDto dto)
        {
            try
            {
                var banner = await _context.Banners.FindAsync(id);
                if (banner == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy banner"
                    });
                }

                // Xử lý banner 1
                if (dto.File1 != null && dto.File1.Length > 0)
                {
                    if (!string.IsNullOrEmpty(banner.Banner1))
                    {
                        await _cloudinaryService.DeleteFileAsync(banner.Banner1);
                    }
                    banner.Banner1 = await _cloudinaryService.UploadFileAsync(dto.File1);
                }
                else if (!string.IsNullOrEmpty(dto.Banner1))
                {
                    banner.Banner1 = dto.Banner1;
                }

                // Xử lý banner 2
                if (dto.File2 != null && dto.File2.Length > 0)
                {
                    if (!string.IsNullOrEmpty(banner.Banner2))
                    {
                        await _cloudinaryService.DeleteFileAsync(banner.Banner2);
                    }
                    banner.Banner2 = await _cloudinaryService.UploadFileAsync(dto.File2);
                }
                else if (!string.IsNullOrEmpty(dto.Banner2))
                {
                    banner.Banner2 = dto.Banner2;
                }

                // Xử lý banner 3
                if (dto.File3 != null && dto.File3.Length > 0)
                {
                    if (!string.IsNullOrEmpty(banner.Banner3))
                    {
                        await _cloudinaryService.DeleteFileAsync(banner.Banner3);
                    }
                    banner.Banner3 = await _cloudinaryService.UploadFileAsync(dto.File3);
                }
                else if (!string.IsNullOrEmpty(dto.Banner3))
                {
                    banner.Banner3 = dto.Banner3;
                }

                banner.UpdatedAt = DateTime.UtcNow;
                
                _context.Entry(banner).State = EntityState.Modified;
await _context.SaveChangesAsync();

// ===== ADMIN LOG =====
var adminAccount =
    User.FindFirst(ClaimTypes.Name)?.Value
    ?? User.FindFirst("username")?.Value
    ?? "unknown";

_context.AdminLogs.Add(new AdminLog
{
    AdminAccount = adminAccount,
    Log = $"[UPDATE_BANNER] Cập nhật banner trang chủ (ID: {banner.Id})",
    CreatedAt = DateTime.Now
});
await _context.SaveChangesAsync();
// =====================


                return Ok(new
                {
                    success = true,
                    message = "Cập nhật banner thành công",
                    banner = new
                    {
                        Id = banner.Id,
                        Banner1 = banner.Banner1 ?? string.Empty,
                        Banner2 = banner.Banner2 ?? string.Empty,
                        Banner3 = banner.Banner3 ?? string.Empty,
                        CreatedAt = banner.CreatedAt,
                        UpdatedAt = banner.UpdatedAt,
                        BannersList = banner.BannersList
                    }
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

        
    }
}