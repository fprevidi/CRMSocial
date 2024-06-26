using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace CRMSocial.Data
{
    public class CRMSocialContext : DbContext
    {
        public CRMSocialContext(DbContextOptions<CRMSocialContext> options) : base(options)
        {
        }

        public DbSet<CRMSocial.Models.Contatti> Contatti { get; set; }
        public DbSet<CRMSocial.Models.ContattiAttivita> ContattiAttivita { get; set; }
        public DbSet<CRMSocial.Models.Utenti> Utenti { get; set; }
        public DbSet<CRMSocial.Models.TipoLivello> TipiLivello { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CRMSocial.Models.Contatti>(entity =>
            {
                entity.HasKey(e => e.IdContatti);
                entity.Property(e => e.Uid)
                      .HasDefaultValueSql("NEWID()");
                entity.HasMany(e => e.Attivita)
                      .WithOne(e => e.Contatti)
                      .HasForeignKey(e => e.IdContatti)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<CRMSocial.Models.ContattiAttivita>(entity =>
            {
                entity.HasKey(e => e.IdAttivita);
                entity.Property(e => e.Descrizione)
                      .HasColumnType("nvarchar(max)");
            });

            modelBuilder.Entity<CRMSocial.Models.Utenti>(entity =>
            {
                entity.HasKey(e => e.IDUtente);
                entity.Property(e => e.UID)
                      .HasDefaultValueSql("NEWID()");
                entity.HasOne(e => e.TipoLivello)
                      .WithMany(e => e.Utenti)
                      .HasForeignKey(e => e.Livello);

            });

       

            modelBuilder.Entity<CRMSocial.Models.TipoLivello>(entity =>
            {
                entity.HasKey(e => e.Livello);
                // Configurazioni specifiche per TipoLivello
            });
        }
    }
}
