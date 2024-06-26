using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMSocial.Models
{
    [Table("Utente")]
    public class Utenti
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IDUtente { get; set; }

        [MaxLength(50)]
        public string Username { get; set; }

        [MaxLength(50)]
        public string Password { get; set; }

        [ForeignKey("TipoLivello")]
        public int Livello { get; set; }

        public string Cognome { get; set; }

        [MaxLength(50)]
        public string Nome { get; set; }

        public Guid UID { get; set; }

        public int? IDMedico { get; set; }

        public string Email { get; set; }

        public virtual TipoLivello TipoLivello { get; set; }

       
    }
}
