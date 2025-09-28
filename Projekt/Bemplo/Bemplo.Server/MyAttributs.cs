namespace Bemplo.Server
{
    public class RoleCeskyAttribute : Attribute
    {
        public string Nazev { get; }
        public RoleCeskyAttribute(string nazev)
        {
            this.Nazev = nazev;
        }
    }
}
