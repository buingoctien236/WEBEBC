using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MrKitApi.Data;
using MrKitApi.Models;
using MrKitApi.Dtos;
using MrKitApi.Services;
using System.Security.Claims;
[ApiController]
[Route("api/admin/logs")]

public class AdminLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs()
    {
        try
        {
            var logs = await _context.AdminLogs
                .OrderByDescending(l => l.CreatedAt)
                .Take(100) // Giới hạn 100 logs mới nhất
                .Select(l => new
                {
                    id = l.Id,
                    admin_account = l.AdminAccount,
                    log = l.Log,
                    created_at = l.CreatedAt
                })
                .ToListAsync();

            return Ok(logs);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Lỗi khi lấy logs",
                error = ex.Message
            });
        }
    }
}
