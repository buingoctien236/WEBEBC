// Controllers/UploadController.cs
using Microsoft.AspNetCore.Mvc;
using MrKitApi.Services;

namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;

        public UploadController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "Vui lòng chọn file ảnh" });
                }

                // Kiểm tra kích thước file (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File ảnh không được vượt quá 5MB" });
                }

                // Kiểm tra loại file
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)" });
                }

                var imageUrl = await _cloudinaryService.UploadFileAsync(file);
                
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return StatusCode(500, new { message = "Lỗi khi upload ảnh" });
                }

                return Ok(new { 
                    success = true, 
                    url = imageUrl,
                    fileName = file.FileName,
                    size = file.Length
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }
    }
}