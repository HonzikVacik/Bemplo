namespace Bemplo.Server.Models
{
    public class WorkingPeriod
    {
        public int Id { get; set; }
        public WorkingRelationship Working_Relationship_ID { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
    }
}