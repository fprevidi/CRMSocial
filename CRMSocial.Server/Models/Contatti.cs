using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMSocial.Models
{
    public class Contatti
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdContatti { get; set; }

        [MaxLength(50)]
        public string Cognome { get; set; }

        [MaxLength(50)]
        public string Nome { get; set; }

        [MaxLength(50)]
        public string Cellulare { get; set; }

        [MaxLength(50)]
        public string Email { get; set; }

        public Guid Uid { get; set; }

        public virtual ICollection<ContattiAttivita> Attivita { get; set; }
    }
}
