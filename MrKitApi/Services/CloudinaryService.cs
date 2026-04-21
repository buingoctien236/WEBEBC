// Services/CloudinaryService.cs
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace MrKitApi.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string?> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0) return null;

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Type = "upload" // Xác định đây là upload thông thường
            };
            
            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUrl.AbsoluteUri;
        }

        public async Task<bool> DeleteFileAsync(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                    return false;

                Console.WriteLine($"=== DELETE FILE START: {imageUrl} ===");

                // Extract public_id từ URL
                var uri = new Uri(imageUrl);
                var segments = uri.Segments;
                
                // Debug: In ra các segments
                Console.WriteLine($"URL Segments: {string.Join(" | ", segments)}");
                
                if (segments.Length < 5)
                {
                    Console.WriteLine($"ERROR: URL không đúng định dạng, segments < 5");
                    return false;
                }
                
                // Lấy phần sau "upload/"
                var uploadIndex = -1;
                for (int i = 0; i < segments.Length; i++)
                {
                    if (segments[i].ToLower() == "upload/")
                    {
                        uploadIndex = i;
                        break;
                    }
                }
                
                if (uploadIndex == -1 || uploadIndex >= segments.Length - 1)
                {
                    Console.WriteLine($"ERROR: Không tìm thấy 'upload/' trong URL");
                    return false;
                }
                
                // Kết hợp các segment sau "upload/" và bỏ extension
                var publicIdWithExtension = string.Join("", segments.Skip(uploadIndex + 1));
                var publicId = System.IO.Path.GetFileNameWithoutExtension(publicIdWithExtension);
                
                Console.WriteLine($"Extracted public_id: {publicId}");

                // QUAN TRỌNG: Thêm Type = "upload"
                var deleteParams = new DeletionParams(publicId)
                {
                    ResourceType = ResourceType.Image,
                    Type = "upload", // <--- THIẾU DÒNG NÀY!
                    Invalidate = true // Xóa cache CDN
                };

                Console.WriteLine($"Calling Cloudinary API with: public_id={publicId}, type=upload");

                var result = await _cloudinary.DestroyAsync(deleteParams);
                
                Console.WriteLine($"Delete result: {result.Result}, StatusCode: {result.StatusCode}, Error: {result.Error?.Message}");
                
                return result.Result == "ok";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR deleting image {imageUrl}: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return false;
            }
        }
        

        // Method xóa nhiều ảnh
        public async Task<List<string>> DeleteFilesAsync(List<string> imageUrls)
        {
            var deletedUrls = new List<string>();
            
            foreach (var url in imageUrls)
            {
                Console.WriteLine($"Attempting to delete: {url}");
                if (await DeleteFileAsync(url))
                {
                    deletedUrls.Add(url);
                    Console.WriteLine($"Successfully deleted: {url}");
                }
                else
                {
                    Console.WriteLine($"Failed to delete: {url}");
                }
            }
            
            return deletedUrls;
        }
        
    }
    
}