using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrKitApi.Data;
using MrKitApi.Models;
using MrKitApi.Dtos;
using MrKitApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CloudinaryService _cloudinaryService;

        public NewsController(AppDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        // GET: api/news
        [HttpGet]
        public async Task<ActionResult<IEnumerable<News>>> GetNews()
        {
            try
            {
                var news = await _context.News
                    .OrderByDescending(n => n.CreatedAt)
                    .ToListAsync();
                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi: {ex.Message}" });
            }
        }

        // GET: api/news/5
        [HttpGet("{id}")]
        public async Task<ActionResult<News>> GetNews(int id)
        {
            try
            {
                var news = await _context.News.FindAsync(id);
                
                if (news == null)
                {
                    return NotFound(new { message = "Không tìm thấy tin tức" });
                }

                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi: {ex.Message}" });
            }
        }

// POST: api/news
[Authorize]
[HttpPost]
public async Task<ActionResult<News>> CreateNews([FromForm] NewsDto dto)
{
    try
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                message = "Dữ liệu không hợp lệ",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        var news = new News
        {
            Title = dto.Title,
            HeaderContent = dto.HeaderContent,
            MainContent = dto.MainContent,
            FooterContent = dto.FooterContent,
            CreatedAt = DateTime.Now
        };

        if (dto.HeaderImgFile != null && dto.HeaderImgFile.Length > 0)
            news.HeaderImg = await _cloudinaryService.UploadFileAsync(dto.HeaderImgFile);
        else if (!string.IsNullOrEmpty(dto.HeaderImg))
            news.HeaderImg = dto.HeaderImg;

        if (dto.MainImgFile != null && dto.MainImgFile.Length > 0)
            news.MainImg = await _cloudinaryService.UploadFileAsync(dto.MainImgFile);
        else if (!string.IsNullOrEmpty(dto.MainImg))
            news.MainImg = dto.MainImg;

        if (dto.FooterImgFile != null && dto.FooterImgFile.Length > 0)
            news.FooterImg = await _cloudinaryService.UploadFileAsync(dto.FooterImgFile);
        else if (!string.IsNullOrEmpty(dto.FooterImg))
            news.FooterImg = dto.FooterImg;

        _context.News.Add(news);
        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";
        _context.AdminLogs.Add(new AdminLog
        {
            AdminAccount = adminAccount,
            Log = $"[CREATE_NEWS] Thêm tin tức: {news.Title} (ID: {news.Id})",
            CreatedAt = DateTime.Now
        });
        await _context.SaveChangesAsync();
        // =====================

        return Ok(new
        {
            success = true,
            message = "Thêm tin tức thành công",
            data = news
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = $"Lỗi: {ex.Message}" });
    }
}


      [Authorize]
[HttpPut("{id}")]
public async Task<IActionResult> UpdateNews(int id, [FromForm] NewsUpdateDto dto)
{
    try
    {
        var existingNews = await _context.News.FindAsync(id);
        if (existingNews == null)
            return NotFound(new { message = "Không tìm thấy tin tức" });

        var imagesToDelete = new List<string>();

        if (dto.DeleteHeaderImg && !string.IsNullOrEmpty(existingNews.HeaderImg))
        {
            imagesToDelete.Add(existingNews.HeaderImg);
            existingNews.HeaderImg = null;
        }

        if (dto.DeleteMainImg && !string.IsNullOrEmpty(existingNews.MainImg))
        {
            imagesToDelete.Add(existingNews.MainImg);
            existingNews.MainImg = null;
        }

        if (dto.DeleteFooterImg && !string.IsNullOrEmpty(existingNews.FooterImg))
        {
            imagesToDelete.Add(existingNews.FooterImg);
            existingNews.FooterImg = null;
        }

        if (dto.HeaderImgFile != null && dto.HeaderImgFile.Length > 0)
        {
            if (!string.IsNullOrEmpty(existingNews.HeaderImg))
                imagesToDelete.Add(existingNews.HeaderImg);

            existingNews.HeaderImg = await _cloudinaryService.UploadFileAsync(dto.HeaderImgFile);
        }

        if (dto.MainImgFile != null && dto.MainImgFile.Length > 0)
        {
            if (!string.IsNullOrEmpty(existingNews.MainImg))
                imagesToDelete.Add(existingNews.MainImg);

            existingNews.MainImg = await _cloudinaryService.UploadFileAsync(dto.MainImgFile);
        }

        if (dto.FooterImgFile != null && dto.FooterImgFile.Length > 0)
        {
            if (!string.IsNullOrEmpty(existingNews.FooterImg))
                imagesToDelete.Add(existingNews.FooterImg);

            existingNews.FooterImg = await _cloudinaryService.UploadFileAsync(dto.FooterImgFile);
        }

        existingNews.Title = dto.Title;
        existingNews.HeaderContent = dto.HeaderContent;
        existingNews.MainContent = dto.MainContent;
        existingNews.FooterContent = dto.FooterContent;

        _context.Entry(existingNews).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";
        _context.AdminLogs.Add(new AdminLog
        {
            AdminAccount = adminAccount,
            Log = $"[UPDATE_NEWS] Cập nhật tin tức: {existingNews.Title} (ID: {existingNews.Id})",
            CreatedAt = DateTime.Now
        });
        await _context.SaveChangesAsync();
        // =====================

        if (imagesToDelete.Count > 0)
        {
            try { await _cloudinaryService.DeleteFilesAsync(imagesToDelete); }
            catch { }
        }

        return Ok(new
        {
            success = true,
            message = "Cập nhật tin tức thành công",
            data = existingNews
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = $"Lỗi: {ex.Message}" });
    }
}


       // DELETE: api/news/{id}
[Authorize]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteNews(int id)
{
    try
    {
        var news = await _context.News.FindAsync(id);
        if (news == null)
            return NotFound(new { message = "Không tìm thấy tin tức" });

        var imagesToDelete = new List<string>();
        if (!string.IsNullOrEmpty(news.HeaderImg)) imagesToDelete.Add(news.HeaderImg);
        if (!string.IsNullOrEmpty(news.MainImg)) imagesToDelete.Add(news.MainImg);
        if (!string.IsNullOrEmpty(news.FooterImg)) imagesToDelete.Add(news.FooterImg);

        _context.News.Remove(news);
        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";
        _context.AdminLogs.Add(new AdminLog
        {
            AdminAccount = adminAccount,
            Log = $"[DELETE_NEWS] Xóa tin tức: {news.Title} (ID: {news.Id})",
            CreatedAt = DateTime.Now
        });
        await _context.SaveChangesAsync();
        // =====================

        if (imagesToDelete.Count > 0)
        {
            try { await _cloudinaryService.DeleteFilesAsync(imagesToDelete); }
            catch { }
        }

        return Ok(new
        {
            success = true,
            message = "Xóa tin tức thành công"
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = $"Lỗi: {ex.Message}" });
    }
}


        // POST: api/news/upload-image (Upload single image)
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Không có file ảnh"
                    });
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Định dạng file không hợp lệ. Chỉ chấp nhận: .jpg, .jpeg, .png, .gif, .webp"
                    });
                }

                // Validate file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "File vượt quá kích thước cho phép (5MB)"
                    });
                }

                var imageUrl = await _cloudinaryService.UploadFileAsync(file);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Không thể upload ảnh"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Upload ảnh thành công",
                    imageUrl = imageUrl
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