using Microsoft.EntityFrameworkCore;
using Project.Domain;

namespace Project;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{

    public DbSet<Client> Clients => Set<Client>();
}