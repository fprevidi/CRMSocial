using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMSocial.Models
{
    public class ContattiAttivita
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdAttivita { get; set; }

        [ForeignKey("Contatti")]
        public int IdContatti { get; set; }

        public DateTime Data { get; set; }

        public string Descrizione { get; set; }

        public DateTime? ProssimoContatto { get; set; }

        public Contatti Contatti { get; set; }
    }
}
