using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Reservation_API.DataTransferObjects
{
    public class PaginationResult<T> where T : class, new()
    {
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public byte PageSize{ get; set; }
        public int TotalPages { get; set; }
        public List<T> Items { get; set; }

        public PaginationResult()
        {
            Items = new List<T>();
        }

        public PaginationResult(List<T> items, int count, int page, byte pageSize)
        {
            TotalItems = count;
            Page = page;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(count/(double)pageSize);
            Items = items;
        }

        public static async Task<PaginationResult<T>> CreateAsync(IQueryable<T> queryable, int page, byte pageSize)
        {
            //make a cero-based pagination
            var count = await queryable.CountAsync();
            var items = await queryable.Skip(page*pageSize).Take(pageSize).ToListAsync();
            return new PaginationResult<T>(items, count, page, pageSize);
        }
    }
}
