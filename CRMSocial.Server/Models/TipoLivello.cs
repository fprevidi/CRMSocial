using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CRMSocial.Models
{
    public class TipoLivello
    {
        [Key]
        public int Livello { get; set; }

        // Altri campi specifici per TipoLivello

        public ICollection<Utenti> Utenti { get; set; }

      
    }
}
