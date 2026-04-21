using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrKitApi.Data;
using MrKitApi.Models;
using MrKitApi.Dtos;
using MrKitApi.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MrKitApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly CloudinaryService _cloudinaryService;

        public ProductsController(AppDbContext context, CloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        // GET: api/products lay danh sach san pham user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProducts()
        {
            try
            {
                var products = await _context.Products
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                // Format response để frontend dễ xử lý
                var result = products.Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.DetailedSpecs,
                    p.Price,
                    p.SalePrice,
                    p.Status,
                    p.Category,

                    Images = p.ImageList,
                    MainImage = p.MainImage,
                    IsOnSale = p.IsOnSale,
                    DiscountPercent = p.DiscountPercent,
                    p.CreatedAt,
                    p.UpdatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }
       
       [HttpGet("search")]
public async Task<IActionResult> SearchProducts([FromQuery] string term)
{
    if (string.IsNullOrWhiteSpace(term))
    {
        return Ok(new List<Product>());
    }

    var products = await _context.Products
        .Where(p => p.Name.Contains(term) || 
                   p.Description.Contains(term) ||
                   p.Category.Contains(term))
        .Take(10)
        .ToListAsync();
    
    // Chuyển đổi để bao gồm ImageList
    var result = products.Select(p => new
    {
        p.Id,
        p.Name,
        p.Description,
        p.Price,
        p.Category,
        Images = p.ImageList, // Thêm dòng này
        Image = p.MainImage    // Hoặc có thể dùng MainImage
    }).ToList();
    
    return Ok(result);
}

        // GET: api/products/sale  lay san pham dang sale
        [HttpGet("sale")]
        public async Task<ActionResult<IEnumerable<object>>> GetSaleProducts()
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.Status == "sale" && p.SalePrice.HasValue)
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(8)
                    .ToListAsync();

                var result = products.Select(p => new
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
                    DiscountPercent = p.DiscountPercent
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }
       
        [HttpGet("main-image/{id}")]
        public async Task<ActionResult<object>> GetProductMainImage(int id)
        {
            try
            {
                var product = await _context.Products
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.ImageList, // Lấy cả danh sách ảnh
                        p.Price,
                        p.SalePrice
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Không tìm thấy sản phẩm với ID: {id}"
                    });
                }

                // Lấy ảnh đầu tiên trong danh sách images
                string? imageUrl = null;
                if (product.ImageList != null && product.ImageList.Count > 0)
                {
                    imageUrl = product.ImageList[0];
                }

                return Ok(new
                {
                    success = true,
                    product = new
                    {
                        product.Id,
                        product.Name,
                        MainImage = imageUrl,
                        Images = product.ImageList,
                        product.Price,
                        product.SalePrice
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

        // GET: api/products/{id} lay chi tiet san pham
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm" });
                }

                var result = new
                {
                    product.Id,
                    product.Name,
                    product.Description,
                    product.DetailedSpecs,
                    product.Price,
                    product.SalePrice,
                    product.Status,
                    product.Category,
                    Images = product.ImageList,
                    MainImage = product.MainImage,
                    IsOnSale = product.IsOnSale,
                    DiscountPercent = product.DiscountPercent,
                    product.CreatedAt,
                    product.UpdatedAt
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        // GET: admin lay danh sach san pham
        [Authorize]
        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductsForAdmin()
        {
            try
            {
                var products = await _context.Products
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.SalePrice,
                        p.Status,
                        p.Category,
                        p.CreatedAt,
                        p.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
            }
        }

        // POST: Them san pham
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDto dto)
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

                var product = new Product
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    DetailedSpecs = dto.DetailedSpecs,
                    Price = dto.Price,
                    SalePrice = dto.Status == "sale" ? dto.SalePrice : null,
                    Status = dto.Status,
                    Category = dto.Category,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Upload ảnh lên Cloudinary
                if (dto.Files != null && dto.Files.Count > 0)
                {
                    var imageUrls = new List<string>();

                    foreach (var file in dto.Files)
                    {
                        if (file.Length > 0)
                        {
                            try
                            {
                                var imageUrl = await _cloudinaryService.UploadFileAsync(file);
                                if (!string.IsNullOrEmpty(imageUrl))
                                {
                                    imageUrls.Add(imageUrl);
                                }
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Lỗi upload ảnh {file.FileName}: {ex.Message}");
                            }
                        }
                    }

                    if (imageUrls.Count > 0)
                    {
                        // Chuyển list thành JSON string
                        product.Images = System.Text.Json.JsonSerializer.Serialize(imageUrls);
                    }
                    else
                    {
                        product.Images = null; // Để NULL thay vì "[]" cho JSON column
                    }
                }
                else
                {
                    product.Images = null; // Để NULL cho JSON column
                }

                _context.Products.Add(product);
await _context.SaveChangesAsync();

var adminAccount =
    User.FindFirst(ClaimTypes.Name)?.Value
    ?? User.FindFirst("username")?.Value
    ?? "unknown";

_context.AdminLogs.Add(new AdminLog
{
    AdminAccount = adminAccount,
    Log = $"Thêm sản phẩm mới: {product.Name}",
    CreatedAt = DateTime.Now
});

await _context.SaveChangesAsync();


                // Lấy sản phẩm vừa tạo với đầy đủ thông tin
                var createdProduct = await _context.Products.FindAsync(product.Id);

                if (createdProduct == null)
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Không thể tìm thấy sản phẩm vừa tạo"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Thêm sản phẩm thành công",
                    productId = product.Id,
                    product = new
                    {
                        createdProduct.Id,
                        createdProduct.Name,
                        createdProduct.Description,
                        createdProduct.DetailedSpecs,
                        createdProduct.Price,
                        createdProduct.SalePrice,
                        createdProduct.Status,
                        createdProduct.Category,

                        Images = createdProduct.ImageList,
                        MainImage = createdProduct.MainImage,
                        IsOnSale = createdProduct.IsOnSale,
                        DiscountPercent = createdProduct.DiscountPercent,
                        createdProduct.CreatedAt,
                        createdProduct.UpdatedAt
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

[Authorize]
[HttpPut("{id}")]
public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto dto)
{
    try
    {
        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Không tìm thấy sản phẩm"
            });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                message = "Dữ liệu không hợp lệ",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        var currentImages = existingProduct.ImageList ?? new List<string>();
        var imagesToDeleteFromCloudinary = new List<string>();

        if (!string.IsNullOrEmpty(dto.ImagesToDelete))
        {
            var imagesToDelete = dto.ImagesToDelete
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .ToList();

            imagesToDeleteFromCloudinary.AddRange(imagesToDelete);
            currentImages = currentImages.Where(img => !imagesToDelete.Contains(img)).ToList();
        }

        if (dto.Files != null && dto.Files.Count > 0)
        {
            foreach (var file in dto.Files)
            {
                if (file.Length > 0)
                {
                    var imageUrl = await _cloudinaryService.UploadFileAsync(file);
                    if (!string.IsNullOrEmpty(imageUrl))
                        currentImages.Add(imageUrl);
                }
            }
        }

        existingProduct.Name = dto.Name;
        existingProduct.Description = dto.Description;
        existingProduct.DetailedSpecs = dto.DetailedSpecs;
        existingProduct.Price = dto.Price;
        existingProduct.SalePrice = dto.Status == "sale" ? dto.SalePrice : null;
        existingProduct.Status = dto.Status;
        existingProduct.Category = dto.Category;
        existingProduct.Images = currentImages.Count > 0
            ? System.Text.Json.JsonSerializer.Serialize(currentImages)
            : null;
        existingProduct.UpdatedAt = DateTime.UtcNow;

        _context.Entry(existingProduct).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";

        var log = new AdminLog
        {
            AdminAccount = adminAccount,
            Log = $"[UPDATE_PRODUCT] Cập nhật sản phẩm:(ID: {existingProduct.Id})",
            CreatedAt = DateTime.Now
        };

        _context.AdminLogs.Add(log);
        await _context.SaveChangesAsync();
        // =====================

        if (imagesToDeleteFromCloudinary.Count > 0)
        {
            try
            {
                await _cloudinaryService.DeleteFilesAsync(imagesToDeleteFromCloudinary);
            }
            catch
            {
            }
        }

        return Ok(new
        {
            success = true,
            message = "Cập nhật sản phẩm thành công",
            productId = existingProduct.Id,
            images = existingProduct.ImageList ?? new List<string>()
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


        // DELETE: api/products/{id}
[Authorize]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteProduct(int id)
{
    try
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "Không tìm thấy sản phẩm" });
        }

        var productName = product.Name;
        var productImages = product.ImageList ?? new List<string>();

        if (productImages.Count > 0)
        {
            try
            {
                await _cloudinaryService.DeleteFilesAsync(productImages);
            }
            catch
            {
            }
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";

        var log = new AdminLog
        {
            AdminAccount = adminAccount,
            Log = $"[DELETE_PRODUCT] Xóa sản phẩm: {productName} (ID: {id})",
            CreatedAt = DateTime.Now
        };

        _context.AdminLogs.Add(log);
        await _context.SaveChangesAsync();
        // =====================

        return Ok(new
        {
            success = true,
            message = "Đã xóa sản phẩm thành công",
            deletedId = id
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


[Authorize]
[HttpDelete("bulk")]
public async Task<IActionResult> DeleteProducts([FromBody] int[] ids)
{
    try
    {
        if (ids == null || ids.Length == 0)
        {
            return BadRequest(new { message = "Không có ID sản phẩm để xóa" });
        }

        var products = await _context.Products
            .Where(p => ids.Contains(p.Id))
            .ToListAsync();

        if (products.Count == 0)
        {
            return NotFound(new { message = "Không tìm thấy sản phẩm nào để xóa" });
        }

        var allImagesToDelete = new List<string>();
        foreach (var product in products)
        {
            if (product.ImageList != null)
                allImagesToDelete.AddRange(product.ImageList);
        }

        if (allImagesToDelete.Count > 0)
        {
            try
            {
                await _cloudinaryService.DeleteFilesAsync(allImagesToDelete);
            }
            catch
            {
            }
        }

        _context.Products.RemoveRange(products);
        await _context.SaveChangesAsync();

        // ===== ADMIN LOG =====
        var adminAccount = User.Identity?.Name ?? "unknown";

        var log = new AdminLog
        {
            AdminAccount = adminAccount,
            Log = $"[DELETE_BULK_PRODUCT] Xóa {products.Count} sản phẩm (IDs: {string.Join(", ", ids)})",
            CreatedAt = DateTime.Now
        };

        _context.AdminLogs.Add(log);
        await _context.SaveChangesAsync();
        // =====================

        return Ok(new
        {
            success = true,
            message = $"Đã xóa {products.Count} sản phẩm thành công",
            deletedIds = ids
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

        // POST: api/products/upload-images (Chỉ upload ảnh)
        [HttpPost("upload-images")]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Không có file ảnh nào"
                    });
                }

                var imageUrls = new List<string>();
                var uploadErrors = new List<string>();

                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        // Kiểm tra định dạng file
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                        if (!allowedExtensions.Contains(extension))
                        {
                            uploadErrors.Add($"File {file.FileName} có định dạng không hợp lệ");
                            continue;
                        }

                        // Kiểm tra kích thước file (max 5MB)
                        if (file.Length > 5 * 1024 * 1024)
                        {
                            uploadErrors.Add($"File {file.FileName} vượt quá kích thước cho phép (5MB)");
                            continue;
                        }

                        try
                        {
                            var imageUrl = await _cloudinaryService.UploadFileAsync(file);
                            if (!string.IsNullOrEmpty(imageUrl))
                            {
                                imageUrls.Add(imageUrl);
                            }
                            else
                            {
                                uploadErrors.Add($"Không thể upload file {file.FileName}");
                            }
                        }
                        catch (Exception ex)
                        {
                            uploadErrors.Add($"Lỗi upload file {file.FileName}: {ex.Message}");
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = $"Đã upload {imageUrls.Count} ảnh thành công",
                    imageUrls = imageUrls,
                    errors = uploadErrors.Count > 0 ? uploadErrors : null
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